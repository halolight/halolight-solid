import { A } from '@solidjs/router'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row items-center justify-between">
          {/* 版权信息 */}
          <div class="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} <span class="font-medium text-gray-900 dark:text-white">HaloLight</span>. All rights
            reserved.
          </div>

          {/* 链接 */}
          <div class="mt-4 sm:mt-0 flex items-center space-x-6">
            <a
              href="https://halolight.docs.h7ml.cn"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              在线文档
            </a>
            <a
              href="https://github.com/halolight/halolight-solid"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span class="text-sm text-gray-400 dark:text-gray-500">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
