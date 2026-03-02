export interface User {
  username: string
  password: string // 实际应用中应该加密存储
}

export type Priority = 'high' | 'medium' | 'low'

export interface Todo {
  id: number
  text: string
  completed: boolean
  priority: Priority
  createdAt: number
  completedAt?: number
  userId: string // 关联用户ID
  quadrant?: Quadrant // Eisenhower Matrix quadrant
}

export type FilterType = 'all' | 'active' | 'completed'

// Import quadrant types and values
import { QUADRANT_INFO, ALL_QUADRANTS } from './types/quadrant'
import type { Quadrant, ViewMode } from './types/quadrant'
export { QUADRANT_INFO, ALL_QUADRANTS }
export type { Quadrant, ViewMode }
