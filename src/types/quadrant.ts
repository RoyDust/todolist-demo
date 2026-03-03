/**
 * Eisenhower Matrix (Four Quadrants) Types
 * 艾森豪威尔矩阵 - 四象限
 *
 * Q1: Urgent & Important - 重要且紧急 - 立即执行
 * Q2: Important but Not Urgent - 重要不紧急 - 计划执行
 * Q3: Urgent but Not Important - 紧急不重要 - 委托他人
 * Q4: Not Urgent or Important - 既不重要也不紧急 - 消除
 */

export type Quadrant = 'q1' | 'q2' | 'q3' | 'q4'

export type ViewMode = 'list' | 'matrix'

export interface QuadrantInfo {
  id: Quadrant
  label: string
  labelZh: string
  description: string
  descriptionZh: string
  color: string
  darkColor: string
}

export const QUADRANT_INFO: Record<Quadrant, QuadrantInfo> = {
  q1: {
    id: 'q1',
    label: 'Q1',
    labelZh: '紧急重要',
    description: 'Do First',
    descriptionZh: '立即执行',
    color: '#ef4444', // red-500
    darkColor: '#f87171', // red-400
  },
  q2: {
    id: 'q2',
    label: 'Q2',
    labelZh: '重要不紧急',
    description: 'Schedule',
    descriptionZh: '计划执行',
    color: '#3b82f6', // blue-500
    darkColor: '#60a5fa', // blue-400
  },
  q3: {
    id: 'q3',
    label: 'Q3',
    labelZh: '紧急不重要',
    description: 'Delegate',
    descriptionZh: '委托他人',
    color: '#f59e0b', // amber-500
    darkColor: '#fbbf24', // amber-400
  },
  q4: {
    id: 'q4',
    label: 'Q4',
    labelZh: '不紧急不重要',
    description: 'Eliminate',
    descriptionZh: '消除',
    color: '#6b7280', // gray-500
    darkColor: '#9ca3af', // gray-400
  },
}

export const ALL_QUADRANTS: Quadrant[] = ['q1', 'q2', 'q3', 'q4']

// Axis labels for the matrix
export const MATRIX_AXIS_LABELS = {
  urgent: { label: 'Urgent', labelZh: '紧急' },
  notUrgent: { label: 'Not Urgent', labelZh: '不紧急' },
  important: { label: 'Important', labelZh: '重要' },
  notImportant: { label: 'Not Important', labelZh: '不重要' },
}
