export const TILE_SIZE = 16
export const COLS = 28
export const ROWS = 31
export const CANVAS_WIDTH = COLS * TILE_SIZE   // 448
export const CANVAS_HEIGHT = ROWS * TILE_SIZE  // 496

export const PACMAN_BASE_SPEED = 120  // pixels/sec
export const GHOST_BASE_SPEED = 100

export const SCORES = {
  DOT: 10,
  ENERGIZER: 50,
  GHOST_BASE: 200,   // doubles per successive eat: 200,400,800,1600
  FRUIT: [100, 300, 500, 700, 1000, 2000, 3000, 5000],
}

export const DEATH_ANIM_DURATION = 1500   // ms
export const LEVEL_COMPLETE_DURATION = 2000
export const COUNTDOWN_DURATION = 3000
export const FRUIT_ACTIVE_DURATION = 10000  // ms
export const FRUIT_SPAWN_AT_DOTS = [174, 74]  // dots remaining when fruit spawns

export const ENERGIZER_PULSE_SPEED = 3     // radians/sec
export const MOUTH_ANIM_SPEED = 8          // radians/sec

export const PARTICLE_POOL_SIZE = 512

export const FRIGHTENED_FLASH_AT = 2000    // ms before end, start flashing

export const LEADERBOARD_KEY = 'pacman-leaderboard'
export const LEADERBOARD_MAX = 5
