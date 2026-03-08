import { useEffect, useRef } from 'react'
import type { Direction } from '../types/entities'

const KEY_MAP: Record<string, Direction> = {
  ArrowUp:    'UP',
  ArrowDown:  'DOWN',
  ArrowLeft:  'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP', W: 'UP',
  s: 'DOWN', S: 'DOWN',
  a: 'LEFT', A: 'LEFT',
  d: 'RIGHT', D: 'RIGHT',
}

export function useInputHandler(
  onDirection: (dir: Direction) => void,
  onPause: () => void,
) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const dir = KEY_MAP[e.key]
      if (dir) {
        e.preventDefault()
        onDirection(dir)
        return
      }
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        onPause()
      }
    }

    function handleTouchStart(e: TouchEvent) {
      const t = e.touches[0]
      touchStartRef.current = { x: t.clientX, y: t.clientY }
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!touchStartRef.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - touchStartRef.current.x
      const dy = t.clientY - touchStartRef.current.y
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      if (Math.max(absDx, absDy) < 10) return  // too small

      let dir: Direction
      if (absDx > absDy) {
        dir = dx > 0 ? 'RIGHT' : 'LEFT'
      } else {
        dir = dy > 0 ? 'DOWN' : 'UP'
      }
      onDirection(dir)
      touchStartRef.current = null
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onDirection, onPause])
}
