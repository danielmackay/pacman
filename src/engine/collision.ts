import type { MazeLayout, TileType } from '../types/maze'
import type { Direction, Vector2 } from '../types/entities'
import { TILE_SIZE } from '../constants/game'

export function getTile(maze: MazeLayout, col: number, row: number): TileType {
  // Tunnel wrap on X
  if (col < 0) col = maze.cols - 1
  if (col >= maze.cols) col = 0
  if (row < 0 || row >= maze.rows) return 'WALL'
  return maze.tiles[row * maze.cols + col]
}

export function isWalkable(tile: TileType, isGhost: boolean, isLeaving = false): boolean {
  if (tile === 'WALL') return false
  if (tile === 'GHOST_DOOR') return isGhost || isLeaving
  if (tile === 'GHOST_HOUSE') return isGhost
  return true
}

export function tileToPixel(col: number, row: number): Vector2 {
  return {
    x: col * TILE_SIZE + TILE_SIZE / 2,
    y: row * TILE_SIZE + TILE_SIZE / 2,
  }
}

export function pixelToTile(x: number, y: number): Vector2 {
  return {
    x: Math.floor(x / TILE_SIZE),
    y: Math.floor(y / TILE_SIZE),
  }
}

export function manhattanDistance(a: Vector2, b: Vector2): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

export function euclideanDistance(a: Vector2, b: Vector2): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function directionOffset(dir: Direction, n = 1): Vector2 {
  switch (dir) {
    case 'UP':    return { x: 0,  y: -n }
    case 'DOWN':  return { x: 0,  y:  n }
    case 'LEFT':  return { x: -n, y:  0 }
    case 'RIGHT': return { x:  n, y:  0 }
    default:      return { x: 0,  y:  0 }
  }
}

export function tileInDirection(pos: Vector2, dir: Direction, n = 1): Vector2 {
  const off = directionOffset(dir, n)
  return { x: pos.x + off.x, y: pos.y + off.y }
}

export function reverseDirection(dir: Direction): Direction {
  switch (dir) {
    case 'UP':    return 'DOWN'
    case 'DOWN':  return 'UP'
    case 'LEFT':  return 'RIGHT'
    case 'RIGHT': return 'LEFT'
    default:      return 'NONE'
  }
}

export function directionToAngle(dir: Direction): number {
  switch (dir) {
    case 'RIGHT': return 0
    case 'DOWN':  return Math.PI / 2
    case 'LEFT':  return Math.PI
    case 'UP':    return (3 * Math.PI) / 2
    default:      return 0
  }
}

/** Returns true if the pixel position is within half-tile of center */
export function isNearTileCenter(pixelPos: Vector2, tilePos: Vector2, threshold = 2): boolean {
  const center = tileToPixel(tilePos.x, tilePos.y)
  return Math.abs(pixelPos.x - center.x) <= threshold &&
         Math.abs(pixelPos.y - center.y) <= threshold
}

export function isTileEatable(tile: TileType): boolean {
  return tile === 'DOT' || tile === 'ENERGIZER' ||
    tile === 'POWER_SPEED' || tile === 'POWER_FREEZE' || tile === 'POWER_MAGNET'
}

export function getTileIndex(maze: MazeLayout, col: number, row: number): number {
  return row * maze.cols + col
}
