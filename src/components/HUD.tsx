import { useGameStore } from '../store/gameStore'
import { CANVAS_WIDTH } from '../constants/game'

export function HUD() {
  const { score, lives, level, highScore } = useGameStore()

  return (
    <div style={{
      width: CANVAS_WIDTH,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 12px',
      background: '#000',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: '13px',
      lineHeight: 1.4,
      boxSizing: 'border-box',
    }}>
      <div>
        <span style={{ color: '#FFE566' }}>SCORE</span>
        <br />
        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{score.toLocaleString()}</span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <span style={{ color: '#aaa', fontSize: '11px' }}>LV {level}</span>
        <br />
        <span style={{ color: '#FFD700', fontSize: '11px' }}>HI {highScore.toLocaleString()}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ color: '#FFE566' }}>LIVES</span>
        <br />
        <span style={{ fontSize: '16px' }}>{'●'.repeat(Math.max(0, lives))}</span>
      </div>
    </div>
  )
}
