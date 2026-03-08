import type { GameRef } from '../../types/game'
import type { GhostEntity, Vector2 } from '../../types/entities'
import { euclideanDistance } from '../collision'

export function clydeTarget(ghost: GhostEntity, state: GameRef): Vector2 {
  const dist = euclideanDistance(ghost.tilePos, state.pacman.tilePos)
  if (dist > 8) {
    return { ...state.pacman.tilePos }
  }
  return ghost.homeCorner
}
