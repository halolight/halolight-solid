import { createSignal, Show, For } from 'solid-js'
import { A, useNavigate } from '@solidjs/router'
import { authStore, actions as authActions } from '~/stores/auth'
import { uiStore, actions as uiActions } from '~/stores/ui'

export default function Header() {
  const navigate = useNavigate()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = createSignal(false)

  const toggleSidebar = () => {
    uiActions.toggleSidebar()
  }

  const toggleTheme = () => {
    uiActions.toggleTheme()
  }

  const handleLogout = () => {
    authActions.logout()
    navigate('/login')
  }

  return (
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* 左侧：汉堡菜单和标题 */}
        <div class="flex items-center">
          <button
            type="button"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={toggleSidebar}
          >
            <span class="sr-only">打开侧边栏</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="ml-4">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{uiStore.pageTitle || 'HaloLight'}</h1>
          </div>
        </div>

        {/* 右侧：主题切换和用户菜单 */}
        <div class="flex items-center space-x-4">
          {/* 主题切换 */}
          <button
            type="button"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={toggleTheme}
          >
            <span class="sr-only">切换主题</span>
            <Show
              when={uiStore.theme === 'dark'}
              fallback={
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </Show>
          </button>

          {/* 用户菜单 */}
          <div class="relative ml-3">
            <div>
              <button
                type="button"
                class="flex items-center max-w-xs bg-white dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id="user-menu"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen())}
              >
                <span class="sr-only">打开用户菜单</span>
                <img
                  class="h-8 w-8 rounded-full"
                  src={
                    authStore.user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user?.name || 'User')}&background=random`
                  }
                  alt="用户头像"
                />
              </button>
            </div>

            <Show when={isProfileMenuOpen()}>
              <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div class="py-1" role="none">
                  <A
                    href="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    个人资料
                  </A>
                  <A
                    href="/settings"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    账户设置
                  </A>
                  <button
                    type="button"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>

      {/* 面包屑导航 */}
      <Show when={uiStore.breadcrumbs.length > 0}>
        <nav class="px-4 sm:px-6 lg:px-8 py-2 border-t border-gray-200 dark:border-gray-700" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2 text-sm">
            <li>
              <A href="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <svg class="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span class="sr-only">首页</span>
              </A>
            </li>

            <For each={uiStore.breadcrumbs}>
              {(item, index) => (
                <li class="flex items-center">
                  <svg class="h-4 w-4 flex-shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L11.586 9 7.293 4.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <Show
                    when={item.href && index() < uiStore.breadcrumbs.length - 1}
                    fallback={<span class="ml-2 text-gray-500 dark:text-gray-400">{item.label}</span>}
                  >
                    <A
                      href={item.href}
                      class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      {item.label}
                    </A>
                  </Show>
                </li>
              )}
            </For>
          </ol>
        </nav>
      </Show>
    </header>
  )
}
