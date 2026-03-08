import type { GameRef } from '../types/game'
import { drawMaze } from './drawMaze'
import { drawPellets } from './drawPellets'
import { drawGhosts } from './drawGhosts'
import { drawPacman } from './drawPacman'
import { drawParticles } from './drawParticles'
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE, DEATH_ANIM_DURATION } from '../constants/game'

export function render(ctx: CanvasRenderingContext2D, state: GameRef): void {
  // Clear
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  drawMaze(ctx, state.maze)
  drawPellets(ctx, state.maze, state.tileState, state.gameTime)

  // Fruit
  if (state.fruit?.active) {
    ctx.font = `${TILE_SIZE}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(state.fruit.symbol, state.fruit.pixelPos.x, state.fruit.pixelPos.y)
  }

  drawGhosts(ctx, state.ghosts, state.gameTime)

  const deathProgress = state.phase === 'PACMAN_DYING'
    ? Math.min(state.deathTimer / (DEATH_ANIM_DURATION * 0.7), 1)
    : 0

  drawPacman(ctx, state.pacman, deathProgress)
  drawParticles(ctx, state.particles)

  // Active power-up indicators
  drawPowerUpHUD(ctx, state)
}

function drawPowerUpHUD(ctx: CanvasRenderingContext2D, state: GameRef): void {
  const nowMs = state.gameTime * 1000
  const active = state.pacman.activePowerUps.filter(p => p.expiresAt > nowMs)
  if (active.length === 0) return

  const colors: Record<string, string> = {
    SPEED:  '#00FFFF',
    FREEZE: '#C0C0FF',
    MAGNET: '#FFD700',
  }
  const labels: Record<string, string> = {
    SPEED: '›',
    FREEZE: '*',
    MAGNET: '⊕',
  }

  active.forEach((p, i) => {
    const x = CANVAS_WIDTH - 20
    const y = 30 + i * 28
    const remaining = (p.expiresAt - nowMs) / 1000
    const total = p.type === 'FREEZE' ? 3 : p.type === 'MAGNET' ? 4 : 5
    const ratio = remaining / total

    // Background bar
    ctx.fillStyle = '#222'
    ctx.fillRect(x - 42, y - 8, 40, 16)

    // Fill bar
    ctx.fillStyle = colors[p.type]
    ctx.fillRect(x - 42, y - 8, 40 * ratio, 16)

    // Label
    ctx.fillStyle = '#000'
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(labels[p.type], x - 22, y + 1)
  })
}
