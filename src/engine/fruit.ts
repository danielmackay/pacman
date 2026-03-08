import type { GameRef } from '../types/game'
import type { FruitEntity } from '../types/entities'
import { tileToPixel } from './collision'
import { FRUIT_ACTIVE_DURATION, FRUIT_SPAWN_AT_DOTS } from '../constants/game'
import { getFruitPoints, getFruitSymbol } from './scoring'

export function checkFruitSpawn(state: GameRef): void {
  const dots = state.dotsRemaining
  const maze = state.maze

  if (state.fruit?.active) return

  for (const threshold of FRUIT_SPAWN_AT_DOTS) {
    if (dots === threshold) {
      const pixelPos = tileToPixel(maze.fruitSpawnTile.x, maze.fruitSpawnTile.y)
      const nowMs = state.gameTime * 1000
      const fruit: FruitEntity = {
        tilePos: { ...maze.fruitSpawnTile },
        pixelPos,
        points: getFruitPoints(state.level),
        spawnTime: nowMs,
        despawnTime: nowMs + FRUIT_ACTIVE_DURATION,
        active: true,
        symbol: getFruitSymbol(state.level),
      }
      state.fruit = fruit
      break
    }
  }
}

export function updateFruit(state: GameRef): void {
  if (!state.fruit?.active) return
  const nowMs = state.gameTime * 1000
  if (nowMs >= state.fruit.despawnTime) {
    state.fruit.active = false
  }
}
