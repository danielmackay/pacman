import type { GhostName } from '../types/entities'

export const GHOST_COLORS: Record<GhostName, string> = {
  BLINKY: '#FF0000',
  PINKY:  '#FFB8FF',
  INKY:   '#00FFFF',
  CLYDE:  '#FFB852',
}

export const GHOST_FRIGHTENED_COLOR = '#0000CC'
export const GHOST_FRIGHTENED_FLASH_COLOR = '#FFFFFF'
export const GHOST_EATEN_COLOR = 'transparent'

// Tile-based scatter corner targets (col, row)
export const GHOST_SCATTER_TARGETS: Record<GhostName, { x: number; y: number }> = {
  BLINKY: { x: 25, y: 0 },
  PINKY:  { x: 2,  y: 0 },
  INKY:   { x: 27, y: 30 },
  CLYDE:  { x: 0,  y: 30 },
}

// Dot thresholds for leaving ghost house (per ghost, level 1)
export const GHOST_RELEASE_THRESHOLDS: Record<GhostName, number> = {
  BLINKY: 0,   // starts outside
  PINKY:  0,   // released immediately
  INKY:   30,  // after 30 dots eaten
  CLYDE:  60,  // after 60 dots eaten
}

// Chase/Scatter mode schedule (repeats last CHASE forever)
export const MODE_SCHEDULE = [
  { mode: 'SCATTER' as const, durationMs: 7000 },
  { mode: 'CHASE'   as const, durationMs: 20000 },
  { mode: 'SCATTER' as const, durationMs: 7000 },
  { mode: 'CHASE'   as const, durationMs: 20000 },
  { mode: 'SCATTER' as const, durationMs: 5000 },
  { mode: 'CHASE'   as const, durationMs: 20000 },
  { mode: 'SCATTER' as const, durationMs: 5000 },
  { mode: 'CHASE'   as const, durationMs: Infinity },
]
