import { useGameStore } from '../../store/gameStore'

export function LevelCompleteScreen() {
  const { level, score } = useGameStore()

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      fontFamily: 'monospace',
      zIndex: 20,
      gap: '12px',
    }}>
      <div style={{
        fontSize: '32px',
        color: '#00FF88',
        textShadow: '0 0 20px #00FF88',
        letterSpacing: '3px',
      }}>
        LEVEL {level - 1} CLEAR!
      </div>
      <div style={{ color: '#FFE566', fontSize: '16px' }}>
        Score: {score.toLocaleString()}
      </div>
      <div style={{ color: '#555', fontSize: '12px', marginTop: '8px' }}>
        Loading maze {((level - 1) % 3) + 1}...
      </div>
    </div>
  )
}
