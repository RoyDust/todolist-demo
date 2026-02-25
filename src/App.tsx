import { useState, useEffect } from 'react'
import type { Todo, FilterType } from './types'
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

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
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
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
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
      </div>

      <ul className="todo-list">
        {filteredTodos.length === 0 && (
          <li className="empty">暂无任务</li>
        )}
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <label className="todo-label">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className="todo-text">{todo.text}</span>
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
