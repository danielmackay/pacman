import type { GameRef } from '../types/game'
import { reverseDirection } from './collision'

export function updateModeTimer(state: GameRef, dt: number, config: { frightDuration: number; flashStartTime: number; modeTimerSchedule: typeof state.modeTimer extends never ? never : { mode: 'CHASE' | 'SCATTER'; durationMs: number }[] }): void {
  const timer = state.modeTimer
  const dtMs = dt * 1000

  if (timer.frightActive) {
    timer.frightElapsed += dtMs
    const remaining = config.frightDuration - timer.frightElapsed
    const shouldFlash = remaining <= config.flashStartTime

    for (const ghost of state.ghosts) {
      if (ghost.mode === 'FRIGHTENED') {
        ghost.isFlashing = shouldFlash
      }
    }

    if (timer.frightElapsed >= config.frightDuration) {
      timer.frightActive = false
      timer.frightElapsed = 0
      state.comboCount = 0
      for (const ghost of state.ghosts) {
        if (ghost.mode === 'FRIGHTENED') {
          ghost.mode = timer.current
          ghost.isFlashing = false
        }
      }
      // Restart siren
      startSirenIfNeeded(state)
    }
    return
  }

  timer.elapsed += dtMs
  const schedule = config.modeTimerSchedule
  const current = schedule[timer.scheduleIndex]
  if (!current) return

  if (timer.elapsed >= current.durationMs) {
    timer.elapsed = 0
    if (timer.scheduleIndex < schedule.length - 1) {
      timer.scheduleIndex++
    }
    const next = schedule[timer.scheduleIndex]
    const previousMode = timer.current
    timer.current = next.mode

    if (previousMode !== next.mode) {
      // Reverse all non-frightened/eaten ghosts
      for (const ghost of state.ghosts) {
        if (ghost.mode === 'CHASE' || ghost.mode === 'SCATTER') {
          ghost.mode = next.mode
          ghost.direction = reverseDirection(ghost.direction)
        }
      }
    }
  }
}

export function activateFrightened(state: GameRef, _frightDuration: number): void {
  const timer = state.modeTimer
  timer.frightActive = true
  timer.frightElapsed = 0
  state.comboCount = 0

  for (const ghost of state.ghosts) {
    if (ghost.mode === 'CHASE' || ghost.mode === 'SCATTER') {
      ghost.mode = 'FRIGHTENED'
      ghost.isFlashing = false
      ghost.direction = reverseDirection(ghost.direction)
    }
  }
}

function startSirenIfNeeded(_state: GameRef): void {
  // Handled in audio module; this is a hook point
}
