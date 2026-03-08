import { useRef, useEffect } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/game'

export function useGameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Set internal resolution
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
  }, [])

  return canvasRef
}
