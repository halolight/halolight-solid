export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  totalOrders: number
  conversionRate: number
  recentOrders: number
  pendingTasks: number
  userGrowth: number
  revenueGrowth: number
  orderGrowth: number
  rateGrowth: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
  }[]
}

export interface Widget {
  id: string
  type: WidgetType
  title: string
  data?: any
  config?: Record<string, any>
}

export type WidgetType =
  | 'stats'
  | 'chart-line'
  | 'chart-bar'
  | 'chart-pie'
  | 'recent-users'
  | 'notifications'
  | 'tasks'
  | 'calendar'
  | 'quick-actions'

export interface GridLayout {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  static?: boolean
}

export interface DashboardLayout {
  [breakpoint: string]: GridLayout[]
}

export interface DashboardNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
}
