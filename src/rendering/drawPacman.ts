import type { PacManEntity } from '../types/entities'
import { TILE_SIZE } from '../constants/game'
import { directionToAngle } from '../engine/collision'
import { setGlow, clearGlow } from './glowHelpers'

const PACMAN_RADIUS = TILE_SIZE / 2 - 1
const PACMAN_COLOR = '#FFE566'
const PACMAN_GLOW = '#FFD700'

export function drawPacman(
  ctx: CanvasRenderingContext2D,
  pacman: PacManEntity,
  deathProgress = 0,  // 0 = alive, 1 = fully dead (animation)
): void {
  const { pos, direction, mouthAngle } = pacman

  if (deathProgress > 0) {
    drawDeathAnimation(ctx, pos.x, pos.y, deathProgress)
    return
  }

  const rotation = directionToAngle(direction)
  const mouth = direction === 'NONE' ? 0.15 : mouthAngle

  setGlow(ctx, PACMAN_GLOW, 18)
  ctx.fillStyle = PACMAN_COLOR
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
  ctx.arc(
    pos.x,
    pos.y,
    PACMAN_RADIUS,
    rotation + mouth / 2,
    rotation + Math.PI * 2 - mouth / 2,
  )
  ctx.closePath()
  ctx.fill()

  // Eye
  const eyeAngle = rotation - Math.PI / 4
  const eyeX = pos.x + Math.cos(eyeAngle) * PACMAN_RADIUS * 0.5
  const eyeY = pos.y + Math.sin(eyeAngle) * PACMAN_RADIUS * 0.5
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(eyeX, eyeY, 1.5, 0, Math.PI * 2)
  ctx.fill()

  clearGlow(ctx)
}

function drawDeathAnimation(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,  // 0–1
): void {
  // Pac-Man shrinks and rotates as it "dies"
  const radius = PACMAN_RADIUS * (1 - progress * 0.8)
  const openAngle = (Math.PI * 2) * progress  // mouth opens all the way
  const rotation = -Math.PI / 2  // facing up for death spin

  setGlow(ctx, PACMAN_GLOW, 12)
  ctx.fillStyle = PACMAN_COLOR
  ctx.globalAlpha = 1 - progress * 0.3
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.arc(x, y, Math.max(radius, 0.1), rotation + openAngle / 2, rotation + Math.PI * 2 - openAngle / 2)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
  clearGlow(ctx)
}
