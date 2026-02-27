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

/* ---- SVG Icons (Lucide-style) ---- */
const IconClipboard = () => (
  <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
)

const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
)

const IconSort = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5h10" /><path d="M11 9h7" /><path d="M11 13h4" />
    <path d="M3 17l3 3 3-3" /><path d="M6 18V4" />
  </svg>
)

const IconInbox = () => (
  <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

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
  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const priorityLabels: Record<Priority, string> = { high: '高', medium: '中', low: '低' }

  return (
    <div className="app">
      <div className="header">
        <div className="header-title">
          <IconClipboard />
          <h1>Todo List</h1>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDark(d => !d)}
          aria-label={dark ? '切换到亮色模式' : '切换到暗色模式'}
        >
          {dark ? <IconSun /> : <IconMoon />}
        </button>
      </div>

      {totalCount > 0 && (
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{completedCount}/{totalCount} 已完成</span>
        </div>
      )}

      <div className="input-row">
        <input
          type="text"
          placeholder="添加新任务..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          aria-label="新任务内容"
        />
        <select
          className="priority-select"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
          aria-label="优先级"
        >
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
        <button className="add-btn" onClick={addTodo} aria-label="添加任务">
          <IconPlus />
          <span>添加</span>
        </button>
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
          className={`filter-btn sort-btn ${sortByPriority ? 'active' : ''}`}
          onClick={() => setSortByPriority(s => !s)}
          aria-label="按优先级排序"
        >
          <IconSort />
          <span>排序</span>
        </button>
      </div>

      <ul className="todo-list">
        {displayTodos.length === 0 && (
          <li className="empty">
            <IconInbox />
            <span>{filter === 'all' ? '暂无任务，添加一个吧' : filter === 'active' ? '没有进行中的任务' : '没有已完成的任务'}</span>
          </li>
        )}
        {displayTodos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <label className="todo-label">
              <span className="custom-checkbox" role="checkbox" aria-checked={todo.completed}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="checkbox-box">
                  {todo.completed && <IconCheck />}
                </span>
              </span>
              <span className={`priority-dot priority-${todo.priority}`} title={`${priorityLabels[todo.priority]}优先级`} />
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
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)} aria-label={`删除 ${todo.text}`}>
              <IconTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
