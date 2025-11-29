import { createSignal } from 'solid-js'
import { Title } from '@solidjs/meta'

export default function Home() {
  const [count, setCount] = createSignal(0)

  return (
    <main class="min-h-screen flex flex-col items-center justify-center p-8">
      <Title>Halolight Solid</Title>
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Halolight Solid</h1>
          <p class="text-gray-600 dark:text-gray-400">基于 Solid.js + SolidStart 的现代化中文后台管理系统</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Signal 响应式示例</h2>
          <div class="flex items-center justify-center gap-4">
            <button
              class="w-10 h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-xl font-bold transition"
              onClick={() => setCount(count() - 1)}
            >
              -
            </button>
            <span class="text-2xl font-bold text-gray-900 dark:text-white min-w-[3ch] text-center">{count()}</span>
            <button
              class="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xl font-bold transition"
              onClick={() => setCount(count() + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <a
            href="/dashboard"
            class="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg transition"
          >
            进入后台
          </a>
          <a
            href="https:/docs.solidjs.com"
            target="_blank"
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center py-3 px-4 rounded-lg transition"
          >
            Solid 文档
          </a>
        </div>
      </div>
    </main>
  )
}
