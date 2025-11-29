// @refresh reload
import { mount, StartClient } from '@solidjs/start/client'

// 初始化 Mock 数据（仅在开发环境）
if (import.meta.env.DEV) {
  import('~/mocks')
}

const appElement = document.getElementById('app')
if (appElement) {
  mount(() => <StartClient />, appElement)
}

export default StartClient
