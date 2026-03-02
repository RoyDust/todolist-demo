import { useState, useMemo, useCallback } from 'react'
import type { Todo, Quadrant, ViewMode } from '../types'
import { ALL_QUADRANTS } from '../types'

interface UseQuadrantOptions {
  todos: Todo[]
}

interface UseQuadrantReturn {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void
  selectedQuadrant: Quadrant | null
  setSelectedQuadrant: (quadrant: Quadrant | null) => void
  // Filtered todos
  filteredTodos: Todo[]
  todosByQuadrant: Record<Quadrant, Todo[]>
  // Stats
  quadrantStats: Record<Quadrant, { total: number; active: number; completed: number }>
  // Helpers
  getTodosForQuadrant: (quadrant: Quadrant) => Todo[]
}

export function useQuadrant({ todos }: UseQuadrantOptions): UseQuadrantReturn {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant | null>(null)

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'list' ? 'matrix' : 'list'))
  }, [])

  // Group todos by quadrant
  const todosByQuadrant = useMemo(() => {
    const grouped: Record<Quadrant, Todo[]> = {
      q1: [],
      q2: [],
      q3: [],
      q4: [],
    }

    todos.forEach((todo) => {
      if (todo.quadrant) {
        grouped[todo.quadrant as Quadrant].push(todo)
      }
    })

    // Sort by priority within each quadrant
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    Object.keys(grouped).forEach((key) => {
      grouped[key as Quadrant].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    })

    return grouped
  }, [todos])

  // Filtered todos based on selected quadrant
  const filteredTodos = useMemo(() => {
    if (!selectedQuadrant) {
      return todos
    }
    return todosByQuadrant[selectedQuadrant] || []
  }, [todos, selectedQuadrant, todosByQuadrant])

  // Stats for each quadrant
  const quadrantStats = useMemo(() => {
    const stats: Record<Quadrant, { total: number; active: number; completed: number }> = {
      q1: { total: 0, active: 0, completed: 0 },
      q2: { total: 0, active: 0, completed: 0 },
      q3: { total: 0, active: 0, completed: 0 },
      q4: { total: 0, active: 0, completed: 0 },
    }

    ALL_QUADRANTS.forEach((quadrant) => {
      const quadTodos = todosByQuadrant[quadrant]
      stats[quadrant] = {
        total: quadTodos.length,
        active: quadTodos.filter((t) => !t.completed).length,
        completed: quadTodos.filter((t) => t.completed).length,
      }
    })

    return stats
  }, [todosByQuadrant])

  const getTodosForQuadrant = useCallback(
    (quadrant: Quadrant) => {
      return todosByQuadrant[quadrant] || []
    },
    [todosByQuadrant]
  )

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
    selectedQuadrant,
    setSelectedQuadrant,
    filteredTodos,
    todosByQuadrant,
    quadrantStats,
    getTodosForQuadrant,
  }
}
