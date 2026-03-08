import type { GameRef, GameConfig } from '../types/game'
import type { GhostEntity, PacManEntity, Direction } from '../types/entities'
import type { MazeLayout } from '../types/maze'
import { getMazeForLevel } from '../mazes'
import { DIFFICULTY_CONFIGS, GHOST_SPEED_FOR_CONFIG } from '../constants/difficulty'
import { GHOST_COLORS, GHOST_RELEASE_THRESHOLDS } from '../constants/ghosts'
import { TILE_SIZE, DEATH_ANIM_DURATION, LEVEL_COMPLETE_DURATION, COUNTDOWN_DURATION } from '../constants/game'
import { tileToPixel, isTileEatable, getTileIndex } from './collision'
import { updatePacman } from './movement'
import { updateGhostMovement } from './ai/index'
import { updateModeTimer, activateFrightened } from './modeTimer'
import { updatePowerUps, activatePowerUp } from './powerups'
import { updateParticles, createParticlePool } from '../particles/particleSystem'
import { emitDotEat, emitGhostEat, emitEnergizerEat, emitPowerUpEat, emitPacmanDeath } from '../particles/effects'
import { checkFruitSpawn, updateFruit } from './fruit'
import { scoreForTile, scoreForGhostEat } from './scoring'
import { render } from '../rendering/renderer'
import { Sounds } from '../audio/sounds'
import type { GameStoreState } from '../store/gameStore'

function makePacman(maze: MazeLayout, config: GameConfig): PacManEntity {
  const pos = tileToPixel(maze.pacmanStart.x, maze.pacmanStart.y)
  return {
    pos: { ...pos },
    tilePos: { ...maze.pacmanStart },
    direction: 'NONE',
    nextDirection: 'NONE',
    speed: config.pacmanSpeedBase,
    mouthAngle: 0.3,
    mouthOpen: true,
    activePowerUps: [],
  }
}

function makeGhost(name: GhostEntity['name'], maze: MazeLayout, config: GameConfig): GhostEntity {
  const startTile = { ...maze.ghostHouseCenter }
  if (name === 'BLINKY') {
    // Blinky starts just above ghost house (at the exit tile, row 11)
    startTile.x = maze.ghostExitTile.x
    startTile.y = maze.ghostExitTile.y
  }
  const pos = tileToPixel(startTile.x, startTile.y)
  const speed = GHOST_SPEED_FOR_CONFIG(config)

  return {
    name,
    pos: { ...pos },
    tilePos: { ...startTile },
    direction: 'NONE',
    nextDirection: 'NONE',
    speed,
    mode: name === 'BLINKY' ? 'SCATTER' : 'HOUSE',
    color: GHOST_COLORS[name],
    frightColor: '#0000CC',
    targetTile: { ...maze.scatterTargets[name] },
    isFlashing: false,
    dotCounter: 0,
    homeCorner: { ...maze.scatterTargets[name] },
    atIntersection: false,
  }
}

function initTileState(maze: MazeLayout): Uint8Array {
  const state = new Uint8Array(maze.tiles.length)
  for (let i = 0; i < maze.tiles.length; i++) {
    state[i] = isTileEatable(maze.tiles[i]) ? 1 : 0
  }
  return state
}

export function createGameRef(level: number, difficulty: GameStoreState['difficulty']): GameRef {
  const config = DIFFICULTY_CONFIGS[difficulty]
  const maze = getMazeForLevel(level)
  const tileState = initTileState(maze)
  const particles = createParticlePool()

  return {
    pacman: makePacman(maze, config),
    ghosts: (['BLINKY', 'PINKY', 'INKY', 'CLYDE'] as const).map(n => makeGhost(n, maze, config)),
    particles,
    tileState,
    dotsRemaining: maze.dotCount,
    fruit: null,
    modeTimer: {
      current: 'SCATTER',
      scheduleIndex: 0,
      elapsed: 0,
      frightActive: false,
      frightElapsed: 0,
    },
    maze,
    gameTime: 0,
    score: 0,
    lives: 3,
    level,
    comboCount: 0,
    phase: 'COUNTDOWN',
    deathTimer: 0,
    levelCompleteTimer: 0,
    countdownTimer: 0,
    lastChompWasA: true,
    sirenNode: null,
    frightNode: null,
    particleNextId: 0,
  }
}

export function createGameLoop(
  canvas: HTMLCanvasElement,
  storeRef: React.MutableRefObject<GameStoreState>,
  gameRef: GameRef,
): { start: () => void; stop: () => void; queueDirection: (dir: Direction) => void } {
  const ctx = canvas.getContext('2d')!
  let rafId = 0
  let lastTime = 0
  let queuedDir: Direction = 'NONE'

  const config = DIFFICULTY_CONFIGS[storeRef.current.difficulty]

  function applyQueuedDirection(): void {
    if (queuedDir !== 'NONE') {
      gameRef.pacman.nextDirection = queuedDir
      queuedDir = 'NONE'
    }
  }

  function handleGhostRelease(dt: number): void {
    const dotsEaten = gameRef.maze.dotCount - gameRef.dotsRemaining
    for (const ghost of gameRef.ghosts) {
      if (ghost.mode !== 'HOUSE' && ghost.mode !== 'LEAVING') continue
      const threshold = GHOST_RELEASE_THRESHOLDS[ghost.name]
      if (dotsEaten >= threshold && ghost.mode === 'HOUSE') {
        ghost.mode = 'LEAVING'
        ghost.direction = 'UP'
      }
      // Handle leaving: move toward exit
      if (ghost.mode === 'LEAVING') {
        const exitPixel = tileToPixel(gameRef.maze.ghostExitTile.x, gameRef.maze.ghostExitTile.y)
        const dy = exitPixel.y - ghost.pos.y
        if (Math.abs(dy) < ghost.speed * dt + 2) {
          ghost.pos.y = exitPixel.y
          ghost.tilePos.y = gameRef.maze.ghostExitTile.y
          ghost.mode = 'SCATTER'
          ghost.direction = 'LEFT'
        } else {
          ghost.pos.y -= ghost.speed * dt * 0.6
          ghost.tilePos.y = Math.round((ghost.pos.y - TILE_SIZE / 2) / TILE_SIZE)
        }
      }
    }
  }

  function handleEatenGhostReturn(): void {
    for (const ghost of gameRef.ghosts) {
      if (ghost.mode !== 'EATEN') continue
      const homePixel = tileToPixel(gameRef.maze.ghostHouseCenter.x, gameRef.maze.ghostHouseCenter.y)
      const dx = homePixel.x - ghost.pos.x
      const dy = homePixel.y - ghost.pos.y
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        ghost.pos.x = homePixel.x
        ghost.pos.y = homePixel.y
        ghost.mode = 'HOUSE'
        ghost.direction = 'NONE'
        ghost.speed = GHOST_SPEED_FOR_CONFIG(config)
      }
    }
  }

  function checkCollisions(): void {
    const pac = gameRef.pacman
    const maze = gameRef.maze

    // Dot eating
    const col = pac.tilePos.x
    const row = pac.tilePos.y
    const idx = getTileIndex(maze, col, row)

    if (gameRef.tileState[idx] === 1) {
      const tile = maze.tiles[idx]
      if (isTileEatable(tile)) {
        gameRef.tileState[idx] = 0
        gameRef.dotsRemaining--

        const pts = scoreForTile(tile)
        gameRef.score += pts
        storeRef.current.setScore(gameRef.score)

        const px = col * TILE_SIZE + TILE_SIZE / 2
        const py = row * TILE_SIZE + TILE_SIZE / 2

        if (tile === 'DOT') {
          emitDotEat(gameRef, px, py)
          Sounds.dotEaten(gameRef)
        } else if (tile === 'ENERGIZER') {
          emitEnergizerEat(gameRef, px, py)
          Sounds.energizerCollected()
          activateFrightened(gameRef, config.frightDuration)
          Sounds.startFrightened(gameRef)
        } else if (tile === 'POWER_SPEED' || tile === 'POWER_FREEZE' || tile === 'POWER_MAGNET') {
          const type = tile === 'POWER_SPEED' ? 'SPEED' : tile === 'POWER_FREEZE' ? 'FREEZE' : 'MAGNET'
          emitPowerUpEat(gameRef, px, py, type)
          Sounds.powerUpCollected(type)
          activatePowerUp(gameRef, type, config)
        }

        checkFruitSpawn(gameRef)

        if (gameRef.dotsRemaining <= 0) {
          Sounds.levelComplete()
          Sounds.stopSiren(gameRef)
          Sounds.stopFrightened(gameRef)
          gameRef.phase = 'LEVEL_COMPLETE'
          gameRef.levelCompleteTimer = 0
          storeRef.current.setPhase('LEVEL_COMPLETE')
        }
      }
    }

    // Fruit eating
    if (gameRef.fruit?.active) {
      const fx = gameRef.fruit.tilePos.x
      const fy = gameRef.fruit.tilePos.y
      if (col === fx && row === fy) {
        gameRef.score += gameRef.fruit.points
        storeRef.current.setScore(gameRef.score)
        Sounds.fruitCollected()
        gameRef.fruit.active = false
      }
    }

    // Ghost collision
    for (const ghost of gameRef.ghosts) {
      if (ghost.mode === 'EATEN' || ghost.mode === 'HOUSE' || ghost.mode === 'LEAVING') continue
      const dx = Math.abs(pac.pos.x - ghost.pos.x)
      const dy = Math.abs(pac.pos.y - ghost.pos.y)
      const hitRadius = TILE_SIZE * 0.7

      if (dx < hitRadius && dy < hitRadius) {
        if (ghost.mode === 'FRIGHTENED') {
          ghost.mode = 'EATEN'
          ghost.speed = GHOST_SPEED_FOR_CONFIG(config) * 2  // eaten ghosts move faster
          gameRef.comboCount++
          const pts = scoreForGhostEat(gameRef.comboCount)
          gameRef.score += pts
          storeRef.current.setScore(gameRef.score)
          emitGhostEat(gameRef, ghost.pos.x, ghost.pos.y, ghost.color)
          Sounds.ghostEaten(gameRef.comboCount)
        } else {
          // Pac-Man hit — start death sequence
          gameRef.lives--
          storeRef.current.setLives(gameRef.lives)
          emitPacmanDeath(gameRef, pac.pos.x, pac.pos.y)
          Sounds.pacmanDied()
          Sounds.stopSiren(gameRef)
          Sounds.stopFrightened(gameRef)
          gameRef.phase = 'PACMAN_DYING'
          gameRef.deathTimer = 0
          storeRef.current.setPhase('PACMAN_DYING')
        }
      }
    }
  }

  function update(dt: number): void {
    const phase = gameRef.phase
    gameRef.gameTime += dt

    if (phase === 'COUNTDOWN') {
      gameRef.countdownTimer += dt * 1000
      updateParticles(gameRef, dt)

      // Beep at each second
      const prevSec = Math.floor((gameRef.countdownTimer - dt * 1000) / 1000)
      const currSec = Math.floor(gameRef.countdownTimer / 1000)
      if (currSec > prevSec && currSec <= 3) {
        Sounds.countdown(3 - currSec)
      }

      if (gameRef.countdownTimer >= COUNTDOWN_DURATION) {
        gameRef.phase = 'PLAYING'
        storeRef.current.setPhase('PLAYING')
        Sounds.startSiren(gameRef)
      }
      return
    }

    if (phase === 'PACMAN_DYING') {
      gameRef.deathTimer += dt * 1000
      updateParticles(gameRef, dt)
      if (gameRef.deathTimer >= DEATH_ANIM_DURATION) {
        if (gameRef.lives <= 0) {
          gameRef.phase = 'GAME_OVER'
          storeRef.current.setPhase('GAME_OVER')
        } else {
          // Respawn
          const newPac = makePacman(gameRef.maze, config)
          Object.assign(gameRef.pacman, newPac)
          for (const ghost of gameRef.ghosts) {
            const fresh = makeGhost(ghost.name, gameRef.maze, config)
            Object.assign(ghost, fresh)
          }
          gameRef.modeTimer = { current: 'SCATTER', scheduleIndex: 0, elapsed: 0, frightActive: false, frightElapsed: 0 }
          gameRef.phase = 'COUNTDOWN'
          gameRef.countdownTimer = 0
          storeRef.current.setPhase('COUNTDOWN')
        }
      }
      return
    }

    if (phase === 'LEVEL_COMPLETE') {
      gameRef.levelCompleteTimer += dt * 1000
      updateParticles(gameRef, dt)
      if (gameRef.levelCompleteTimer >= LEVEL_COMPLETE_DURATION) {
        const nextLevel = gameRef.level + 1
        gameRef.level = nextLevel
        storeRef.current.setLevel(nextLevel)
        const nextMaze = getMazeForLevel(nextLevel)
        gameRef.maze = nextMaze
        gameRef.tileState = initTileState(nextMaze)
        gameRef.dotsRemaining = nextMaze.dotCount
        gameRef.fruit = null
        const newPac = makePacman(nextMaze, config)
        Object.assign(gameRef.pacman, newPac)
        for (const ghost of gameRef.ghosts) {
          const fresh = makeGhost(ghost.name, nextMaze, config)
          Object.assign(ghost, fresh)
        }
        gameRef.modeTimer = { current: 'SCATTER', scheduleIndex: 0, elapsed: 0, frightActive: false, frightElapsed: 0 }
        gameRef.phase = 'COUNTDOWN'
        gameRef.countdownTimer = 0
        storeRef.current.setPhase('COUNTDOWN')
        Sounds.startSiren(gameRef)
      }
      return
    }

    if (phase !== 'PLAYING') return

    applyQueuedDirection()
    updateModeTimer(gameRef, dt, config)
    updatePacman(gameRef, dt)

    handleGhostRelease(dt)
    for (const ghost of gameRef.ghosts) {
      if (ghost.mode !== 'HOUSE') {
        updateGhostMovement(ghost, gameRef, dt)
      }
    }
    handleEatenGhostReturn()

    checkCollisions()
    updatePowerUps(gameRef, dt, config)
    updateFruit(gameRef)
    updateParticles(gameRef, dt)
  }

  function tick(timestamp: number): void {
    if (!lastTime) lastTime = timestamp
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05)  // cap at 50ms
    lastTime = timestamp

    update(dt)
    render(ctx, gameRef)

    // Draw countdown overlay
    if (gameRef.phase === 'COUNTDOWN') {
      const sec = Math.max(1, 3 - Math.floor(gameRef.countdownTimer / 1000))
      const text = gameRef.countdownTimer < COUNTDOWN_DURATION ? String(sec) : 'GO!'
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#FFE566'
      ctx.font = 'bold 48px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    }

    rafId = requestAnimationFrame(tick)
  }

  return {
    start() {
      lastTime = 0
      rafId = requestAnimationFrame(tick)
    },
    stop() {
      cancelAnimationFrame(rafId)
      Sounds.stopSiren(gameRef)
      Sounds.stopFrightened(gameRef)
    },
    queueDirection(dir: Direction) {
      queuedDir = dir
    },
  }
}
