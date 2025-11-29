import { createStore } from 'solid-js/store'
import { createEffect } from 'solid-js'
import type { DashboardStats, Widget, GridLayout, DashboardLayout } from '~/types/dashboard'
import type { ApiResponse } from '~/types/api'
import { dashboardService } from '~/services/dashboard'
import { storage } from '~/lib/storage'

interface DashboardState {
  stats: DashboardStats | null
  widgets: Widget[]
  layout: DashboardLayout
  isLoading: boolean
  error: string | null
}

interface DashboardActions {
  fetchStats: () => Promise<void>
  fetchWidgets: () => Promise<void>
  updateLayout: (layout: DashboardLayout) => void
  addWidget: (widget: Widget) => void
  removeWidget: (widgetId: string) => void
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void
  clearError: () => void
}

// 默认布局配置
const defaultLayout: DashboardLayout = {
  lg: [
    { i: 'stats-overview', x: 0, y: 0, w: 12, h: 2, static: true },
    { i: 'user-growth-chart', x: 0, y: 2, w: 6, h: 4 },
    { i: 'revenue-chart', x: 6, y: 2, w: 6, h: 4 },
    { i: 'recent-users', x: 0, y: 6, w: 4, h: 4 },
    { i: 'notifications', x: 4, y: 6, w: 4, h: 4 },
    { i: 'quick-actions', x: 8, y: 6, w: 4, h: 4 },
  ],
  md: [
    { i: 'stats-overview', x: 0, y: 0, w: 8, h: 2, static: true },
    { i: 'user-growth-chart', x: 0, y: 2, w: 8, h: 4 },
    { i: 'revenue-chart', x: 0, y: 6, w: 8, h: 4 },
    { i: 'recent-users', x: 0, y: 10, w: 4, h: 4 },
    { i: 'notifications', x: 4, y: 10, w: 4, h: 4 },
    { i: 'quick-actions', x: 0, y: 14, w: 8, h: 2 },
  ],
  sm: [
    { i: 'stats-overview', x: 0, y: 0, w: 4, h: 2, static: true },
    { i: 'user-growth-chart', x: 0, y: 2, w: 4, h: 4 },
    { i: 'revenue-chart', x: 0, y: 6, w: 4, h: 4 },
    { i: 'recent-users', x: 0, y: 10, w: 4, h: 4 },
    { i: 'notifications', x: 0, y: 14, w: 4, h: 4 },
    { i: 'quick-actions', x: 0, y: 18, w: 4, h: 2 },
  ],
}

const initialState: DashboardState = {
  stats: null,
  widgets: [],
  layout: defaultLayout,
  isLoading: false,
  error: null,
}

const [dashboardStore, setDashboardStore] = createStore<DashboardState>(initialState)

const actions: DashboardActions = {
  async fetchStats() {
    setDashboardStore('isLoading', true)
    setDashboardStore('error', null)

    try {
      const response = await dashboardService.getStats()
      setDashboardStore('stats', response.data)
      setDashboardStore('isLoading', false)
    } catch (error: any) {
      setDashboardStore({
        isLoading: false,
        error: error.message || '获取统计数据失败',
      })
    }
  },

  async fetchWidgets() {
    setDashboardStore('isLoading', true)
    setDashboardStore('error', null)

    try {
      const response = await dashboardService.getWidgets()
      setDashboardStore('widgets', response.data)
      setDashboardStore('isLoading', false)
    } catch (error: any) {
      setDashboardStore({
        isLoading: false,
        error: error.message || '获取组件数据失败',
      })
    }
  },

  updateLayout(layout: DashboardLayout) {
    setDashboardStore('layout', layout)
    storage.set('dashboardLayout', layout)
  },

  addWidget(widget: Widget) {
    setDashboardStore('widgets', (widgets) => [...widgets, widget])
  },

  removeWidget(widgetId: string) {
    setDashboardStore('widgets', (widgets) => widgets.filter((w) => w.id !== widgetId))

    // 同时从布局中移除
    const newLayout = { ...dashboardStore.layout }
    Object.keys(newLayout).forEach((breakpoint) => {
      newLayout[breakpoint] = newLayout[breakpoint].filter((item) => item.i !== widgetId)
    })
    setDashboardStore('layout', newLayout)
    storage.set('dashboardLayout', newLayout)
  },

  updateWidget(widgetId: string, updates: Partial<Widget>) {
    setDashboardStore('widgets', (widgets) =>
      widgets.map((widget) => (widget.id === widgetId ? { ...widget, ...updates } : widget))
    )
  },

  clearError() {
    setDashboardStore('error', null)
  },
}

// 初始化时从本地存储恢复布局
createEffect(() => {
  const savedLayout = storage.get<DashboardLayout>('dashboardLayout')
  if (savedLayout) {
    setDashboardStore('layout', savedLayout)
  }
})

export { dashboardStore, actions, defaultLayout }
