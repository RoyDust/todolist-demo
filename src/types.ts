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
}

export type FilterType = 'all' | 'active' | 'completed'
