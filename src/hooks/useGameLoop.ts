import { useEffect, useRef, useCallback } from 'react'
import type { Direction } from '../types/entities'
import type { GameStoreState } from '../store/gameStore'
import { createGameRef, createGameLoop } from '../engine/gameLoop'
import { useGameStore } from '../store/gameStore'
import { useInputHandler } from './useInputHandler'

export function useGameLoop(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const store = useGameStore()
  const storeRef = useRef<GameStoreState>(store)
  storeRef.current = store

  const gameLoopRef = useRef<ReturnType<typeof createGameLoop> | null>(null)
  const gameRefObj = useRef(createGameRef(store.level, store.difficulty))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Re-init game state
    gameRefObj.current = createGameRef(1, storeRef.current.difficulty)
    storeRef.current.setScore(0)
    storeRef.current.setLives(3)
    storeRef.current.setLevel(1)

    const loop = createGameLoop(canvas, storeRef, gameRefObj.current)
    gameLoopRef.current = loop
    loop.start()

    return () => {
      loop.stop()
    }
  }, [canvasRef])  // Only re-init when canvas changes

  const queueDirection = useCallback((dir: Direction) => {
    gameLoopRef.current?.queueDirection(dir)
  }, [])

  const handlePause = useCallback(() => {
    const currentPhase = storeRef.current.phase
    if (currentPhase === 'PLAYING') {
      storeRef.current.setPhase('PAUSED')
      gameLoopRef.current?.stop()
    } else if (currentPhase === 'PAUSED') {
      storeRef.current.setPhase('PLAYING')
      // Restart loop with current game ref
      const canvas = canvasRef.current
      if (canvas) {
        const loop = createGameLoop(canvas, storeRef, gameRefObj.current)
        gameLoopRef.current = loop
        loop.start()
      }
    }
  }, [canvasRef])

  useInputHandler(queueDirection, handlePause)
}
