import { JSX, Show } from 'solid-js'
import { authStore } from '~/stores/auth'
import { uiStore } from '~/stores/ui'
import Header from '~/components/layout/Header'
import Sidebar from '~/components/layout/Sidebar'

export default function AdminLayout(props: { children: JSX.Element }) {
  // 检查用户是否已登录，如果没有登录则重定向到登录页面
  if (!authStore.isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    }
    return null
  }

  return (
    <>
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 头部 */}
        <Header />

        <div class="flex">
          {/* 侧边栏 */}
          <Sidebar />

          {/* 主内容区域 */}
          <div
            class={`flex-1 flex flex-col ${uiStore.sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-64'} transition-all duration-300`}
          >
            <main class="flex-1 p-4 sm:p-6 lg:p-8">{props.children}</main>
          </div>
        </div>
      </div>
    </>
  )
}
