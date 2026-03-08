import { getAudioContext, getMasterGain } from './audioContext'

function osc(
  type: OscillatorType,
  freq: number,
  startTime: number,
  duration: number,
  gainVal: number,
  freqEnd?: number,
): void {
  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.connect(gain)
  gain.connect(getMasterGain())

  oscillator.type = type
  oscillator.frequency.setValueAtTime(freq, startTime)
  if (freqEnd !== undefined) {
    oscillator.frequency.exponentialRampToValueAtTime(freqEnd, startTime + duration)
  }

  gain.gain.setValueAtTime(gainVal, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration + 0.01)
}

export function playChompA(): void {
  const ctx = getAudioContext()
  osc('square', 220, ctx.currentTime, 0.06, 0.25)
}

export function playChompB(): void {
  const ctx = getAudioContext()
  osc('square', 140, ctx.currentTime, 0.06, 0.25)
}

export function playGhostEat(comboCount: number): void {
  const ctx = getAudioContext()
  const baseFreq = 200 + comboCount * 120
  osc('sawtooth', baseFreq,        ctx.currentTime,        0.15, 0.2, baseFreq * 2)
  osc('sawtooth', baseFreq * 1.5,  ctx.currentTime + 0.05, 0.15, 0.15, baseFreq * 3)
}

export function playEnergizerCollect(): void {
  const ctx = getAudioContext()
  const notes = [330, 415, 523, 659]
  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.06
    osc('triangle', freq, t, 0.1, 0.3)
  })
}

export function playPowerUpCollect(type: 'SPEED' | 'FREEZE' | 'MAGNET'): void {
  const ctx = getAudioContext()
  const freqs: Record<string, number[]> = {
    SPEED:  [440, 550, 660, 880],
    FREEZE: [300, 360, 420, 500],
    MAGNET: [200, 300, 400, 600],
  }
  freqs[type].forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.07
    osc('triangle', freq, t, 0.1, 0.28)
  })
}

export function playDeathJingle(): void {
  const ctx = getAudioContext()
  const notes = [494, 466, 440, 415, 392, 370, 349, 330, 311, 294, 277]
  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.09
    osc('square', freq, t, 0.12, 0.3)
  })
}

export function playLevelComplete(): void {
  const ctx = getAudioContext()
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.12
    osc('triangle', freq, t, 0.18, 0.4)
  })
}

export function playFruitCollect(): void {
  const ctx = getAudioContext()
  const notes = [784, 988, 1175, 1568]
  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.07
    osc('sine', freq, t, 0.1, 0.35)
  })
}

/** Returns a node pair to start/stop the siren */
export function startSiren(dotsRatio: number): { osc: OscillatorNode; gain: GainNode } {
  const ctx = getAudioContext()
  const master = getMasterGain()

  const baseFreq = 200 + (1 - dotsRatio) * 200  // 200–400Hz
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()

  lfo.frequency.value = 4
  lfoGain.gain.value = 30
  lfo.connect(lfoGain)
  lfoGain.connect(oscillator.frequency)

  oscillator.type = 'sawtooth'
  oscillator.frequency.value = baseFreq
  gain.gain.value = 0.08

  oscillator.connect(gain)
  gain.connect(master)
  lfo.start()
  oscillator.start()

  return { osc: oscillator, gain }
}

export function startFrightenedTheme(): OscillatorNode {
  const ctx = getAudioContext()
  const master = getMasterGain()

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()

  lfo.frequency.value = 6
  lfoGain.gain.value = 80
  lfo.connect(lfoGain)
  lfoGain.connect(oscillator.frequency)

  oscillator.type = 'square'
  oscillator.frequency.value = 120
  gain.gain.value = 0.07

  oscillator.connect(gain)
  gain.connect(master)
  lfo.start()
  oscillator.start()

  return oscillator
}

export function playCountdownBeep(n: number): void {
  const ctx = getAudioContext()
  const freq = n === 0 ? 880 : 440
  osc('sine', freq, ctx.currentTime, 0.15, 0.4)
}
