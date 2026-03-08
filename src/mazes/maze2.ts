import type { MazeLayout, TileType } from '../types/maze'

// Open Arena — wider corridors, fewer internal walls, faster chaotic play
const W: TileType = 'WALL'
const D: TileType = 'DOT'
const E: TileType = 'ENERGIZER'
const _: TileType = 'EMPTY'
const GH: TileType = 'GHOST_HOUSE'
const GD: TileType = 'GHOST_DOOR'
const T: TileType = 'TUNNEL'
const FS: TileType = 'FRUIT_SPAWN'
const SP: TileType = 'POWER_SPEED'
const SF: TileType = 'POWER_FREEZE'
const SM: TileType = 'POWER_MAGNET'

const tiles: TileType[] = [
  // Row 0
  W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,
  // Row 1
  W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W,
  // Row 2
  W, D, W, W, W, D, D, D, D, D, D, D, D, W, W, D, D, D, D, D, D, D, W, W, W, D, D, W,
  // Row 3
  W, E, W, W, W, D, W, W, D, W, W, W, D, W, W, D, W, W, W, D, W, W, D, W, W, D, E, W,
  // Row 4
  W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W,
  // Row 5
  W, D, W, W, D, W, D, W, D, W, W, W, SM, D, D, SM, W, W, W, D, W, D, W, D, W, W, D, W,
  // Row 6
  W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W,
  // Row 7
  W, D, W, D, W, W, D, W, D, W, W, D, D, W, W, D, D, W, W, D, W, D, W, W, D, W, D, W,
  // Row 8
  W, D, D, D, D, D, D, D, D, D, D, D, D, W, W, D, D, D, D, D, D, D, D, D, D, D, D, W,
  // Row 9
  W, W, W, D, W, W, D, W, W, W, W, W, _, W, W, _, W, W, W, W, W, D, W, W, D, W, W, W,
  // Row 10
  W, W, W, D, W, W, D, W, W, W, W, W, _, W, W, _, W, W, W, W, W, D, W, W, D, W, W, W,
  // Row 11
  W, W, W, D, D, D, D, W, W, _, _, _, _, _, _, _, _, _, _, W, W, D, D, D, D, W, W, W,
  // Row 12
  W, W, W, W, W, W, SP, W, W, _, W, W, W, GD, GD, W, W, W, _, W, W, SF, W, W, W, W, W, W,
  // Row 13
  W, W, W, W, W, W, D, W, W, _, W, GH, GH, GH, GH, GH, GH, W, _, W, W, D, W, W, W, W, W, W,
  // Row 14 — tunnel row
  T, _, _, _, _, _, D, _, _, _, W, GH, GH, GH, GH, GH, GH, W, _, _, _, D, _, _, _, _, _, T,
  // Row 15
  W, W, W, W, W, W, D, W, W, _, W, GH, GH, GH, GH, GH, GH, W, _, W, W, D, W, W, W, W, W, W,
  // Row 16
  W, W, W, W, W, W, D, W, W, _, W, W, W, W, W, W, W, W, _, W, W, D, W, W, W, W, W, W,
  // Row 17
  W, W, W, W, W, W, D, W, W, _, _, _, _, FS, _, _, _, _, _, W, W, D, W, W, W, W, W, W,
  // Row 18
  W, W, W, D, D, D, D, W, W, W, W, W, _, W, W, _, W, W, W, W, W, D, D, D, D, W, W, W,
  // Row 19
  W, W, W, D, W, W, D, W, W, W, W, W, _, W, W, _, W, W, W, W, W, D, W, W, D, W, W, W,
  // Row 20
  W, D, D, D, D, D, D, D, D, D, D, D, D, W, W, D, D, D, D, D, D, D, D, D, D, D, D, W,
  // Row 21
  W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W,
  // Row 22
  W, D, W, D, W, W, D, W, D, W, W, D, D, W, W, D, D, W, W, D, W, D, W, W, D, W, D, W,
  // Row 23
  W, E, D, D, D, D, D, D, D, D, D, D, D, _, _, D, D, D, D, D, D, D, D, D, D, D, E, W,
  // Row 24
  W, D, W, D, W, W, D, W, D, W, W, D, D, W, W, D, D, W, W, D, W, D, W, W, D, W, D, W,
  // Row 25
  W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W,
  // Row 26
  W, D, D, D, D, D, D, W, W, D, D, D, D, W, W, D, D, D, D, W, W, D, D, D, D, D, D, W,
  // Row 27
  W, D, W, W, D, W, D, W, W, W, W, W, D, W, W, D, W, W, W, W, W, D, W, D, W, W, D, W,
  // Row 28
  W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W,
  // Row 29
  W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W,
  // Row 30
  W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,
]

function countDots(t: TileType[]): number {
  return t.filter(tile =>
    tile === 'DOT' || tile === 'ENERGIZER' ||
    tile === 'POWER_SPEED' || tile === 'POWER_FREEZE' || tile === 'POWER_MAGNET'
  ).length
}

export const maze2: MazeLayout = {
  id: 2,
  name: 'Open Arena',
  cols: 28,
  rows: 31,
  tiles,
  pacmanStart:      { x: 13, y: 23 },
  ghostHouseCenter: { x: 13, y: 14 },
  ghostExitTile:    { x: 13, y: 11 },
  scatterTargets: {
    BLINKY: { x: 25, y: 0 },
    PINKY:  { x: 2,  y: 0 },
    INKY:   { x: 27, y: 30 },
    CLYDE:  { x: 0,  y: 30 },
  },
  fruitSpawnTile: { x: 13, y: 17 },
  tunnelRows: [14],
  dotCount: countDots(tiles),
}
