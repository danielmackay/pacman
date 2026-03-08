import type { TileType } from '../types/maze'
import { SCORES } from '../constants/game'

export function scoreForTile(tile: TileType): number {
  switch (tile) {
    case 'DOT':           return SCORES.DOT
    case 'ENERGIZER':     return SCORES.ENERGIZER
    case 'POWER_SPEED':   return SCORES.ENERGIZER
    case 'POWER_FREEZE':  return SCORES.ENERGIZER
    case 'POWER_MAGNET':  return SCORES.ENERGIZER
    default:              return 0
  }
}

export function scoreForGhostEat(comboCount: number): number {
  const idx = Math.min(comboCount - 1, 3)
  return SCORES.GHOST_BASE * Math.pow(2, idx)  // 200,400,800,1600
}

export function getFruitPoints(level: number): number {
  const idx = Math.min(level - 1, SCORES.FRUIT.length - 1)
  return SCORES.FRUIT[idx]
}

export function getFruitSymbol(level: number): string {
  const symbols = ['🍒', '🍓', '🍊', '🍋', '🍎', '🍇', '🔔', '⭐']
  return symbols[Math.min(level - 1, symbols.length - 1)]
}
