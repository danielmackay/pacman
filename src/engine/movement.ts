import type { GameRef } from '../types/game'
import { getTile, isWalkable, tileToPixel, directionOffset, pixelToTile } from './collision'
import { TILE_SIZE, MOUTH_ANIM_SPEED } from '../constants/game'

export function updatePacman(state: GameRef, dt: number): void {
  const pac = state.pacman
  const maze = state.maze

  // Try to switch to buffered direction
  if (pac.nextDirection !== 'NONE' && pac.nextDirection !== pac.direction) {
    const off = directionOffset(pac.nextDirection)
    const checkCol = pac.tilePos.x + off.x
    const checkRow = pac.tilePos.y + off.y
    const tile = getTile(maze, checkCol, checkRow)
    // Can turn if near tile center and next tile is walkable
    const center = tileToPixel(pac.tilePos.x, pac.tilePos.y)
    const nearCenter = Math.abs(pac.pos.x - center.x) < TILE_SIZE * 0.4 &&
                       Math.abs(pac.pos.y - center.y) < TILE_SIZE * 0.4
    if (nearCenter && isWalkable(tile, false)) {
      pac.direction = pac.nextDirection
      pac.pos.x = center.x
      pac.pos.y = center.y
    }
  }

  // Check wall ahead
  if (pac.direction !== 'NONE') {
    const off = directionOffset(pac.direction)
    const nextCol = pac.tilePos.x + off.x
    const nextRow = pac.tilePos.y + off.y
    const nextTile = getTile(maze, nextCol, nextRow)
    const center = tileToPixel(pac.tilePos.x, pac.tilePos.y)

    if (!isWalkable(nextTile, false)) {
      // Stop at tile center
      const wouldPassX = pac.direction === 'LEFT' && pac.pos.x - pac.speed * dt <= center.x
                      || pac.direction === 'RIGHT' && pac.pos.x + pac.speed * dt >= center.x
      const wouldPassY = pac.direction === 'UP'   && pac.pos.y - pac.speed * dt <= center.y
                      || pac.direction === 'DOWN'  && pac.pos.y + pac.speed * dt >= center.y
      if (wouldPassX || wouldPassY) {
        pac.pos.x = center.x
        pac.pos.y = center.y
        return  // stuck
      }
    }

    // Move
    const dx = off.x * pac.speed * dt
    const dy = off.y * pac.speed * dt
    pac.pos.x += dx
    pac.pos.y += dy

    // Tunnel wrap
    if (pac.pos.x < 0) pac.pos.x = maze.cols * TILE_SIZE
    if (pac.pos.x > maze.cols * TILE_SIZE) pac.pos.x = 0
  }

  // Update tile position
  const tilePos = pixelToTile(pac.pos.x - TILE_SIZE / 2 + 1, pac.pos.y - TILE_SIZE / 2 + 1)
  pac.tilePos.x = Math.max(0, Math.min(maze.cols - 1, tilePos.x))
  pac.tilePos.y = Math.max(0, Math.min(maze.rows - 1, tilePos.y))

  // Mouth animation
  if (pac.direction !== 'NONE') {
    if (pac.mouthOpen) {
      pac.mouthAngle += MOUTH_ANIM_SPEED * dt
      if (pac.mouthAngle >= Math.PI / 3) {
        pac.mouthAngle = Math.PI / 3
        pac.mouthOpen = false
      }
    } else {
      pac.mouthAngle -= MOUTH_ANIM_SPEED * dt
      if (pac.mouthAngle <= 0.05) {
        pac.mouthAngle = 0.05
        pac.mouthOpen = true
      }
    }
  }
}
