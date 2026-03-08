import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { LEADERBOARD_MAX } from '../../constants/game'

export function GameOverScreen() {
  const { score, level, submitScore, leaderboard } = useGameStore()
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const minScore = leaderboard.length < LEADERBOARD_MAX ? 0 : leaderboard[leaderboard.length - 1]?.score ?? 0
  const qualifies = score > minScore

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    submitScore(name.trim().toUpperCase().slice(0, 8), score, level)
    setSubmitted(true)
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.9)',
      color: '#fff',
      fontFamily: 'monospace',
      zIndex: 20,
      gap: '16px',
    }}>
      <div style={{
        fontSize: '40px',
        color: '#FF4444',
        textShadow: '0 0 20px #FF0000',
        letterSpacing: '3px',
      }}>
        GAME OVER
      </div>

      <div style={{ textAlign: 'center', lineHeight: '2' }}>
        <div style={{ color: '#FFE566', fontSize: '18px' }}>
          {score.toLocaleString()} pts
        </div>
        <div style={{ color: '#888', fontSize: '12px' }}>Level {level}</div>
      </div>

      {qualifies && !submitted && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ color: '#00FF88', fontSize: '13px' }}>NEW HIGH SCORE!</div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={8}
            placeholder="ENTER NAME"
            autoFocus
            style={{
              background: '#111',
              border: '2px solid #FFE566',
              color: '#FFE566',
              fontFamily: 'monospace',
              fontSize: '16px',
              padding: '8px 12px',
              textAlign: 'center',
              letterSpacing: '3px',
              outline: 'none',
              textTransform: 'uppercase',
              width: '180px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 24px',
              background: '#FFE566',
              color: '#000',
              border: 'none',
              fontFamily: 'monospace',
              fontSize: '14px',
              cursor: 'pointer',
              letterSpacing: '2px',
              fontWeight: 'bold',
            }}
          >
            SUBMIT
          </button>
        </form>
      )}

      {(!qualifies || submitted) && (
        <button
          onClick={() => useGameStore.getState().setPhase('MENU')}
          style={{
            padding: '10px 28px',
            background: 'transparent',
            color: '#FFE566',
            border: '2px solid #FFE566',
            fontFamily: 'monospace',
            fontSize: '14px',
            cursor: 'pointer',
            letterSpacing: '2px',
            marginTop: '8px',
          }}
        >
          BACK TO MENU
        </button>
      )}
    </div>
  )
}
