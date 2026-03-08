import type { Particle } from '../types/entities'
import type { GameRef } from '../types/game'
import { PARTICLE_POOL_SIZE } from '../constants/game'

export interface ParticleEmitConfig {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life?: number
  decay: number
  glow: boolean
}

export function createParticlePool(): Particle[] {
  return Array.from({ length: PARTICLE_POOL_SIZE }, (_, i) => ({
    id: i,
    x: 0, y: 0, vx: 0, vy: 0,
    life: 0,
    decay: 1,
    size: 0,
    color: '#fff',
    glow: false,
  }))
}

export function emitParticle(state: GameRef, config: ParticleEmitConfig): void {
  // Find first dead slot
  for (const p of state.particles) {
    if (p.life <= 0) {
      p.x = config.x
      p.y = config.y
      p.vx = config.vx
      p.vy = config.vy
      p.color = config.color
      p.size = config.size
      p.life = config.life ?? 1.0
      p.decay = config.decay
      p.glow = config.glow
      p.id = state.particleNextId++
      return
    }
  }
  // Pool full: overwrite index 0
  const p = state.particles[0]
  Object.assign(p, { ...config, life: config.life ?? 1.0, id: state.particleNextId++ })
}

export function updateParticles(state: GameRef, dt: number): void {
  for (const p of state.particles) {
    if (p.life <= 0) continue
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.vy += 30 * dt  // slight gravity
    p.life -= p.decay * dt
    p.size *= 0.985
  }
}
