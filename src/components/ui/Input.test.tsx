import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@solidjs/testing-library'
import { Input } from './Input'

describe('Input', () => {
  it('应该渲染输入框', () => {
    render(() => <Input placeholder="请输入" />)
    expect(screen.getByPlaceholderText('请输入')).toBeInTheDocument()
  })

  it('应该渲染标签', () => {
    render(() => <Input label="用户名" />)
    expect(screen.getByText('用户名')).toBeInTheDocument()
  })

  it('必填字段应该显示星号', () => {
    render(() => <Input label="邮箱" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('应该显示错误信息', () => {
    render(() => <Input error="邮箱格式不正确" />)
    expect(screen.getByText('邮箱格式不正确')).toBeInTheDocument()
  })

  it('应该显示帮助文本', () => {
    render(() => <Input helpText="请输入有效的邮箱地址" />)
    expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
  })

  it('有错误时不应该显示帮助文本', () => {
    render(() => <Input helpText="帮助文本" error="错误信息" />)
    expect(screen.getByText('错误信息')).toBeInTheDocument()
    expect(screen.queryByText('帮助文本')).not.toBeInTheDocument()
  })

  it('应该处理输入事件', () => {
    const handleInput = vi.fn()
    render(() => <Input onInput={handleInput} />)

    const input = screen.getByRole('textbox')
    fireEvent.input(input, { target: { value: 'test' } })
    expect(handleInput).toHaveBeenCalled()
  })

  it('应该应用错误样式', () => {
    render(() => <Input error="错误" data-testid="error-input" />)
    const input = screen.getByTestId('error-input')
    expect(input.className).toContain('border-red-300')
  })

  it('禁用状态应该应用禁用样式', () => {
    render(() => <Input disabled data-testid="disabled-input" />)
    const input = screen.getByTestId('disabled-input')
    expect(input).toBeDisabled()
    expect(input.className).toContain('cursor-not-allowed')
  })

  it('应该支持自定义 id', () => {
    render(() => <Input id="custom-id" label="自定义" />)
    const input = document.getElementById('custom-id')
    expect(input).toBeInTheDocument()
  })

  it('标签应该关联到输入框', () => {
    render(() => <Input id="test-input" label="测试标签" />)
    const label = screen.getByText('测试标签')
    expect(label).toHaveAttribute('for', 'test-input')
  })

  it('应该支持不同类型的输入', () => {
    render(() => <Input type="password" data-testid="password-input" />)
    const input = screen.getByTestId('password-input')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('应该支持自定义 class', () => {
    render(() => <Input class="custom-class" data-testid="custom-input" />)
    const input = screen.getByTestId('custom-input')
    expect(input.className).toContain('custom-class')
  })
})
