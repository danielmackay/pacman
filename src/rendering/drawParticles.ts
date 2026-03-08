import type { Particle } from '../types/entities'
import { setGlow, clearGlow } from './glowHelpers'

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  for (const p of particles) {
    if (p.life <= 0 || p.size <= 0.1) continue

    ctx.globalAlpha = Math.max(0, Math.min(1, p.life))

    if (p.glow) {
      setGlow(ctx, p.color, 10)
    }

    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()

    if (p.glow) {
      clearGlow(ctx)
    }
  }

  ctx.globalAlpha = 1
}
