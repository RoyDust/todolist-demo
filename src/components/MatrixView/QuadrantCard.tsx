import type { Todo, Quadrant } from '../../types'
import type { QuadrantInfo } from '../../types/quadrant'
import { QUADRANT_INFO } from '../../types/quadrant'
import './QuadrantCard.css'

interface QuadrantCardProps {
  quadrant: Quadrant
  todos: Todo[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (todo: Todo) => void
}

export function QuadrantCard({ quadrant, todos, onToggle, onDelete, onEdit }: QuadrantCardProps) {
  const info: QuadrantInfo = QUADRANT_INFO[quadrant]
  const activeTodos = todos.filter((t) => !t.completed)
  const completedTodos = todos.filter((t) => t.completed)

  return (
    <div className="quadrant-card" data-quadrant={quadrant}>
      <div className="quadrant-header" style={{ borderColor: info.color }}>
        <span className="quadrant-label" style={{ color: info.color }}>
          {info.labelZh}
        </span>
        <span className="quadrant-description">{info.descriptionZh}</span>
        <span className="quadrant-count">
          {activeTodos.length} 待办 / {completedTodos.length} 已完成
        </span>
      </div>

      <div className="quadrant-todos">
        {todos.length === 0 ? (
          <div className="quadrant-empty">无待办</div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                className="todo-checkbox"
              />
              <span
                className="todo-text"
                onClick={() => onEdit(todo)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onEdit(todo)}
              >
                {todo.text}
              </span>
              <button
                className="delete-btn"
                onClick={() => onDelete(todo.id)}
                aria-label="删除"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
