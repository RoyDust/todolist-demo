import { useState, useEffect, useCallback, useMemo } from 'react'
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

const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const IconSave = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
)

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortByPriority, setSortByPriority] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem(DARK_MODE_KEY) === 'true')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem(DARK_MODE_KEY, String(dark))
  }, [dark])

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey

      // Ctrl/Cmd + D: Toggle dark mode
      if (isMod && e.key === 'd') {
        e.preventDefault()
        setDark(d => !d)
      }

      // Ctrl/Cmd + K: Focus input
      if (isMod && e.key === 'k') {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('.input-row input')?.focus()
      }

      // Ctrl/Cmd + Shift + C: Clear completed
      if (isMod && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        setTodos(prev => prev.filter(t => !t.completed))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const addTodo = useCallback(() => {
    const text = input.trim()
    if (!text) return
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false, priority, createdAt: Date.now() }])
    setInput('')
    setPriority('medium')
  }, [input, priority])

  const toggleTodo = useCallback((id: number) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
          : t
      )
    )
  }, [])

  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const startEdit = useCallback((id: number, text: string) => {
    setEditingId(id)
    setEditingText(text)
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setEditingText('')
  }, [])

  const saveEdit = useCallback((id: number) => {
    const text = editingText.trim()
    if (text) {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t))
    }
    cancelEdit()
  }, [editingText, cancelEdit])

  const exportTodos = useCallback(() => {
    const data = JSON.stringify(todos, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todos-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [todos])

  const importTodos = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string)
            if (Array.isArray(data)) {
              setTodos(data)
            }
          } catch {
            alert('导入失败：文件格式不正确')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [])

  const filteredTodos = useMemo(() => {
    return todos.filter(t => {
      if (filter === 'active') return !t.completed
      if (filter === 'completed') return t.completed
      return true
    })
  }, [todos, filter])

  const displayTodos = useMemo(() => {
    const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
    return sortByPriority
      ? [...filteredTodos].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      : filteredTodos
  }, [filteredTodos, sortByPriority])

  const stats = useMemo(() => {
    const active = todos.filter(t => !t.completed).length
    const completed = todos.filter(t => t.completed).length
    const total = todos.length
    const progress = total > 0 ? (completed / total) * 100 : 0
    return { activeCount: active, completedCount: completed, totalCount: total, progress }
  }, [todos])

  const priorityLabels: Record<Priority, string> = useMemo(() => ({ high: '高', medium: '中', low: '低' }), [])

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

      {stats.totalCount > 0 && (
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${stats.progress}%` }} />
          </div>
          <span className="progress-text">{stats.completedCount}/{stats.totalCount} 已完成</span>
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
        <span className="count">{stats.activeCount} 项待完成</span>
        <button
          className={`filter-btn sort-btn ${sortByPriority ? 'active' : ''}`}
          onClick={() => setSortByPriority(s => !s)}
          aria-label="按优先级排序"
        >
          <IconSort />
          <span>排序</span>
        </button>
        <div className="import-export">
          <button className="filter-btn" onClick={exportTodos} aria-label="导出数据">
            <IconDownload />
            <span>导出</span>
          </button>
          <button className="filter-btn" onClick={importTodos} aria-label="导入数据">
            <IconUpload />
            <span>导入</span>
          </button>
        </div>
      </div>

      <ul className="todo-list">
        {displayTodos.length === 0 && (
          <li className="empty">
            <IconInbox />
            <span>{filter === 'all' ? '暂无任务，添加一个吧' : filter === 'active' ? '没有进行中的任务' : '没有已完成的任务'}</span>
          </li>
        )}
        {displayTodos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''} ${editingId === todo.id ? 'editing' : ''}`}>
            {editingId === todo.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  className="edit-input"
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEdit(todo.id)
                    if (e.key === 'Escape') cancelEdit()
                  }}
                  autoFocus
                  aria-label="编辑任务"
                />
                <button className="edit-save-btn" onClick={() => saveEdit(todo.id)} aria-label="保存">
                  <IconSave />
                </button>
                <button className="edit-cancel-btn" onClick={cancelEdit} aria-label="取消">
                  <IconX />
                </button>
              </div>
            ) : (
              <>
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
                <div className="todo-actions">
                  <button className="edit-btn" onClick={() => startEdit(todo.id, todo.text)} aria-label={`编辑 ${todo.text}`}>
                    <IconEdit />
                  </button>
                  <button className="delete-btn" onClick={() => deleteTodo(todo.id)} aria-label={`删除 ${todo.text}`}>
                    <IconTrash />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
