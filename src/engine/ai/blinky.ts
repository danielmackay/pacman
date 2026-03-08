import type { GameRef } from '../../types/game'
import type { Vector2 } from '../../types/entities'

export function blinkyTarget(state: GameRef): Vector2 {
  return { ...state.pacman.tilePos }
}
