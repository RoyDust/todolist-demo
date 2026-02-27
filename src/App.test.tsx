import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../src/App'

beforeEach(() => {
  window.localStorage.clear()
})

describe('Auth Acceptance', () => {
  it('allows a new user to register and enter main app', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '立即注册' }))
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'alice123' } })
    fireEvent.click(screen.getByRole('button', { name: '注册' }))

    expect(screen.getByText('alice')).toBeInTheDocument()
    expect(screen.getByLabelText('退出登录')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('添加新任务...')).toBeInTheDocument()
  })

  it('shows error when registering duplicate username', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '立即注册' }))
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'bob' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'bob12345' } })
    fireEvent.click(screen.getByRole('button', { name: '注册' }))

    fireEvent.click(screen.getByLabelText('退出登录'))
    fireEvent.click(screen.getByRole('button', { name: '立即注册' }))
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'bob' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'another1' } })
    fireEvent.click(screen.getByRole('button', { name: '注册' }))

    expect(screen.getByText('用户名已被注册')).toBeInTheDocument()
  })

  it('allows existing user to log in after logout', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '立即注册' }))
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'charlie' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'charlie1' } })
    fireEvent.click(screen.getByRole('button', { name: '注册' }))

    fireEvent.click(screen.getByLabelText('退出登录'))
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'charlie' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'charlie1' } })
    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    expect(screen.getByText('charlie')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('添加新任务...')).toBeInTheDocument()
  })

  it('rejects login with wrong password', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '立即注册' }))
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'diana' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'diana11' } })
    fireEvent.click(screen.getByRole('button', { name: '注册' }))
    fireEvent.click(screen.getByLabelText('退出登录'))

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'diana' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'wrong99' } })
    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    expect(screen.getByText('用户名或密码错误')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('添加新任务...')).not.toBeInTheDocument()
  })

  it('validates required fields and minimum password length', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '登录' }))
    expect(screen.getByText('请输入用户名和密码')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'eva' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '12345' } })
    fireEvent.click(screen.getByRole('button', { name: '登录' }))
    expect(screen.getByText('密码至少需要 6 位')).toBeInTheDocument()
  })
})
