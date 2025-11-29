import { createSignal, createEffect, For, Show } from 'solid-js'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui'
import { dashboardService } from '~/services/dashboard'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  status: 'active' | 'inactive'
}

export default function RecentUsersWidget() {
  const [users, setUsers] = createSignal<User[]>([])
  const [isLoading, setIsLoading] = createSignal(true)

  createEffect(() => {
    loadRecentUsers()
  })

  const loadRecentUsers = async () => {
    setIsLoading(true)
    try {
      const response = await dashboardService.getRecentUsers(5)
      setUsers(response.data)
    } catch (error) {
      console.error('Failed to load recent users:', error)
      // 使用模拟数据
      setUsers([
        {
          id: '1',
          name: '张三',
          email: 'zhang@example.com',
          avatar: 'https://ui-avatars.com/api/?name=张三&background=random',
          createdAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: '2',
          name: '李四',
          email: 'li@example.com',
          avatar: 'https://ui-avatars.com/api/?name=李四&background=random',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: 'active',
        },
        {
          id: '3',
          name: '王五',
          email: 'wang@example.com',
          avatar: 'https://ui-avatars.com/api/?name=王五&background=random',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          status: 'inactive',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近用户</CardTitle>
      </CardHeader>
      <CardContent>
        <Show
          when={!isLoading()}
          fallback={
            <div class="space-y-3">
              {[1, 2, 3].map(() => (
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <div class="space-y-4">
            <For each={users()}>
              {(user) => (
                <div class="flex items-center space-x-3">
                  <img
                    class="w-10 h-10 rounded-full"
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                    }
                    alt={user.name}
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  <div class="flex flex-col items-end space-y-1">
                    <span
                      class={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}
                    >
                      {user.status === 'active' ? '活跃' : '未激活'}
                    </span>
                    <p class="text-xs text-gray-400">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </CardContent>
    </Card>
  )
}
