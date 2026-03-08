import type { MazeLayout } from '../types/maze'
import { TILE_SIZE } from '../constants/game'
import { setGlow, clearGlow } from './glowHelpers'

const WALL_COLOR = '#1a1aff'
const WALL_GLOW = '#0044ff'
const FLOOR_COLOR = '#000000'
const GHOST_HOUSE_COLOR = '#110011'
const GHOST_DOOR_COLOR = '#FFB8FF'

export function drawMaze(ctx: CanvasRenderingContext2D, maze: MazeLayout): void {
  const { cols, rows, tiles } = maze

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tile = tiles[row * cols + col]
      const x = col * TILE_SIZE
      const y = row * TILE_SIZE

      switch (tile) {
        case 'WALL':
          drawWall(ctx, x, y, col, row, maze)
          break
        case 'GHOST_HOUSE':
          ctx.fillStyle = GHOST_HOUSE_COLOR
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
          break
        case 'GHOST_DOOR':
          ctx.fillStyle = FLOOR_COLOR
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
          // Draw door as a horizontal bar
          setGlow(ctx, GHOST_DOOR_COLOR, 6)
          ctx.fillStyle = GHOST_DOOR_COLOR
          ctx.fillRect(x, y + TILE_SIZE / 2 - 2, TILE_SIZE, 4)
          clearGlow(ctx)
          break
        default:
          ctx.fillStyle = FLOOR_COLOR
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
      }
    }
  }
}

function drawWall(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  col: number, row: number,
  maze: MazeLayout,
): void {
  ctx.fillStyle = '#00008B'
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)

  // Draw neon border edges where wall meets non-wall
  setGlow(ctx, WALL_GLOW, 8)
  ctx.strokeStyle = WALL_COLOR
  ctx.lineWidth = 2

  const neighbors = {
    up:    row > 0 ? maze.tiles[(row - 1) * maze.cols + col] : 'WALL',
    down:  row < maze.rows - 1 ? maze.tiles[(row + 1) * maze.cols + col] : 'WALL',
    left:  col > 0 ? maze.tiles[row * maze.cols + (col - 1)] : 'WALL',
    right: col < maze.cols - 1 ? maze.tiles[row * maze.cols + (col + 1)] : 'WALL',
  }

  ctx.beginPath()
  if (neighbors.up !== 'WALL') {
    ctx.moveTo(x, y + 1)
    ctx.lineTo(x + TILE_SIZE, y + 1)
  }
  if (neighbors.down !== 'WALL') {
    ctx.moveTo(x, y + TILE_SIZE - 1)
    ctx.lineTo(x + TILE_SIZE, y + TILE_SIZE - 1)
  }
  if (neighbors.left !== 'WALL') {
    ctx.moveTo(x + 1, y)
    ctx.lineTo(x + 1, y + TILE_SIZE)
  }
  if (neighbors.right !== 'WALL') {
    ctx.moveTo(x + TILE_SIZE - 1, y)
    ctx.lineTo(x + TILE_SIZE - 1, y + TILE_SIZE)
  }
  ctx.stroke()
  clearGlow(ctx)
}
