import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../src/App'

// Setup for jsdom
beforeEach(() => {
  localStorage.clear()
})

describe('Todo App', () => {
  it('renders the app', () => {
    render(<App />)
    expect(screen.getByText('Todo List')).toBeInTheDocument()
  })

  it('can add a new todo', () => {
    render(<App />)

    const input = screen.getByPlaceholderText('添加新任务...')
    const addButton = screen.getByText('添加')

    fireEvent.change(input, { target: { value: 'Test task' } })
    fireEvent.click(addButton)

    expect(screen.getByText('Test task')).toBeInTheDocument()
  })

  it('can toggle a todo', () => {
    render(<App />)

    const input = screen.getByPlaceholderText('添加新任务...')
    const addButton = screen.getByText('添加')

    fireEvent.change(input, { target: { value: 'Toggle test' } })
    fireEvent.click(addButton)

    const checkboxes = screen.getAllByRole('checkbox')
    const checkbox = checkboxes[0]
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('can delete a todo', () => {
    render(<App />)

    const input = screen.getByPlaceholderText('添加新任务...')
    const addButton = screen.getByText('添加')

    fireEvent.change(input, { target: { value: 'Delete test' } })
    fireEvent.click(addButton)

    expect(screen.getByText('Delete test')).toBeInTheDocument()

    const deleteBtn = screen.getByLabelText('删除 Delete test')
    fireEvent.click(deleteBtn)

    expect(screen.queryByText('Delete test')).not.toBeInTheDocument()
  })

  it('can filter todos', () => {
    render(<App />)

    // Add two todos
    const input = screen.getByPlaceholderText('添加新任务...')
    const addButton = screen.getByText('添加')

    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(addButton)

    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(addButton)

    // Toggle first todo
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    // Filter completed
    const completedBtn = screen.getByText('已完成')
    fireEvent.click(completedBtn)

    expect(screen.queryByText('Task 1')).toBeInTheDocument()
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument()
  })
})
