import { describe, it, expect } from 'vitest'
import { render, screen } from '@solidjs/testing-library'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'

describe('Card', () => {
  it('应该渲染子元素', () => {
    render(() => <Card>卡片内容</Card>)
    expect(screen.getByText('卡片内容')).toBeInTheDocument()
  })

  it('应该应用默认样式', () => {
    render(() => <Card data-testid="card">内容</Card>)
    const card = screen.getByTestId('card')
    expect(card.className).toContain('bg-white')
    expect(card.className).toContain('shadow')
    expect(card.className).toContain('rounded-lg')
  })

  it('应该支持自定义 class', () => {
    render(() => (
      <Card class="custom-class" data-testid="card">
        内容
      </Card>
    ))
    const card = screen.getByTestId('card')
    expect(card.className).toContain('custom-class')
  })
})

describe('CardHeader', () => {
  it('应该渲染子元素', () => {
    render(() => <CardHeader>头部内容</CardHeader>)
    expect(screen.getByText('头部内容')).toBeInTheDocument()
  })

  it('应该应用边框样式', () => {
    render(() => <CardHeader data-testid="header">头部</CardHeader>)
    const header = screen.getByTestId('header')
    expect(header.className).toContain('border-b')
    expect(header.className).toContain('px-6')
    expect(header.className).toContain('py-4')
  })
})

describe('CardTitle', () => {
  it('应该渲染标题', () => {
    render(() => <CardTitle>卡片标题</CardTitle>)
    expect(screen.getByText('卡片标题')).toBeInTheDocument()
  })

  it('应该使用 h3 标签', () => {
    render(() => <CardTitle>标题</CardTitle>)
    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toBeInTheDocument()
  })

  it('应该应用标题样式', () => {
    render(() => <CardTitle data-testid="title">标题</CardTitle>)
    const title = screen.getByTestId('title')
    expect(title.className).toContain('text-lg')
    expect(title.className).toContain('font-semibold')
  })
})

describe('CardDescription', () => {
  it('应该渲染描述文本', () => {
    render(() => <CardDescription>这是描述内容</CardDescription>)
    expect(screen.getByText('这是描述内容')).toBeInTheDocument()
  })

  it('应该应用描述样式', () => {
    render(() => <CardDescription data-testid="desc">描述</CardDescription>)
    const desc = screen.getByTestId('desc')
    expect(desc.className).toContain('text-sm')
    expect(desc.className).toContain('text-gray-500')
  })
})

describe('CardContent', () => {
  it('应该渲染内容', () => {
    render(() => <CardContent>主要内容</CardContent>)
    expect(screen.getByText('主要内容')).toBeInTheDocument()
  })

  it('应该应用内边距样式', () => {
    render(() => <CardContent data-testid="content">内容</CardContent>)
    const content = screen.getByTestId('content')
    expect(content.className).toContain('px-6')
    expect(content.className).toContain('py-4')
  })
})

describe('CardFooter', () => {
  it('应该渲染页脚内容', () => {
    render(() => <CardFooter>页脚内容</CardFooter>)
    expect(screen.getByText('页脚内容')).toBeInTheDocument()
  })

  it('应该应用边框样式', () => {
    render(() => <CardFooter data-testid="footer">页脚</CardFooter>)
    const footer = screen.getByTestId('footer')
    expect(footer.className).toContain('border-t')
    expect(footer.className).toContain('px-6')
    expect(footer.className).toContain('py-4')
  })
})

describe('Card 组合使用', () => {
  it('应该正确组合所有子组件', () => {
    render(() => (
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>标题</CardTitle>
          <CardDescription>描述</CardDescription>
        </CardHeader>
        <CardContent>内容</CardContent>
        <CardFooter>页脚</CardFooter>
      </Card>
    ))

    expect(screen.getByText('标题')).toBeInTheDocument()
    expect(screen.getByText('描述')).toBeInTheDocument()
    expect(screen.getByText('内容')).toBeInTheDocument()
    expect(screen.getByText('页脚')).toBeInTheDocument()
  })
})
