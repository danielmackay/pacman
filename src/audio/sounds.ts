import {
  playChompA, playChompB,
  playGhostEat, playEnergizerCollect,
  playPowerUpCollect, playDeathJingle,
  playLevelComplete, playFruitCollect,
  startSiren, startFrightenedTheme,
  playCountdownBeep,
} from './synthesizer'
import type { GameRef } from '../types/game'
import type { PowerUpType } from '../types/entities'

export const Sounds = {
  dotEaten(state: GameRef): void {
    if (state.lastChompWasA) {
      playChompA()
    } else {
      playChompB()
    }
    state.lastChompWasA = !state.lastChompWasA
  },

  ghostEaten(comboCount: number): void {
    playGhostEat(comboCount)
  },

  energizerCollected(): void {
    playEnergizerCollect()
  },

  powerUpCollected(type: PowerUpType): void {
    playPowerUpCollect(type)
  },

  pacmanDied(): void {
    playDeathJingle()
  },

  levelComplete(): void {
    playLevelComplete()
  },

  fruitCollected(): void {
    playFruitCollect()
  },

  countdown(n: number): void {
    playCountdownBeep(n)
  },

  startSiren(state: GameRef): void {
    if (state.sirenNode) {
      try { state.sirenNode.stop() } catch (_) {}
    }
    const dotsRatio = state.dotsRemaining / state.maze.dotCount
    const { osc } = startSiren(dotsRatio)
    state.sirenNode = osc
  },

  stopSiren(state: GameRef): void {
    if (state.sirenNode) {
      try { state.sirenNode.stop() } catch (_) {}
      state.sirenNode = null
    }
  },

  startFrightened(state: GameRef): void {
    Sounds.stopSiren(state)
    if (state.frightNode) {
      try { state.frightNode.stop() } catch (_) {}
    }
    state.frightNode = startFrightenedTheme()
  },

  stopFrightened(state: GameRef): void {
    if (state.frightNode) {
      try { state.frightNode.stop() } catch (_) {}
      state.frightNode = null
    }
  },
}
