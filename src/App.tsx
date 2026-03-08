import { useGameStore } from './store/gameStore'
import { GameCanvas } from './components/GameCanvas'
import { HUD } from './components/HUD'
import { MenuScreen } from './components/screens/MenuScreen'
import { PauseScreen } from './components/screens/PauseScreen'
import { LevelCompleteScreen } from './components/screens/LevelCompleteScreen'
import { GameOverScreen } from './components/screens/GameOverScreen'
import { CANVAS_WIDTH } from './constants/game'

export function App() {
  const phase = useGameStore(s => s.phase)
  const isPlaying = phase !== 'MENU'

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 0 }}>
      {/* HUD sits above the canvas as its own row — no overlap */}
      {isPlaying && phase !== 'GAME_OVER' && <HUD />}

      {/* Game area */}
      <div style={{ position: 'relative', lineHeight: 0 }}>
        {isPlaying && <GameCanvas />}

        {/* Full-area overlays */}
        {phase === 'PAUSED' && <PauseScreen />}
        {phase === 'LEVEL_COMPLETE' && <LevelCompleteScreen />}
        {phase === 'GAME_OVER' && <GameOverScreen />}

        {/* Menu sits over the placeholder canvas area */}
        {phase === 'MENU' && (
          <>
            <div style={{ width: CANVAS_WIDTH, height: 496, background: '#000' }} />
            <MenuScreen />
          </>
        )}
      </div>
    </div>
  )
}
