import type { GameRef } from '../types/game'
import type { PowerUpType } from '../types/entities'
import { euclideanDistance } from './collision'
import { TILE_SIZE, SCORES } from '../constants/game'

export function activatePowerUp(state: GameRef, type: PowerUpType, config: { pacmanSpeedBase: number; ghostSpeedMultiplier: number }): void {
  const now = state.gameTime * 1000
  let duration = 5000

  // Remove existing same-type power-up
  state.pacman.activePowerUps = state.pacman.activePowerUps.filter(p => p.type !== type)

  switch (type) {
    case 'SPEED':
      duration = 5000
      state.pacman.activePowerUps.push({ type, expiresAt: now + duration })
      state.pacman.speed = config.pacmanSpeedBase * 2
      break
    case 'FREEZE':
      duration = 3000
      state.pacman.activePowerUps.push({ type, expiresAt: now + duration })
      for (const ghost of state.ghosts) {
        if (ghost.mode === 'CHASE' || ghost.mode === 'SCATTER' || ghost.mode === 'FRIGHTENED') {
          ghost.speed = 0
        }
      }
      break
    case 'MAGNET':
      duration = 4000
      state.pacman.activePowerUps.push({ type, expiresAt: now + duration })
      break
  }
}

export function updatePowerUps(state: GameRef, dt: number, config: { pacmanSpeedBase: number; ghostSpeedMultiplier: number }): void {
  const nowMs = state.gameTime * 1000
  const expired = state.pacman.activePowerUps.filter(p => p.expiresAt <= nowMs)
  state.pacman.activePowerUps = state.pacman.activePowerUps.filter(p => p.expiresAt > nowMs)

  for (const p of expired) {
    switch (p.type) {
      case 'SPEED':
        // Restore normal speed (if no other speed boost)
        if (!state.pacman.activePowerUps.find(a => a.type === 'SPEED')) {
          state.pacman.speed = config.pacmanSpeedBase
        }
        break
      case 'FREEZE':
        // Restore ghost speeds
        for (const ghost of state.ghosts) {
          if (ghost.speed === 0) {
            ghost.speed = ghost.mode === 'FRIGHTENED'
              ? config.pacmanSpeedBase * config.ghostSpeedMultiplier * 0.5
              : config.pacmanSpeedBase * config.ghostSpeedMultiplier
          }
        }
        break
    }
  }

  // Magnet: pull ghosts toward Pac-Man and eat them
  const magnetActive = state.pacman.activePowerUps.find(p => p.type === 'MAGNET')
  if (magnetActive) {
    const magnetRadius = TILE_SIZE * 4
    for (const ghost of state.ghosts) {
      if (ghost.mode === 'FRIGHTENED' || ghost.mode === 'EATEN') continue
      const dist = euclideanDistance(state.pacman.pos, ghost.pos)
      if (dist < magnetRadius) {
        // Pull toward Pac-Man
        const dx = state.pacman.pos.x - ghost.pos.x
        const dy = state.pacman.pos.y - ghost.pos.y
        const len = Math.sqrt(dx * dx + dy * dy) || 1
        ghost.pos.x += (dx / len) * ghost.speed * dt * 2
        ghost.pos.y += (dy / len) * ghost.speed * dt * 2

        if (dist < TILE_SIZE) {
          // Eat the ghost
          ghost.mode = 'EATEN'
          state.comboCount++
          const pts = SCORES.GHOST_BASE * Math.pow(2, Math.min(state.comboCount - 1, 3))
          state.score += pts
        }
      }
    }
  }
}

export function hasPowerUp(state: GameRef, type: PowerUpType): boolean {
  const nowMs = state.gameTime * 1000
  return state.pacman.activePowerUps.some(p => p.type === type && p.expiresAt > nowMs)
}
