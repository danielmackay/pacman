import type { GhostName, Vector2 } from './entities'

export type TileType =
  | 'WALL'
  | 'DOT'
  | 'ENERGIZER'
  | 'POWER_SPEED'
  | 'POWER_FREEZE'
  | 'POWER_MAGNET'
  | 'EMPTY'
  | 'GHOST_HOUSE'
  | 'GHOST_DOOR'
  | 'TUNNEL'
  | 'FRUIT_SPAWN'

export interface MazeLayout {
  id: number
  name: string
  cols: number
  rows: number
  tiles: TileType[]
  pacmanStart: Vector2
  ghostHouseCenter: Vector2
  ghostExitTile: Vector2
  scatterTargets: Record<GhostName, Vector2>
  fruitSpawnTile: Vector2
  tunnelRows: number[]
  dotCount: number
}
