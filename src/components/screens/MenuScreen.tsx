import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import type { Difficulty } from '../../types/game'

const overlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.92)',
  color: '#fff',
  fontFamily: 'monospace',
  zIndex: 20,
  gap: '16px',
}

export function MenuScreen() {
  const { setPhase, setDifficulty, difficulty, leaderboard } = useGameStore()
  const [showLB, setShowLB] = useState(false)

  function startGame() {
    setPhase('COUNTDOWN')
  }

  const difficulties: Difficulty[] = ['EASY', 'NORMAL', 'HARD']
  const diffColors: Record<Difficulty, string> = {
    EASY: '#00FF88',
    NORMAL: '#FFE566',
    HARD: '#FF4444',
  }

  return (
    <div style={overlay}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '52px',
          fontWeight: 'bold',
          color: '#FFE566',
          textShadow: '0 0 20px #FFD700, 0 0 40px #FF8800',
          letterSpacing: '4px',
          lineHeight: 1,
        }}>
          PAC-MAN
        </div>
        <div style={{ color: '#888', fontSize: '12px', marginTop: '6px', letterSpacing: '8px' }}>
          MODERN EDITION
        </div>
      </div>

      {/* Difficulty picker */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        {difficulties.map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            style={{
              padding: '8px 16px',
              background: difficulty === d ? diffColors[d] : '#111',
              color: difficulty === d ? '#000' : diffColors[d],
              border: `2px solid ${diffColors[d]}`,
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: difficulty === d ? 'bold' : 'normal',
              transition: 'all 0.15s',
              boxShadow: difficulty === d ? `0 0 12px ${diffColors[d]}` : 'none',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Start button */}
      <button
        onClick={startGame}
        style={{
          padding: '14px 40px',
          background: 'transparent',
          color: '#FFE566',
          border: '2px solid #FFE566',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '18px',
          cursor: 'pointer',
          letterSpacing: '3px',
          boxShadow: '0 0 20px #FFD700',
          animation: 'pulse 1.5s ease-in-out infinite',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#FFE566', e.currentTarget.style.color = '#000')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = '#FFE566')}
      >
        INSERT COIN
      </button>

      {/* Controls */}
      <div style={{ color: '#555', fontSize: '11px', textAlign: 'center', lineHeight: '1.8' }}>
        ARROW KEYS / WASD to move &nbsp;·&nbsp; P or ESC to pause
        <br />
        Swipe on mobile &nbsp;·&nbsp; 3 MAZES &nbsp;·&nbsp; 3 POWER-UPS
      </div>

      {/* Power-up legend */}
      <div style={{ display: 'flex', gap: '20px', fontSize: '11px' }}>
        <span style={{ color: '#00FFFF' }}>› SPEED BOOST</span>
        <span style={{ color: '#C0C0FF' }}>* FREEZE</span>
        <span style={{ color: '#FFD700' }}>⊕ MAGNET</span>
      </div>

      {/* Leaderboard toggle */}
      <div>
        <button
          onClick={() => setShowLB(!showLB)}
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            fontFamily: 'monospace',
            fontSize: '12px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {showLB ? 'HIDE' : 'HIGH SCORES'}
        </button>

        {showLB && leaderboard.length > 0 && (
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            {leaderboard.map((e, i) => (
              <div key={i} style={{ color: i === 0 ? '#FFD700' : '#aaa', fontSize: '12px' }}>
                {i + 1}. {e.name.padEnd(8)} {e.score.toLocaleString()} <span style={{ color: '#555' }}>LV{e.level}</span>
              </div>
            ))}
          </div>
        )}

        {showLB && leaderboard.length === 0 && (
          <div style={{ color: '#555', fontSize: '11px', marginTop: '8px' }}>No scores yet</div>
        )}
      </div>
    </div>
  )
}
