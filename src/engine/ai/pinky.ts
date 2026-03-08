import type { GameRef } from '../../types/game'
import type { Vector2 } from '../../types/entities'
import { tileInDirection } from '../collision'

export function pinkyTarget(state: GameRef): Vector2 {
  const { tilePos, direction } = state.pacman
  // Classic Pac-Man bug: UP direction also offsets 4 left
  if (direction === 'UP') {
    return { x: tilePos.x - 4, y: tilePos.y - 4 }
  }
  const ahead = tileInDirection(tilePos, direction, 4)
  return ahead
}
