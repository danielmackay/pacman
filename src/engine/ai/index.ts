import type { GameRef } from '../../types/game'
import type { GhostEntity, Vector2 } from '../../types/entities'
import type { Direction } from '../../types/entities'
import { blinkyTarget } from './blinky'
import { pinkyTarget } from './pinky'
import { inkyTarget } from './inky'
import { clydeTarget } from './clyde'
import { getTile, reverseDirection, manhattanDistance } from '../collision'
import { TILE_SIZE } from '../../constants/game'

const DIRECTIONS: Direction[] = ['UP', 'LEFT', 'DOWN', 'RIGHT']

function canGhostWalkTile(ghost: GhostEntity, tileType: import('../../types/maze').TileType): boolean {
  if (tileType === 'WALL') return false

  const isEaten = ghost.mode === 'EATEN'
  const isLeaving = ghost.mode === 'LEAVING'

  // Ghost door: only EATEN (returning) and LEAVING (exiting) ghosts can use it
  if (tileType === 'GHOST_DOOR') return isEaten || isLeaving

  // Ghost house interior: only EATEN, HOUSE, and LEAVING ghosts can enter
  if (tileType === 'GHOST_HOUSE') return isEaten || ghost.mode === 'HOUSE' || isLeaving

  return true
}

function getChaseTarget(ghost: GhostEntity, state: GameRef): Vector2 {
  switch (ghost.name) {
    case 'BLINKY': return blinkyTarget(state)
    case 'PINKY':  return pinkyTarget(state)
    case 'INKY':   return inkyTarget(state)
    case 'CLYDE':  return clydeTarget(ghost, state)
  }
}

export function computeGhostTarget(ghost: GhostEntity, state: GameRef): Vector2 {
  switch (ghost.mode) {
    case 'SCATTER':    return ghost.homeCorner
    case 'CHASE':      return getChaseTarget(ghost, state)
    case 'FRIGHTENED': return ghost.homeCorner  // random handled in direction choice
    case 'EATEN':      return state.maze.ghostHouseCenter
    case 'LEAVING':    return state.maze.ghostExitTile
    case 'HOUSE':      return state.maze.ghostHouseCenter
  }
}

export function chooseGhostDirection(ghost: GhostEntity, target: Vector2, state: GameRef): Direction {
  const { tilePos, direction } = ghost
  const opp = reverseDirection(direction)
  const maze = state.maze

  let bestDir: Direction = direction
  let bestDist = Infinity
  let foundAny = false

  // Frightened mode: pick a random valid direction (not reverse)
  const frightened = ghost.mode === 'FRIGHTENED'
  const validDirs: Direction[] = []

  for (const dir of DIRECTIONS) {
    if (dir === opp && direction !== 'NONE') continue

    const nx = tilePos.x + (dir === 'LEFT' ? -1 : dir === 'RIGHT' ? 1 : 0)
    const ny = tilePos.y + (dir === 'UP' ? -1 : dir === 'DOWN' ? 1 : 0)
    const tile = getTile(maze, nx, ny)

    if (!canGhostWalkTile(ghost, tile)) continue

    if (frightened) {
      validDirs.push(dir)
    } else {
      const dist = manhattanDistance({ x: nx, y: ny }, target)
      if (!foundAny || dist < bestDist) {
        bestDist = dist
        bestDir = dir
        foundAny = true
      }
    }
  }

  if (frightened && validDirs.length > 0) {
    return validDirs[Math.floor(Math.random() * validDirs.length)]
  }

  return bestDir
}

/**
 * Move a ghost by dt seconds.
 *
 * Uses tile-crossing detection: the ghost moves freely, and when it crosses
 * into a new tile it snaps to that tile's center and picks the next direction.
 * This avoids the snap-back-every-frame bug from threshold-based centering.
 */
export function updateGhostMovement(ghost: GhostEntity, state: GameRef, dt: number): void {
  const maze = state.maze
  const speed = ghost.speed
  const moveAmount = speed * dt

  // Pick initial direction when standing still
  if (ghost.direction === 'NONE') {
    const target = computeGhostTarget(ghost, state)
    ghost.targetTile = target
    ghost.direction = chooseGhostDirection(ghost, target, state)
    if (ghost.direction === 'NONE') return
  }

  const dx = ghost.direction === 'LEFT' ? -1 : ghost.direction === 'RIGHT' ? 1 : 0
  const dy = ghost.direction === 'UP'   ? -1 : ghost.direction === 'DOWN'  ? 1 : 0

  const prevX = ghost.pos.x
  const prevY = ghost.pos.y

  let newX = prevX + dx * moveAmount
  let newY = prevY + dy * moveAmount

  // Tunnel wrap
  if (newX < 0) newX = maze.cols * TILE_SIZE
  if (newX > maze.cols * TILE_SIZE) newX = 0

  // Compute tile from pixel position (top-left corner of ghost)
  const prevTileX = Math.floor(prevX / TILE_SIZE)
  const prevTileY = Math.floor(prevY / TILE_SIZE)
  const newTileX  = Math.max(0, Math.min(maze.cols - 1, Math.floor(newX / TILE_SIZE)))
  const newTileY  = Math.max(0, Math.min(maze.rows - 1, Math.floor(newY / TILE_SIZE)))

  const enteredNewTile = newTileX !== prevTileX || newTileY !== prevTileY

  if (enteredNewTile) {
    // Check if new tile is walkable before committing
    const newTile = getTile(maze, newTileX, newTileY)
    if (!canGhostWalkTile(ghost, newTile)) {
      // Hit a wall — stop at tile center boundary
      const wallCenterX = prevTileX * TILE_SIZE + TILE_SIZE / 2
      const wallCenterY = prevTileY * TILE_SIZE + TILE_SIZE / 2
      ghost.pos.x = wallCenterX
      ghost.pos.y = wallCenterY
      // Force re-evaluate direction
      ghost.direction = 'NONE'
      return
    }

    // Snap to center of the new tile
    const snapX = newTileX * TILE_SIZE + TILE_SIZE / 2
    const snapY = newTileY * TILE_SIZE + TILE_SIZE / 2

    ghost.pos.x = snapX
    ghost.pos.y = snapY
    ghost.tilePos.x = newTileX
    ghost.tilePos.y = newTileY

    // Choose direction for the NEXT tile from here
    const target = computeGhostTarget(ghost, state)
    ghost.targetTile = target
    ghost.direction = chooseGhostDirection(ghost, target, state)
  } else {
    ghost.pos.x = newX
    ghost.pos.y = newY
  }
}
