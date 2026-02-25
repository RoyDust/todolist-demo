import { useState, useEffect } from 'react'
import type { Todo, FilterType, Priority } from './types'
import './App.css'

const STORAGE_KEY = 'todolist-demo-todos'
const DARK_MODE_KEY = 'todolist-demo-dark-mode'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function formatTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`
  return new Date(timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortByPriority, setSortByPriority] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem(DARK_MODE_KEY) === 'true')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem(DARK_MODE_KEY, String(dark))
  }, [dark])

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false, priority, createdAt: Date.now() }])
    setInput('')
    setPriority('medium')
  }

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
          : t
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
  const displayTodos = sortByPriority
    ? [...filteredTodos].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    : filteredTodos

  const activeCount = todos.filter(t => !t.completed).length

  return (
    <div className="app">
      <div className="header">
        <h1>📝 Todo List</h1>
        <button className="theme-toggle" onClick={() => setDark(d => !d)}>
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="input-row">
        <input
          type="text"
          placeholder="添加新任务..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
        />
        <select
          className="priority-select"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
        >
          <option value="high">🔴 高</option>
          <option value="medium">🟡 中</option>
          <option value="low">🟢 低</option>
        </select>
        <button className="add-btn" onClick={addTodo}>添加</button>
      </div>

      <div className="filters">
        {(['all', 'active', 'completed'] as FilterType[]).map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成'}
          </button>
        ))}
        <span className="count">{activeCount} 项待完成</span>
        <button
          className={`filter-btn ${sortByPriority ? 'active' : ''}`}
          onClick={() => setSortByPriority(s => !s)}
        >
          ↕ 优先级排序
        </button>
      </div>

      <ul className="todo-list">
        {displayTodos.length === 0 && (
          <li className="empty">暂无任务</li>
        )}
        {displayTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <label className="todo-label">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className={`priority-dot priority-${todo.priority}`} />
              <div className="todo-content">
                <span className="todo-text">{todo.text}</span>
                <span className="todo-time">
                  创建于 {formatTime(todo.createdAt)}
                  {todo.completed && todo.completedAt && (
                    <> · 完成于 {formatTime(todo.completedAt)}</>
                  )}
                </span>
              </div>
            </label>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
