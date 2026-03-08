# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install          # install dependencies
bun run dev          # start Vite dev server (http://localhost:5173)
bun run build        # tsc + vite build
bun run preview      # preview production build
bunx tsc --noEmit    # type-check without emitting
```

## Architecture

The game uses a hard split between the **game engine** (mutable JS objects, runs at 60fps) and **React** (UI overlays only, re-renders only on discrete events).

### The core boundary

`gameRef` — a plain mutable object holding `{ pacman, ghosts, particles, tileState, score, lives, … }` — is mutated freely every frame by the game loop. React never sees it. Zustand (`src/store/gameStore.ts`) holds only low-frequency state: `phase`, `score`, `lives`, `level`, `leaderboard`. The game loop calls `store.setState(...)` only on meaningful events (dot eaten → score change, death → lives change, all dots → phase change).

The RAF loop lives in `src/engine/gameLoop.ts` and is mounted/unmounted by `src/hooks/useGameLoop.ts`. Each tick: `update(dt)` → `render(ctx, gameRef)`. The canvas is sized to `448×496` (28×31 tiles at 16px each) and is never touched by React.

### Maze format

Mazes are flat `TileType[]` arrays (28 cols × 31 rows, row-major). `tiles[row * 28 + col]`. Three layouts cycle with `getMazeForLevel(level)` → `(level - 1) % 3`. A separate `Uint8Array tileState` (same length) tracks which eatables remain (1 = present, 0 = eaten); the maze layout itself never mutates.

Tile types beyond classic Pac-Man: `POWER_SPEED` (cyan, 2× speed 5s), `POWER_FREEZE` (silver, ghosts frozen 3s), `POWER_MAGNET` (gold, pulls/eats nearby ghosts 4s).

### Ghost AI

All ghost movement is tile-crossing based (`src/engine/ai/index.ts`). Ghosts move freely in their current direction; when they cross into a new tile (`Math.floor(pos / TILE_SIZE)` changes), they snap to the new tile's center and pick the next direction via `chooseGhostDirection` (minimum Manhattan distance to target, no 180° reversals). **Do not reintroduce threshold-based centering** — it causes snap-back oscillation at normal speeds.

Ghost door access is mode-gated in `canGhostWalkTile`: only `EATEN` and `LEAVING` ghosts may traverse `GHOST_DOOR` or `GHOST_HOUSE` tiles.

### Phase state machine

`MENU → COUNTDOWN → PLAYING ↔ PAUSED → PACMAN_DYING → COUNTDOWN | GAME_OVER → MENU`
`PLAYING → LEVEL_COMPLETE → COUNTDOWN`

Phase transitions happen in `gameLoop.ts` (via `storeRef.current.setPhase(...)`) and are rendered in `App.tsx` which routes to the correct screen/overlay.

### Audio

Web Audio API only — no asset files. `AudioContext` is lazily initialized on first user gesture. All sounds are self-contained oscillator+gain node graphs that auto-disconnect. Background siren and frightened theme return `OscillatorNode` refs stored in `gameRef.sirenNode` / `gameRef.frightNode` for manual stop.
