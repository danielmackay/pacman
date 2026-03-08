import type { GameRef } from '../types/game'
import type { PowerUpType } from '../types/entities'
import { emitParticle } from './particleSystem'

export function emitDotEat(state: GameRef, x: number, y: number): void {
  for (let i = 0; i < 4; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 20 + Math.random() * 40
    emitParticle(state, {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: '#FFE566',
      size: 1.5,
      decay: 4.0,
      glow: false,
    })
  }
}

export function emitGhostEat(state: GameRef, x: number, y: number, ghostColor: string): void {
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2
    const speed = 60 + Math.random() * 60
    emitParticle(state, {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: ghostColor,
      size: 5,
      decay: 1.2,
      glow: true,
    })
  }
}

export function emitEnergizerEat(state: GameRef, x: number, y: number): void {
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2
    const speed = 40 + Math.random() * 80
    emitParticle(state, {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: '#FFFF00',
      size: 4,
      decay: 1.5,
      glow: true,
    })
  }
}

export function emitPowerUpEat(state: GameRef, x: number, y: number, type: PowerUpType): void {
  const colors: Record<PowerUpType, string> = {
    SPEED:  '#00FFFF',
    FREEZE: '#C0C0FF',
    MAGNET: '#FFD700',
  }
  const color = colors[type]
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2
    const speed = 50 + Math.random() * 100
    emitParticle(state, {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      size: 6,
      decay: 1.0,
      glow: true,
    })
  }
}

export function emitPacmanDeath(state: GameRef, x: number, y: number): void {
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2
    const speed = 40 + Math.random() * 120
    emitParticle(state, {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: '#FFE566',
      size: 8,
      decay: 0.8,
      glow: true,
    })
  }
}
