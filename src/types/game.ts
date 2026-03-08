import type { PacManEntity, GhostEntity, Particle, FruitEntity } from './entities'
import type { MazeLayout } from './maze'

export type GamePhase =
  | 'MENU'
  | 'COUNTDOWN'
  | 'PLAYING'
  | 'PAUSED'
  | 'PACMAN_DYING'
  | 'LEVEL_COMPLETE'
  | 'GAME_OVER'

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD'

export interface ModeInterval {
  mode: 'CHASE' | 'SCATTER'
  durationMs: number
}

export interface GameConfig {
  difficulty: Difficulty
  ghostSpeedMultiplier: number
  pacmanSpeedBase: number
  frightDuration: number
  flashStartTime: number
  modeTimerSchedule: ModeInterval[]
}

export interface ModeTimerState {
  current: 'CHASE' | 'SCATTER'
  scheduleIndex: number
  elapsed: number
  frightActive: boolean
  frightElapsed: number
}

export interface ScoreEntry {
  name: string
  score: number
  level: number
  date: string
}

// The mutable game ref — NOT stored in React/Zustand
export interface GameRef {
  pacman: PacManEntity
  ghosts: GhostEntity[]
  particles: Particle[]
  tileState: Uint8Array
  dotsRemaining: number
  fruit: FruitEntity | null
  modeTimer: ModeTimerState
  maze: MazeLayout
  gameTime: number
  score: number
  lives: number
  level: number
  comboCount: number
  phase: GamePhase
  deathTimer: number
  levelCompleteTimer: number
  countdownTimer: number
  lastChompWasA: boolean
  sirenNode: OscillatorNode | null
  frightNode: OscillatorNode | null
  particleNextId: number
}
