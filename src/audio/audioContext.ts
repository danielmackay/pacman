let _ctx: AudioContext | null = null
let _masterGain: GainNode | null = null

export function getAudioContext(): AudioContext {
  if (!_ctx) {
    _ctx = new AudioContext()
    _masterGain = _ctx.createGain()
    _masterGain.gain.value = 0.35
    _masterGain.connect(_ctx.destination)
  }
  if (_ctx.state === 'suspended') {
    _ctx.resume().catch(() => {})
  }
  return _ctx
}

export function getMasterGain(): GainNode {
  getAudioContext()
  return _masterGain!
}

export function setMasterVolume(vol: number): void {
  if (_masterGain) _masterGain.gain.value = vol
}
