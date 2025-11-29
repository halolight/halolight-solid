import { Title } from '@solidjs/meta'
import { A } from '@solidjs/router'

export default function NotFound() {
  return (
    <>
      <Title>404 - 页面未找到</Title>

      <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div class="max-w-md w-full text-center">
          {/* 404 图标 */}
          <div class="mb-8">
            <div class="text-9xl font-bold text-gray-200 dark:text-gray-800">404</div>
          </div>

          {/* 错误信息 */}
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">页面未找到</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-8">抱歉，您访问的页面不存在或已被移除。</p>

          {/* 操作按钮 */}
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <A
              href="/"
              class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              返回首页
            </A>
            <button
              onClick={() => window.history.back()}
              class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回上页
            </button>
          </div>

          {/* 帮助链接 */}
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">需要帮助？</p>
            <div class="flex justify-center space-x-6">
              <a href="/docs" class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
                帮助文档
              </a>
              <a href="mailto:support@example.com" class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
                联系支持
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
