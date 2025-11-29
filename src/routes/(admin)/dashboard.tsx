import { createEffect, For, Show, createSignal } from 'solid-js'
import { Title } from '@solidjs/meta'
import { dashboardStore, actions as dashboardActions } from '~/stores/dashboard'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { authStore } from '~/stores/auth'

// 仪表盘组件
import StatsWidget from '~/components/dashboard/StatsWidget'
import ChartWidget from '~/components/dashboard/ChartWidget'
import RecentUsersWidget from '~/components/dashboard/RecentUsersWidget'
import NotificationsWidget from '~/components/dashboard/NotificationsWidget'
import QuickActionsWidget from '~/components/dashboard/QuickActionsWidget'

export default function Dashboard() {
  const [isLoading, setIsLoading] = createSignal(true)

  // 设置页面信息
  createEffect(() => {
    uiActions.setPageTitle('仪表盘')
    uiActions.setBreadcrumbs([{ label: '仪表盘', href: '/dashboard' }])
  })

  // 加载仪表盘数据
  createEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([dashboardActions.fetchStats(), dashboardActions.fetchWidgets()])
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  })

  // 欢迎消息
  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    const userName = authStore.user?.name || '用户'

    if (hour < 12) {
      return `早上好，${userName}！`
    } else if (hour < 18) {
      return `下午好，${userName}！`
    } else {
      return `晚上好，${userName}！`
    }
  }

  return (
    <>
      <Title>仪表盘 - HaloLight</Title>

      {/* 页面标题 */}
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{getWelcomeMessage()}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">欢迎回到HaloLight后台管理系统</p>
      </div>

      <Show
        when={isLoading()}
        fallback={
          <>
            {/* 仪表盘内容 */}
            <div class="space-y-6">
              {/* 统计卡片 */}
              <Show when={dashboardStore.stats}>
                {(stats) => (
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsWidget title="总用户数" value={stats().totalUsers} change={stats().userGrowth} icon="users" />
                    <StatsWidget
                      title="活跃用户"
                      value={stats().activeUsers}
                      change={stats().userGrowth}
                      icon="active-users"
                    />
                    <StatsWidget
                      title="总收入"
                      value={`¥${stats().totalRevenue.toLocaleString()}`}
                      change={stats().revenueGrowth}
                      icon="revenue"
                    />
                    <StatsWidget
                      title="转化率"
                      value={`${stats().conversionRate}%`}
                      change={stats().rateGrowth}
                      icon="conversion"
                    />
                  </div>
                )}
              </Show>

              {/* 图表区域 */}
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWidget
                  title="用户增长趋势"
                  type="line"
                  data={[
                    { label: '1月', value: 1200 },
                    { label: '2月', value: 1900 },
                    { label: '3月', value: 3000 },
                    { label: '4月', value: 5000 },
                    { label: '5月', value: 4200 },
                    { label: '6月', value: 3800 },
                  ]}
                />

                <ChartWidget
                  title="收入来源分布"
                  type="pie"
                  data={[
                    { label: '订阅', value: 45, color: '#3B82F6' },
                    { label: '广告', value: 30, color: '#10B981' },
                    { label: '商品', value: 15, color: '#F59E0B' },
                    { label: '其他', value: 10, color: '#6B7280' },
                  ]}
                />
              </div>

              {/* 其他组件 */}
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RecentUsersWidget />
                <NotificationsWidget />
                <QuickActionsWidget />
              </div>
            </div>
          </>
        }
      >
        {/* 加载状态 */}
        <div class="flex items-center justify-center h-64">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
              <svg class="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <p class="text-gray-600 dark:text-gray-400">正在加载仪表盘数据...</p>
          </div>
        </div>
      </Show>
    </>
  )
}
