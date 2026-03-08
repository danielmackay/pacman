import { maze1 } from './maze1'
import { maze2 } from './maze2'
import { maze3 } from './maze3'
import type { MazeLayout } from '../types/maze'

export const MAZE_REGISTRY: MazeLayout[] = [maze1, maze2, maze3]

export function getMazeForLevel(level: number): MazeLayout {
  return MAZE_REGISTRY[(level - 1) % MAZE_REGISTRY.length]
}
