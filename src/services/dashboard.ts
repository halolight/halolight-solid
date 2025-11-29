import { apiService } from './api'
import type { DashboardStats, Widget, ChartData } from '~/types/dashboard'
import type { ApiResponse } from '~/types/api'

class DashboardService {
  private readonly prefix = '/dashboard'

  /**
   * 获取仪表盘统计数据
   */
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiService.get<DashboardStats>(`${this.prefix}/stats`)
  }

  /**
   * 获取仪表盘组件列表
   */
  async getWidgets(): Promise<ApiResponse<Widget[]>> {
    return apiService.get<Widget[]>(`${this.prefix}/widgets`)
  }

  /**
   * 获取图表数据
   */
  async getChartData(type: string, params?: Record<string, any>): Promise<ApiResponse<ChartData>> {
    return apiService.get<ChartData>(`${this.prefix}/charts/${type}`, params)
  }

  /**
   * 获取用户增长数据
   */
  async getUserGrowth(days: number = 30): Promise<ApiResponse<ChartData>> {
    return this.getChartData('user-growth', { days })
  }

  /**
   * 获取收入趋势数据
   */
  async getRevenueTrend(days: number = 30): Promise<ApiResponse<ChartData>> {
    return this.getChartData('revenue-trend', { days })
  }

  /**
   * 获取订单统计
   */
  async getOrderStats(days: number = 30): Promise<ApiResponse<ChartData>> {
    return this.getChartData('order-stats', { days })
  }

  /**
   * 获取转化率数据
   */
  async getConversionRate(days: number = 30): Promise<ApiResponse<ChartData>> {
    return this.getChartData('conversion-rate', { days })
  }

  /**
   * 获取最近用户
   */
  async getRecentUsers(limit: number = 10): Promise<ApiResponse<any[]>> {
    return apiService.get<any[]>(`${this.prefix}/recent-users`, { limit })
  }

  /**
   * 获取通知列表
   */
  async getNotifications(limit: number = 10): Promise<ApiResponse<any[]>> {
    return apiService.get<any[]>(`${this.prefix}/notifications`, { limit })
  }

  /**
   * 获取待办任务
   */
  async getTasks(status?: 'pending' | 'completed' | 'all'): Promise<ApiResponse<any[]>> {
    return apiService.get<any[]>(`${this.prefix}/tasks`, { status })
  }

  /**
   * 获取快捷操作
   */
  async getQuickActions(): Promise<ApiResponse<any[]>> {
    return apiService.get<any[]>(`${this.prefix}/quick-actions`)
  }

  /**
   * 保存仪表盘布局
   */
  async saveLayout(layout: any): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.prefix}/layout`, layout)
  }

  /**
   * 获取仪表盘布局
   */
  async getLayout(): Promise<ApiResponse<any>> {
    return apiService.get<any>(`${this.prefix}/layout`)
  }

  /**
   * 添加自定义组件
   */
  async addWidget(widget: Partial<Widget>): Promise<ApiResponse<Widget>> {
    return apiService.post<Widget>(`${this.prefix}/widgets`, widget)
  }

  /**
   * 更新组件
   */
  async updateWidget(widgetId: string, widget: Partial<Widget>): Promise<ApiResponse<Widget>> {
    return apiService.put<Widget>(`${this.prefix}/widgets/${widgetId}`, widget)
  }

  /**
   * 删除组件
   */
  async deleteWidget(widgetId: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.prefix}/widgets/${widgetId}`)
  }
}

export const dashboardService = new DashboardService()
