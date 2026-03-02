import type { Todo, Quadrant } from '../../types'
import { QuadrantCard } from './QuadrantCard'
import './MatrixView.css'

interface MatrixViewProps {
  todosByQuadrant: Record<Quadrant, Todo[]>
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (todo: Todo) => void
}

export function MatrixView({ todosByQuadrant, onToggle, onDelete, onEdit }: MatrixViewProps) {
  // Q1 and Q2 are "Important" (rows), Q3 and Q4 are "Not Important" (rows)
  // Q1 and Q3 are "Urgent" (columns), Q2 and Q4 are "Not Urgent" (columns)
  //
  //           Urgent          Not Urgent
  // Important    Q1              Q2
  // Not          Q3              Q4

  return (
    <div className="matrix-view">
      <div className="matrix-header">
        <h2>四象限视图</h2>
        <p className="matrix-subtitle">艾森豪威尔矩阵 - 按紧急程度和重要性分类</p>
      </div>

      <div className="matrix-grid">
        {/* Row 1: Important */}
        <div className="matrix-row matrix-row-important">
          <div className="matrix-col matrix-col-urgent">
            <QuadrantCard
              quadrant="q1"
              todos={todosByQuadrant.q1}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
          <div className="matrix-col matrix-col-not-urgent">
            <QuadrantCard
              quadrant="q2"
              todos={todosByQuadrant.q2}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        </div>

        {/* Row 2: Not Important */}
        <div className="matrix-row matrix-row-not-important">
          <div className="matrix-col matrix-col-urgent">
            <QuadrantCard
              quadrant="q3"
              todos={todosByQuadrant.q3}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
          <div className="matrix-col matrix-col-not-urgent">
            <QuadrantCard
              quadrant="q4"
              todos={todosByQuadrant.q4}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        </div>
      </div>

      {/* Axis Labels */}
      <div className="matrix-axis-labels">
        <div className="matrix-axis-y">
          <span className="axis-label axis-label-top">重要</span>
          <span className="axis-label axis-label-bottom">不重要</span>
        </div>
        <div className="matrix-axis-x">
          <span className="axis-label axis-label-left">紧急</span>
          <span className="axis-label axis-label-right">不紧急</span>
        </div>
      </div>
    </div>
  )
}
