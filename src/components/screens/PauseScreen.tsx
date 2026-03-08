import { useGameStore } from '../../store/gameStore'

export function PauseScreen() {
  const { setPhase } = useGameStore()

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      color: '#FFE566',
      fontFamily: 'monospace',
      zIndex: 20,
      gap: '16px',
    }}>
      <div style={{ fontSize: '36px', textShadow: '0 0 16px #FFD700', letterSpacing: '4px' }}>
        PAUSED
      </div>
      <button
        onClick={() => setPhase('PLAYING')}
        style={{
          padding: '10px 28px',
          background: 'transparent',
          color: '#FFE566',
          border: '2px solid #FFE566',
          fontFamily: 'monospace',
          fontSize: '14px',
          cursor: 'pointer',
          letterSpacing: '2px',
        }}
      >
        RESUME
      </button>
      <div style={{ color: '#555', fontSize: '11px' }}>ESC or P to resume</div>
    </div>
  )
}
