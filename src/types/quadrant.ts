/**
 * Eisenhower Matrix (Four Quadrants) Types
 *
 * Q1: Urgent & Important - Do First
 * Q2: Important but Not Urgent - Schedule
 * Q3: Urgent but Not Important - Delegate
 * Q4: Not Urgent or Important - Eliminate
 */

export type Quadrant = 'q1' | 'q2' | 'q3' | 'q4'

export type ViewMode = 'list' | 'matrix'

export interface QuadrantInfo {
  id: Quadrant
  label: string
  description: string
  color: string
  darkColor: string
}

export const QUADRANT_INFO: Record<Quadrant, QuadrantInfo> = {
  q1: {
    id: 'q1',
    label: 'Q1',
    description: 'Do First',
    color: '#ef4444', // red-500
    darkColor: '#f87171', // red-400
  },
  q2: {
    id: 'q2',
    label: 'Q2',
    description: 'Schedule',
    color: '#3b82f6', // blue-500
    darkColor: '#60a5fa', // blue-400
  },
  q3: {
    id: 'q3',
    label: 'Q3',
    description: 'Delegate',
    color: '#f59e0b', // amber-500
    darkColor: '#fbbf24', // amber-400
  },
  q4: {
    id: 'q4',
    label: 'Q4',
    description: 'Eliminate',
    color: '#6b7280', // gray-500
    darkColor: '#9ca3af', // gray-400
  },
}

export const ALL_QUADRANTS: Quadrant[] = ['q1', 'q2', 'q3', 'q4']
