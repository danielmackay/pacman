import type { MazeLayout } from '../types/maze'
import { TILE_SIZE } from '../constants/game'
import { setGlow, clearGlow } from './glowHelpers'

const DOT_RADIUS = 2
const ENERGIZER_BASE_RADIUS = 5

export function drawPellets(
  ctx: CanvasRenderingContext2D,
  maze: MazeLayout,
  tileState: Uint8Array,
  gameTime: number,
): void {
  const { cols, rows, tiles } = maze
  const pulse = Math.sin(gameTime * 3) * 1.5 + 1  // 0–2 extra px

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col
      if (tileState[idx] === 0) continue  // already eaten

      const tile = tiles[idx]
      const cx = col * TILE_SIZE + TILE_SIZE / 2
      const cy = row * TILE_SIZE + TILE_SIZE / 2

      switch (tile) {
        case 'DOT':
          ctx.fillStyle = '#FFE8B0'
          ctx.beginPath()
          ctx.arc(cx, cy, DOT_RADIUS, 0, Math.PI * 2)
          ctx.fill()
          break

        case 'ENERGIZER':
          setGlow(ctx, '#FFFF00', 12)
          ctx.fillStyle = '#FFFF44'
          ctx.beginPath()
          ctx.arc(cx, cy, ENERGIZER_BASE_RADIUS + pulse, 0, Math.PI * 2)
          ctx.fill()
          clearGlow(ctx)
          break

        case 'POWER_SPEED':
          setGlow(ctx, '#00FFFF', 14)
          ctx.fillStyle = '#00FFFF'
          ctx.beginPath()
          ctx.arc(cx, cy, 4 + pulse * 0.5, 0, Math.PI * 2)
          ctx.fill()
          // Arrow symbol
          ctx.fillStyle = '#001133'
          ctx.font = `${TILE_SIZE - 4}px monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('›', cx, cy + 1)
          clearGlow(ctx)
          break

        case 'POWER_FREEZE':
          setGlow(ctx, '#8888FF', 14)
          ctx.fillStyle = '#C0C0FF'
          ctx.beginPath()
          ctx.arc(cx, cy, 4 + pulse * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#000033'
          ctx.font = `${TILE_SIZE - 4}px monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('*', cx, cy + 1)
          clearGlow(ctx)
          break

        case 'POWER_MAGNET':
          setGlow(ctx, '#FFD700', 14)
          ctx.fillStyle = '#FFD700'
          ctx.beginPath()
          ctx.arc(cx, cy, 4 + pulse * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#330000'
          ctx.font = `${TILE_SIZE - 4}px monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('⊕', cx, cy + 1)
          clearGlow(ctx)
          break
      }
    }
  }
}
