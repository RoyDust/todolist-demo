import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from '../src/App'

// 辅助函数：确保在登录模式
function ensureLoginMode() {
  // 检查当前是否是注册模式
  const registerHeading = screen.queryByRole('heading', { name: '创建账号' })
  if (registerHeading) {
    // 如果是注册模式，点击切换到登录
    fireEvent.click(screen.getByRole('button', { name: '立即登录' }))
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
})

describe('Auth Acceptance', () => {
  it('allows a new user to register and enter main app', () => {
    render(<App />)
    ensureLoginMode()

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
    ensureLoginMode()

    fireEvent.click(screen.getByRole('button', { name: '立即注册' }))
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'bob' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'bob12345' } })
    fireEvent.click(screen.getByRole('button', { name: '注册' }))

    fireEvent.click(screen.getByLabelText('退出登录'))
    // 退出登录后，确保回到登录模式
    ensureLoginMode()
    fireEvent.click(screen.getByRole('button', { name: '立即注册' }))
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'bob' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'another1' } })
    fireEvent.click(screen.getByRole('button', { name: '注册' }))

    expect(screen.getByText('用户名已被注册')).toBeInTheDocument()
  })

  it('allows existing user to log in after logout', () => {
    render(<App />)
    ensureLoginMode()

    fireEvent.click(screen.getByRole('button', { name: '立即注册' }))
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'charlie' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'charlie1' } })
    fireEvent.click(screen.getByRole('button', { name: '注册' }))

    fireEvent.click(screen.getByLabelText('退出登录'))
    // 确保在登录模式
    ensureLoginMode()
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'charlie' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'charlie1' } })
    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    expect(screen.getByText('charlie')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('添加新任务...')).toBeInTheDocument()
  })

  it('rejects login with wrong password', () => {
    render(<App />)
    ensureLoginMode()

    fireEvent.click(screen.getByRole('button', { name: '立即注册' }))
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'diana' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'diana11' } })
    fireEvent.click(screen.getByRole('button', { name: '注册' }))
    fireEvent.click(screen.getByLabelText('退出登录'))
    // 确保在登录模式
    ensureLoginMode()

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'diana' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'wrong99' } })
    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    expect(screen.getByText('用户名或密码错误')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('添加新任务...')).not.toBeInTheDocument()
  })

  it('validates required fields and minimum password length', () => {
    render(<App />)
    ensureLoginMode()

    fireEvent.click(screen.getByRole('button', { name: '登录' }))
    expect(screen.getByText('请输入用户名和密码')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'eva' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '12345' } })
    fireEvent.click(screen.getByRole('button', { name: '登录' }))
    expect(screen.getByText('密码至少需要 6 位')).toBeInTheDocument()
  })
})
