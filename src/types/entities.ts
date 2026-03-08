export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE'

export type GhostName = 'BLINKY' | 'PINKY' | 'INKY' | 'CLYDE'

export type GhostMode =
  | 'SCATTER'
  | 'CHASE'
  | 'FRIGHTENED'
  | 'EATEN'
  | 'HOUSE'
  | 'LEAVING'

export type PowerUpType = 'SPEED' | 'FREEZE' | 'MAGNET'

export interface Vector2 {
  x: number
  y: number
}

export interface EntityBase {
  pos: Vector2          // pixel position (center)
  tilePos: Vector2      // current tile (col, row)
  direction: Direction
  speed: number         // pixels per second
}

export interface ActivePowerUp {
  type: PowerUpType
  expiresAt: number     // game timestamp ms
}

export interface PacManEntity extends EntityBase {
  nextDirection: Direction
  mouthAngle: number    // 0 – Math.PI/2
  mouthOpen: boolean
  activePowerUps: ActivePowerUp[]
}

export interface GhostEntity extends EntityBase {
  name: GhostName
  mode: GhostMode
  color: string
  frightColor: string
  targetTile: Vector2
  isFlashing: boolean
  dotCounter: number
  homeCorner: Vector2
  nextDirection: Direction
  atIntersection: boolean
}

export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number          // 1.0 = just born, 0 = dead
  decay: number
  size: number
  color: string
  glow: boolean
}

export interface FruitEntity {
  tilePos: Vector2
  pixelPos: Vector2
  points: number
  spawnTime: number
  despawnTime: number
  active: boolean
  symbol: string
}
