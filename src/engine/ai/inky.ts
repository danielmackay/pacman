import type { GameRef } from '../../types/game'
import type { Vector2 } from '../../types/entities'
import { tileInDirection } from '../collision'

export function inkyTarget(state: GameRef): Vector2 {
  const blinky = state.ghosts.find(g => g.name === 'BLINKY')
  if (!blinky) return { ...state.pacman.tilePos }

  const { tilePos, direction } = state.pacman
  // Pivot: 2 tiles ahead of Pac-Man
  const pivot = tileInDirection(tilePos, direction, 2)
  // Vector from Blinky to pivot, doubled
  const dx = pivot.x - blinky.tilePos.x
  const dy = pivot.y - blinky.tilePos.y
  return { x: blinky.tilePos.x + dx * 2, y: blinky.tilePos.y + dy * 2 }
}
