export type Priority = 'high' | 'medium' | 'low'

export interface Todo {
  id: number
  text: string
  completed: boolean
  priority: Priority
}

export type FilterType = 'all' | 'active' | 'completed'
