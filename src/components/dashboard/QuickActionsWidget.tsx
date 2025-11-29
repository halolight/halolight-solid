import { For, JSX } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: (props: any) => JSX.Element
  href: string
  color: string
}

export default function QuickActionsWidget() {
  const navigate = useNavigate()

  const quickActions: QuickAction[] = [
    {
      id: 'add-user',
      title: '添加用户',
      description: '创建新用户账户',
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      ),
      href: '/users/new',
      color: 'bg-blue-500',
    },
    {
      id: 'view-analytics',
      title: '查看分析',
      description: '查看详细数据分析',
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      href: '/analytics',
      color: 'bg-green-500',
    },
    {
      id: 'system-settings',
      title: '系统设置',
      description: '配置系统参数',
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: '/settings',
      color: 'bg-purple-500',
    },
    {
      id: 'manage-roles',
      title: '角色管理',
      description: '管理用户角色权限',
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      href: '/roles',
      color: 'bg-orange-500',
    },
  ]

  const handleActionClick = (action: QuickAction) => {
    navigate(action.href)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>快捷操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <For each={quickActions}>
            {(action) => (
              <button
                type="button"
                class="flex items-center p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                onClick={() => handleActionClick(action)}
              >
                <div class={`${action.color} p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform`}>
                  <action.icon class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">{action.title}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{action.description}</p>
                </div>
                <svg
                  class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </For>
        </div>
      </CardContent>
    </Card>
  )
}
