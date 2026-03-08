import type { Difficulty, GameConfig } from '../types/game'
import { PACMAN_BASE_SPEED, GHOST_BASE_SPEED } from './game'
import { MODE_SCHEDULE } from './ghosts'

export const DIFFICULTY_CONFIGS: Record<Difficulty, GameConfig> = {
  EASY: {
    difficulty: 'EASY',
    ghostSpeedMultiplier: 0.70,
    pacmanSpeedBase: PACMAN_BASE_SPEED * 1.10,
    frightDuration: 12000,
    flashStartTime: 3000,
    modeTimerSchedule: MODE_SCHEDULE,
  },
  NORMAL: {
    difficulty: 'NORMAL',
    ghostSpeedMultiplier: 1.00,
    pacmanSpeedBase: PACMAN_BASE_SPEED,
    frightDuration: 8000,
    flashStartTime: 2000,
    modeTimerSchedule: MODE_SCHEDULE,
  },
  HARD: {
    difficulty: 'HARD',
    ghostSpeedMultiplier: 1.30,
    pacmanSpeedBase: PACMAN_BASE_SPEED * 0.95,
    frightDuration: 4000,
    flashStartTime: 1500,
    modeTimerSchedule: MODE_SCHEDULE,
  },
}

export const GHOST_SPEED_FOR_CONFIG = (config: GameConfig) =>
  GHOST_BASE_SPEED * config.ghostSpeedMultiplier
