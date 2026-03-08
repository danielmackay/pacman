import type { GhostEntity } from '../types/entities'
import { TILE_SIZE } from '../constants/game'
import { GHOST_FRIGHTENED_COLOR, GHOST_FRIGHTENED_FLASH_COLOR } from '../constants/ghosts'
import { setGlow, clearGlow } from './glowHelpers'
import { directionToAngle } from '../engine/collision'

const GHOST_RADIUS = TILE_SIZE / 2 - 1

export function drawGhosts(ctx: CanvasRenderingContext2D, ghosts: GhostEntity[], gameTime: number): void {
  for (const ghost of ghosts) {
    drawGhost(ctx, ghost, gameTime)
  }
}

function drawGhost(ctx: CanvasRenderingContext2D, ghost: GhostEntity, gameTime: number): void {
  const { pos, mode, color, isFlashing } = ghost
  const x = pos.x
  const y = pos.y
  const r = GHOST_RADIUS

  if (mode === 'HOUSE') {
    // Slightly transparent in ghost house
    ctx.globalAlpha = 0.7
  }

  if (mode === 'EATEN') {
    // Only draw eyes
    drawEyes(ctx, x, y, ghost.direction, '#FFFFFF', 8)
    ctx.globalAlpha = 1
    return
  }

  // Determine body color
  let bodyColor = color
  if (mode === 'FRIGHTENED') {
    const flashOn = Math.sin(gameTime * 12) > 0
    bodyColor = isFlashing
      ? (flashOn ? GHOST_FRIGHTENED_FLASH_COLOR : GHOST_FRIGHTENED_COLOR)
      : GHOST_FRIGHTENED_COLOR
  }

  setGlow(ctx, bodyColor, mode === 'FRIGHTENED' ? 6 : 14)
  ctx.fillStyle = bodyColor

  // Body: rounded top (semicircle) + wavy bottom
  ctx.beginPath()
  ctx.arc(x, y - r * 0.1, r, Math.PI, 0, false)  // top semicircle

  // Wavy bottom: 3 bumps
  const bumpCount = 3
  const bumpW = (r * 2) / bumpCount
  const baseY = y + r * 0.9
  for (let i = 0; i < bumpCount; i++) {
    const bx = x + r - (i + 0.5) * bumpW
    ctx.arc(bx, baseY, bumpW / 2, 0, Math.PI, true)
  }
  ctx.closePath()
  ctx.fill()

  clearGlow(ctx)

  // Eyes (only if not fully frightened-dark)
  if (mode !== 'FRIGHTENED' || isFlashing) {
    const eyeColor = mode === 'FRIGHTENED' ? '#FF0000' : '#FFFFFF'
    const pupilColor = mode === 'FRIGHTENED' ? '#FF0000' : '#0000CC'
    drawEyes(ctx, x, y - r * 0.2, ghost.direction, eyeColor, GHOST_RADIUS * 0.7, pupilColor)
  } else {
    // White dots for frightened
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(x - r * 0.3, y - r * 0.2, 2, 0, Math.PI * 2)
    ctx.arc(x + r * 0.3, y - r * 0.2, 2, 0, Math.PI * 2)
    ctx.fill()
    // Wavy mouth for frightened
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x - r * 0.4, y + r * 0.2)
    for (let i = 0; i <= 4; i++) {
      const mx = x - r * 0.4 + (i / 4) * r * 0.8
      const my = y + r * 0.2 + (i % 2 === 0 ? 2 : -2)
      ctx.lineTo(mx, my)
    }
    ctx.stroke()
  }

  ctx.globalAlpha = 1
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  direction: GhostEntity['direction'],
  eyeColor: string,
  scale: number,
  pupilColor = '#0000CC',
): void {
  const eyeR = scale * 0.35
  const pupilR = eyeR * 0.55

  const angle = directionToAngle(direction)
  const pdx = Math.cos(angle) * eyeR * 0.5
  const pdy = Math.sin(angle) * eyeR * 0.5

  const eyes = [
    { ex: x - scale * 0.3, ey: y },
    { ex: x + scale * 0.3, ey: y },
  ]

  for (const { ex, ey } of eyes) {
    ctx.fillStyle = eyeColor
    ctx.beginPath()
    ctx.arc(ex, ey, eyeR, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = pupilColor
    ctx.beginPath()
    ctx.arc(ex + pdx, ey + pdy, pupilR, 0, Math.PI * 2)
    ctx.fill()
  }
}
