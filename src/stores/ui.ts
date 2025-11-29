import { createStore } from 'solid-js/store'
import { createEffect } from 'solid-js'
import { storage } from '~/lib/storage'

interface UIState {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  skin: 'default' | 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'teal' | 'slate' | 'ocean' | 'sunset' | 'aurora'
  showTabBar: boolean
  breadcrumbs: BreadcrumbItem[]
  notifications: Notification[]
  isLoading: boolean
  pageTitle: string
}

interface BreadcrumbItem {
  label: string
  href?: string
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
  createdAt: number
}

interface UIActions {
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
  setSkin: (skin: UIState['skin']) => void
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  setLoading: (loading: boolean) => void
  setPageTitle: (title: string) => void
}

const initialState: UIState = {
  sidebarCollapsed: false,
  theme: 'light',
  skin: 'default',
  showTabBar: true,
  breadcrumbs: [],
  notifications: [],
  isLoading: false,
  pageTitle: '',
}

const [uiStore, setUIStore] = createStore<UIState>(initialState)

const actions: UIActions = {
  toggleSidebar() {
    setUIStore('sidebarCollapsed', (collapsed) => !collapsed)
    storage.set('sidebarCollapsed', uiStore.sidebarCollapsed)
  },

  setSidebarCollapsed(collapsed: boolean) {
    setUIStore('sidebarCollapsed', collapsed)
    storage.set('sidebarCollapsed', collapsed)
  },

  setTheme(theme: 'light' | 'dark' | 'system') {
    setUIStore('theme', theme)
    storage.set('theme', theme)

    // 更新DOM的class
    let effectiveTheme = theme
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },

  toggleTheme() {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(uiStore.theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    actions.setTheme(nextTheme)
  },

  setSkin(skin: UIState['skin']) {
    setUIStore('skin', skin)
    storage.set('skin', skin)

    const root = document.documentElement
    if (skin === 'default') {
      root.removeAttribute('data-skin')
      return
    }
    root.setAttribute('data-skin', skin)
  },

  setBreadcrumbs(items: BreadcrumbItem[]) {
    setUIStore('breadcrumbs', items)
  },

  addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: Date.now(),
    }

    setUIStore('notifications', (notifications) => [...notifications, newNotification])

    // 自动移除通知
    const duration = notification.duration || 5000
    setTimeout(() => {
      actions.removeNotification(id)
    }, duration)
  },

  removeNotification(id: string) {
    setUIStore('notifications', (notifications) => notifications.filter((n) => n.id !== id))
  },

  clearNotifications() {
    setUIStore('notifications', [])
  },

  setLoading(loading: boolean) {
    setUIStore('isLoading', loading)
  },

  setPageTitle(title: string) {
    setUIStore('pageTitle', title)
    document.title = title ? `${title} - HaloLight` : 'HaloLight'
  },
}

// 初始化UI状态
createEffect(() => {
  // 从本地存储恢复设置
  const sidebarCollapsed = storage.get<boolean>('sidebarCollapsed')
  const theme = storage.get<'light' | 'dark' | 'system'>('theme')
  const skin = storage.get<UIState['skin']>('skin')

  if (sidebarCollapsed !== null) {
    setUIStore('sidebarCollapsed', sidebarCollapsed)
  }

  if (theme !== null) {
    setUIStore('theme', theme)
    actions.setTheme(theme)
  } else {
    // 默认跟随系统
    actions.setTheme('system')
  }

  if (skin !== null) {
    setUIStore('skin', skin)
    actions.setSkin(skin)
  }
})

// 监听系统主题变化
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    // 只有在用户设置为跟随系统时才更新
    if (uiStore.theme === 'system') {
      actions.setTheme('system')
    }
  })
}

export { uiStore, actions }
