import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/game'
import { useGameCanvas } from '../hooks/useGameCanvas'
import { useGameLoop } from '../hooks/useGameLoop'

export function GameCanvas() {
  const canvasRef = useGameCanvas()
  useGameLoop(canvasRef)

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        imageRendering: 'pixelated',
        maxWidth: '100%',
        maxHeight: '100vh',
        aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
      }}
    />
  )
}
