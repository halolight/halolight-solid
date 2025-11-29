import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createRoot } from 'solid-js'

// Mock storage
vi.mock('~/lib/storage', () => ({
  storage: {
    get: vi.fn(() => null),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  },
}))

describe('uiStore', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    vi.resetModules()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('应该有正确的初始状态', async () => {
    const { uiStore } = await import('./ui')

    createRoot((dispose) => {
      expect(uiStore.sidebarCollapsed).toBe(false)
      // 初始主题应该是 'system'，因为 storage.get 返回 null 时会设置为 'system'
      expect(uiStore.theme).toBe('system')
      expect(uiStore.breadcrumbs).toEqual([])
      expect(uiStore.notifications).toEqual([])
      expect(uiStore.isLoading).toBe(false)
      expect(uiStore.pageTitle).toBe('')
      dispose()
    })
  })

  it('toggleSidebar 应该切换侧边栏状态', async () => {
    const { uiStore, actions } = await import('./ui')

    createRoot((dispose) => {
      expect(uiStore.sidebarCollapsed).toBe(false)
      actions.toggleSidebar()
      expect(uiStore.sidebarCollapsed).toBe(true)
      actions.toggleSidebar()
      expect(uiStore.sidebarCollapsed).toBe(false)
      dispose()
    })
  })

  it('setSidebarCollapsed 应该设置侧边栏状态', async () => {
    const { uiStore, actions } = await import('./ui')

    createRoot((dispose) => {
      actions.setSidebarCollapsed(true)
      expect(uiStore.sidebarCollapsed).toBe(true)
      actions.setSidebarCollapsed(false)
      expect(uiStore.sidebarCollapsed).toBe(false)
      dispose()
    })
  })

  it('setTheme 应该设置主题', async () => {
    const { uiStore, actions } = await import('./ui')

    createRoot((dispose) => {
      actions.setTheme('dark')
      expect(uiStore.theme).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)

      actions.setTheme('light')
      expect(uiStore.theme).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      dispose()
    })
  })

  it('toggleTheme 应该切换主题', async () => {
    const { uiStore, actions } = await import('./ui')

    createRoot((dispose) => {
      // toggleTheme 循环: light -> dark -> system -> light
      actions.setTheme('light')
      expect(uiStore.theme).toBe('light')

      actions.toggleTheme()
      expect(uiStore.theme).toBe('dark')

      actions.toggleTheme()
      expect(uiStore.theme).toBe('system')

      actions.toggleTheme()
      expect(uiStore.theme).toBe('light')
      dispose()
    })
  })

  it('setBreadcrumbs 应该设置面包屑', async () => {
    const { uiStore, actions } = await import('./ui')

    createRoot((dispose) => {
      const breadcrumbs = [{ label: '首页', href: '/' }, { label: '用户管理', href: '/users' }, { label: '添加用户' }]
      actions.setBreadcrumbs(breadcrumbs)
      expect(uiStore.breadcrumbs).toEqual(breadcrumbs)
      dispose()
    })
  })

  it('addNotification 应该添加通知', async () => {
    vi.useFakeTimers()
    const { uiStore, actions } = await import('./ui')

    createRoot((dispose) => {
      actions.addNotification({
        type: 'success',
        title: '成功',
        message: '操作成功',
      })

      expect(uiStore.notifications.length).toBe(1)
      expect(uiStore.notifications[0].type).toBe('success')
      expect(uiStore.notifications[0].title).toBe('成功')
      expect(uiStore.notifications[0].message).toBe('操作成功')
      expect(uiStore.notifications[0].id).toBeDefined()
      expect(uiStore.notifications[0].createdAt).toBeDefined()
      dispose()
    })

    vi.useRealTimers()
  })

  it('removeNotification 应该移除通知', async () => {
    vi.useFakeTimers()
    const { uiStore, actions } = await import('./ui')

    createRoot((dispose) => {
      actions.addNotification({
        type: 'info',
        title: '信息',
        message: '测试消息',
        duration: 10000,
      })

      const notificationId = uiStore.notifications[0].id
      expect(uiStore.notifications.length).toBe(1)

      actions.removeNotification(notificationId)
      expect(uiStore.notifications.length).toBe(0)
      dispose()
    })

    vi.useRealTimers()
  })

  it('clearNotifications 应该清除所有通知', async () => {
    vi.useFakeTimers()
    const { uiStore, actions } = await import('./ui')

    createRoot((dispose) => {
      actions.addNotification({ type: 'info', title: '1', message: '1', duration: 10000 })
      actions.addNotification({ type: 'success', title: '2', message: '2', duration: 10000 })
      actions.addNotification({ type: 'warning', title: '3', message: '3', duration: 10000 })

      expect(uiStore.notifications.length).toBe(3)

      actions.clearNotifications()
      expect(uiStore.notifications.length).toBe(0)
      dispose()
    })

    vi.useRealTimers()
  })

  it('setLoading 应该设置加载状态', async () => {
    const { uiStore, actions } = await import('./ui')

    createRoot((dispose) => {
      actions.setLoading(true)
      expect(uiStore.isLoading).toBe(true)
      actions.setLoading(false)
      expect(uiStore.isLoading).toBe(false)
      dispose()
    })
  })

  it('setPageTitle 应该设置页面标题', async () => {
    const { uiStore, actions } = await import('./ui')

    createRoot((dispose) => {
      actions.setPageTitle('用户管理')
      expect(uiStore.pageTitle).toBe('用户管理')
      expect(document.title).toBe('用户管理 - HaloLight')

      actions.setPageTitle('')
      expect(document.title).toBe('HaloLight')
      dispose()
    })
  })
})
