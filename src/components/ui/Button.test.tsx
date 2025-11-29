import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@solidjs/testing-library'
import { Button } from './Button'

describe('Button', () => {
  it('应该渲染按钮文本', () => {
    render(() => <Button>点击我</Button>)
    expect(screen.getByText('点击我')).toBeInTheDocument()
  })

  it('应该处理点击事件', () => {
    const handleClick = vi.fn()
    render(() => <Button onClick={handleClick}>点击</Button>)

    fireEvent.click(screen.getByText('点击'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('应该应用 primary 变体样式', () => {
    render(() => <Button variant="primary">Primary</Button>)
    const button = screen.getByText('Primary')
    expect(button.className).toContain('bg-blue-600')
  })

  it('应该应用 secondary 变体样式', () => {
    render(() => <Button variant="secondary">Secondary</Button>)
    const button = screen.getByText('Secondary')
    expect(button.className).toContain('bg-gray-200')
  })

  it('应该应用 danger 变体样式', () => {
    render(() => <Button variant="danger">Danger</Button>)
    const button = screen.getByText('Danger')
    expect(button.className).toContain('bg-red-600')
  })

  it('应该应用 ghost 变体样式', () => {
    render(() => <Button variant="ghost">Ghost</Button>)
    const button = screen.getByText('Ghost')
    expect(button.className).toContain('bg-transparent')
  })

  it('应该应用 sm 尺寸样式', () => {
    render(() => <Button size="sm">Small</Button>)
    const button = screen.getByText('Small')
    expect(button.className).toContain('px-3')
    expect(button.className).toContain('py-1.5')
  })

  it('应该应用 lg 尺寸样式', () => {
    render(() => <Button size="lg">Large</Button>)
    const button = screen.getByText('Large')
    expect(button.className).toContain('px-6')
    expect(button.className).toContain('py-3')
  })

  it('禁用状态应该阻止点击', () => {
    const handleClick = vi.fn()
    render(() => (
      <Button disabled onClick={handleClick}>
        禁用
      </Button>
    ))

    const button = screen.getByText('禁用')
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('加载状态应该禁用按钮并显示加载图标', () => {
    render(() => <Button loading>加载中</Button>)

    const button = screen.getByText('加载中').closest('button')
    expect(button).toBeDisabled()
    expect(button?.querySelector('svg')).toBeInTheDocument()
  })

  it('应该支持自定义 class', () => {
    render(() => <Button class="custom-class">自定义</Button>)
    const button = screen.getByText('自定义')
    expect(button.className).toContain('custom-class')
  })

  it('应该传递其他 HTML 属性', () => {
    render(() => (
      <Button type="submit" data-testid="submit-btn">
        提交
      </Button>
    ))

    const button = screen.getByTestId('submit-btn')
    expect(button).toHaveAttribute('type', 'submit')
  })
})
