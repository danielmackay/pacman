import { create } from 'zustand'
import type { GamePhase, Difficulty, ScoreEntry } from '../types/game'
import { LEADERBOARD_KEY, LEADERBOARD_MAX } from '../constants/game'

export interface GameStoreState {
  phase: GamePhase
  score: number
  lives: number
  level: number
  highScore: number
  difficulty: Difficulty
  leaderboard: ScoreEntry[]

  setPhase: (phase: GamePhase) => void
  setScore: (score: number) => void
  setLives: (lives: number) => void
  setLevel: (level: number) => void
  setDifficulty: (d: Difficulty) => void
  submitScore: (name: string, score: number, level: number) => void
}

function loadLeaderboard(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLeaderboard(lb: ScoreEntry[]): void {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(lb))
  } catch {
    // ignore
  }
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  phase: 'MENU',
  score: 0,
  lives: 3,
  level: 1,
  highScore: loadLeaderboard()[0]?.score ?? 0,
  difficulty: 'NORMAL',
  leaderboard: loadLeaderboard(),

  setPhase: (phase) => set({ phase }),
  setScore: (score) => set(s => ({ score, highScore: Math.max(s.highScore, score) })),
  setLives: (lives) => set({ lives }),
  setLevel: (level) => set({ level }),
  setDifficulty: (difficulty) => set({ difficulty }),

  submitScore: (name, score, level) => {
    const entry: ScoreEntry = {
      name,
      score,
      level,
      date: new Date().toISOString(),
    }
    const current = get().leaderboard
    const updated = [...current, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, LEADERBOARD_MAX)
    saveLeaderboard(updated)
    set({
      leaderboard: updated,
      highScore: updated[0]?.score ?? 0,
      phase: 'MENU',
    })
  },
}))
