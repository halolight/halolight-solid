import { createSignal, createEffect, For, Show } from 'solid-js'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui'

// 模拟数据
const mockVisitData = [
  { date: '2024-11-24', visits: 1200, uniqueVisitors: 890, pageViews: 3200 },
  { date: '2024-11-25', visits: 1450, uniqueVisitors: 1020, pageViews: 4100 },
  { date: '2024-11-26', visits: 1380, uniqueVisitors: 950, pageViews: 3800 },
  { date: '2024-11-27', visits: 1680, uniqueVisitors: 1200, pageViews: 4800 },
  { date: '2024-11-28', visits: 1520, uniqueVisitors: 1100, pageViews: 4200 },
  { date: '2024-11-29', visits: 1890, uniqueVisitors: 1350, pageViews: 5100 },
  { date: '2024-11-30', visits: 2100, uniqueVisitors: 1500, pageViews: 5800 },
]

const mockSalesData = [
  { month: '7月', sales: 45000, profit: 12000 },
  { month: '8月', sales: 52000, profit: 15000 },
  { month: '9月', sales: 48000, profit: 13500 },
  { month: '10月', sales: 61000, profit: 18000 },
  { month: '11月', sales: 58000, profit: 16500 },
]

const mockTopProducts = [
  { name: '产品 A', sales: 1250, revenue: 125000 },
  { name: '产品 B', sales: 980, revenue: 98000 },
  { name: '产品 C', sales: 850, revenue: 85000 },
  { name: '产品 D', sales: 720, revenue: 72000 },
  { name: '产品 E', sales: 650, revenue: 65000 },
]

export default function AnalyticsPage() {
  const [loading, setLoading] = createSignal(true)
  const [dateRange, setDateRange] = createSignal('7d')

  createEffect(() => {
    uiActions.setPageTitle('数据分析')
    uiActions.setBreadcrumbs([{ label: '数据分析', href: '/analytics' }])
  })

  createEffect(() => {
    // 模拟加载数据
    setTimeout(() => setLoading(false), 500)
  })

  const stats = [
    { label: '总访问量', value: '12,847', change: '+12.5%', positive: true },
    { label: '独立访客', value: '8,234', change: '+8.2%', positive: true },
    { label: '页面浏览', value: '45,892', change: '+15.3%', positive: true },
    { label: '跳出率', value: '32.4%', change: '-2.1%', positive: true },
  ]

  return (
    <>
      <Title>数据分析 - HaloLight</Title>

      <div class="space-y-6">
        {/* 页面头部 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">数据分析</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">查看网站访问和业务数据分析</p>
          </div>
          <div class="mt-4 sm:mt-0">
            <select
              value={dateRange()}
              onChange={(e) => setDateRange(e.currentTarget.value)}
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">最近 7 天</option>
              <option value="30d">最近 30 天</option>
              <option value="90d">最近 90 天</option>
              <option value="1y">最近 1 年</option>
            </select>
          </div>
        </div>

        <Show
          when={!loading()}
          fallback={
            <div class="flex items-center justify-center h-64">
              <div class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          }
        >
          {/* 统计概览 */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <For each={stats}>
              {(stat) => (
                <Card>
                  <CardContent class="p-6">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <span class={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </CardContent>
                </Card>
              )}
            </For>
          </div>

          {/* 访问趋势 */}
          <Card>
            <CardHeader>
              <CardTitle>访问趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        日期
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        访问量
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        独立访客
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        页面浏览
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <For each={mockVisitData}>
                      {(item) => (
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.date}</td>
                          <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                            {item.visits.toLocaleString()}
                          </td>
                          <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                            {item.uniqueVisitors.toLocaleString()}
                          </td>
                          <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                            {item.pageViews.toLocaleString()}
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 销售数据 */}
            <Card>
              <CardHeader>
                <CardTitle>月度销售</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <For each={mockSalesData}>
                    {(item) => (
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">{item.month}</span>
                        <div class="flex-1 mx-4">
                          <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              class="h-full bg-blue-600 rounded-full"
                              style={{ width: `${(item.sales / 70000) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                          ¥{item.sales.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </CardContent>
            </Card>

            {/* 热门产品 */}
            <Card>
              <CardHeader>
                <CardTitle>热门产品</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <For each={mockTopProducts}>
                    {(product, index) => (
                      <div class="flex items-center">
                        <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                          {index() + 1}
                        </span>
                        <div class="ml-3 flex-1">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{product.sales} 销量</p>
                        </div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                          ¥{product.revenue.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </CardContent>
            </Card>
          </div>
        </Show>
      </div>
    </>
  )
}
