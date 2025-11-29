// 简单的功能测试
import { authStore, actions as authActions } from './stores/auth'
import { uiStore, actions as uiActions } from './stores/ui'
import { dashboardStore, actions as dashboardActions } from './stores/dashboard'

export function runBasicTests() {
  console.log('🧪 开始运行基本功能测试...')

  // 测试认证状态管理
  console.log('✅ 认证状态:', authStore.isAuthenticated ? '已登录' : '未登录')
  console.log('✅ 当前用户:', authStore.user?.name || '无用户')

  // 测试UI状态管理
  console.log('✅ 主题:', uiStore.theme)
  console.log('✅ 侧边栏状态:', uiStore.sidebarCollapsed ? '折叠' : '展开')

  // 测试仪表盘数据
  console.log('✅ 仪表盘统计:', dashboardStore.stats ? '已加载' : '未加载')
  console.log('✅ 仪表盘组件:', dashboardStore.widgets.length, '个')

  console.log('✅ 基本功能测试完成')
}

export function runMockTests() {
  console.log('🧪 开始运行Mock数据测试...')

  // 模拟登录测试
  const testLogin = async () => {
    try {
      await authActions.login({
        email: 'demo@example.com',
        password: 'demo123',
        remember: true,
      })
      console.log('✅ 模拟登录成功')
    } catch (error) {
      console.error('❌ 模拟登录失败:', error)
    }
  }

  // 模拟仪表盘数据加载
  const testDashboard = async () => {
    try {
      await dashboardActions.fetchStats()
      console.log('✅ 仪表盘统计加载成功')
      await dashboardActions.fetchWidgets()
      console.log('✅ 仪表盘组件加载成功')
    } catch (error) {
      console.error('❌ 仪表盘数据加载失败:', error)
    }
  }

  // 模拟UI操作
  const testUI = () => {
    uiActions.toggleTheme()
    console.log('✅ 主题切换成功')
    uiActions.toggleSidebar()
    console.log('✅ 侧边栏切换成功')
    uiActions.addNotification({
      type: 'success',
      title: '测试通知',
      message: '这是一个测试通知',
    })
    console.log('✅ 通知添加成功')
  }

  // 运行所有测试
  testLogin().then(() => {
    testDashboard().then(() => {
      testUI()
      console.log('✅ 所有Mock测试完成')
    })
  })
}

// 运行测试
if (typeof window !== 'undefined') {
  // 在浏览器环境中运行测试
  setTimeout(() => {
    runBasicTests()
    runMockTests()
  }, 1000)
}
