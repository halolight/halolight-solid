import { createSignal, createEffect, For, Show } from 'solid-js'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { Button, Card, CardContent, CardHeader, CardTitle } from '~/components/ui'
import type { Notification, NotificationType } from '~/types/notification'

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'system',
    title: '系统维护通知',
    content: '系统将于今晚 22:00 - 24:00 进行例行维护，届时部分功能可能无法使用。',
    read: false,
    priority: 'high',
    createdAt: '2024-11-30T09:00:00Z',
  },
  {
    id: '2',
    type: 'user',
    title: '新用户注册',
    content: '用户 王五 已完成注册，等待审核。',
    read: false,
    createdAt: '2024-11-30T08:30:00Z',
    sender: { id: '3', name: '王五', avatar: 'https://ui-avatars.com/api/?name=王五' },
    link: '/users/3',
  },
  {
    id: '3',
    type: 'task',
    title: '任务完成提醒',
    content: '您负责的任务「产品文档更新」已被标记为完成。',
    read: false,
    createdAt: '2024-11-30T07:45:00Z',
    link: '/tasks/1',
  },
  {
    id: '4',
    type: 'message',
    title: '新消息',
    content: '张三 给您发送了一条消息：「项目进度如何？」',
    read: true,
    createdAt: '2024-11-29T18:20:00Z',
    sender: { id: '1', name: '张三', avatar: 'https://ui-avatars.com/api/?name=张三' },
    link: '/messages',
  },
  {
    id: '5',
    type: 'alert',
    title: '存储空间警告',
    content: '您的存储空间已使用 85%，请及时清理或升级套餐。',
    read: true,
    priority: 'urgent',
    createdAt: '2024-11-29T15:00:00Z',
    link: '/settings/storage',
  },
  {
    id: '6',
    type: 'system',
    title: '版本更新',
    content: '系统已更新到 v2.5.0 版本，新增多项功能优化。',
    read: true,
    createdAt: '2024-11-28T10:00:00Z',
  },
]

const typeConfig: Record<NotificationType, { icon: string; color: string; bgColor: string }> = {
  system: { icon: '⚙️', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  user: { icon: '👤', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  message: { icon: '💬', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  task: { icon: '✅', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  alert: { icon: '⚠️', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = createSignal<Notification[]>(mockNotifications)
  const [loading, setLoading] = createSignal(true)
  const [filter, setFilter] = createSignal<NotificationType | 'all'>('all')

  createEffect(() => {
    uiActions.setPageTitle('通知中心')
    uiActions.setBreadcrumbs([{ label: '通知中心', href: '/notifications' }])
  })

  createEffect(() => {
    setTimeout(() => setLoading(false), 500)
  })

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes} 分钟前`
    if (hours < 24) return `${hours} 小时前`
    if (days < 7) return `${days} 天前`
    return date.toLocaleDateString('zh-CN')
  }

  const filteredNotifications = () => {
    if (filter() === 'all') return notifications()
    return notifications().filter((n) => n.type === filter())
  }

  const unreadCount = () => notifications().filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <>
      <Title>通知中心 - HaloLight</Title>

      <div class="space-y-6">
        {/* 页面头部 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">通知中心</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              查看和管理您的所有通知
              <Show when={unreadCount() > 0}>
                <span class="ml-2 px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                  {unreadCount()} 未读
                </span>
              </Show>
            </p>
          </div>
          <div class="mt-4 sm:mt-0 flex gap-2">
            <Button variant="secondary" onClick={markAllAsRead} disabled={unreadCount() === 0}>
              全部已读
            </Button>
            <Button variant="ghost" onClick={clearAll} disabled={notifications().length === 0}>
              清空全部
            </Button>
          </div>
        </div>

        {/* 筛选标签 */}
        <div class="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            class={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter() === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            全部
          </button>
          <For each={Object.entries(typeConfig)}>
            {([type, config]) => (
              <button
                onClick={() => setFilter(type as NotificationType)}
                class={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  filter() === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{config.icon}</span>
                <span>
                  {type === 'system' && '系统'}
                  {type === 'user' && '用户'}
                  {type === 'message' && '消息'}
                  {type === 'task' && '任务'}
                  {type === 'alert' && '警告'}
                </span>
              </button>
            )}
          </For>
        </div>

        <Show
          when={!loading()}
          fallback={
            <div class="flex items-center justify-center h-64">
              <div class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          }
        >
          {/* 通知列表 */}
          <div class="space-y-3">
            <Show
              when={filteredNotifications().length > 0}
              fallback={
                <Card>
                  <CardContent class="p-12 text-center">
                    <div class="text-4xl mb-4">🔔</div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无通知</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">您的通知将会显示在这里</p>
                  </CardContent>
                </Card>
              }
            >
              <For each={filteredNotifications()}>
                {(notification) => {
                  const config = typeConfig[notification.type]
                  return (
                    <Card class={`transition-all ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}>
                      <CardContent class="p-4">
                        <div class="flex items-start">
                          {/* 图标 */}
                          <div
                            class={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}
                          >
                            <span class="text-lg">{config.icon}</span>
                          </div>

                          {/* 内容 */}
                          <div class="ml-4 flex-1 min-w-0">
                            <div class="flex items-start justify-between">
                              <div>
                                <h4
                                  class={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
                                >
                                  {notification.title}
                                  <Show when={notification.priority === 'urgent'}>
                                    <span class="ml-2 px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded">
                                      紧急
                                    </span>
                                  </Show>
                                  <Show when={notification.priority === 'high'}>
                                    <span class="ml-2 px-1.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded">
                                      重要
                                    </span>
                                  </Show>
                                </h4>
                                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{notification.content}</p>
                                <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                  <span>{formatTime(notification.createdAt)}</span>
                                  <Show when={notification.sender}>
                                    <span class="flex items-center">
                                      <img class="w-4 h-4 rounded-full mr-1" src={notification.sender!.avatar} alt="" />
                                      {notification.sender!.name}
                                    </span>
                                  </Show>
                                </div>
                              </div>

                              {/* 操作按钮 */}
                              <div class="flex items-center space-x-2 ml-4">
                                <Show when={!notification.read}>
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                    title="标为已读"
                                  >
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </button>
                                </Show>
                                <Show when={notification.link}>
                                  <a
                                    href={notification.link}
                                    class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                    title="查看详情"
                                  >
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </a>
                                </Show>
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                  title="删除"
                                >
                                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                }}
              </For>
            </Show>
          </div>
        </Show>
      </div>
    </>
  )
}
