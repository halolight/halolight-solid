import { createSignal, createEffect, For, Show } from 'solid-js'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, Textarea } from '~/components/ui'

interface SettingSection {
  id: string
  title: string
  description: string
  icon: string
}

const settingSections: SettingSection[] = [
  { id: 'general', title: '基本设置', description: '管理网站基本信息和显示设置', icon: '⚙️' },
  { id: 'appearance', title: '外观设置', description: '自定义主题和界面显示', icon: '🎨' },
  { id: 'notifications', title: '通知设置', description: '管理通知偏好和提醒方式', icon: '🔔' },
  { id: 'privacy', title: '隐私设置', description: '管理数据和隐私选项', icon: '🔒' },
  { id: 'integrations', title: '集成设置', description: '管理第三方服务集成', icon: '🔗' },
]

export default function SettingsPage() {
  const [loading, setLoading] = createSignal(true)
  const [activeSection, setActiveSection] = createSignal('general')
  const [saving, setSaving] = createSignal(false)

  // 设置状态
  const [siteName, setSiteName] = createSignal('HaloLight')
  const [siteDescription, setSiteDescription] = createSignal('现代化后台管理系统')
  const [language, setLanguage] = createSignal('zh-CN')
  const [timezone, setTimezone] = createSignal('Asia/Shanghai')
  const [theme, setTheme] = createSignal(uiStore.theme)
  const [emailNotifications, setEmailNotifications] = createSignal(true)
  const [pushNotifications, setPushNotifications] = createSignal(true)
  const [weeklyReport, setWeeklyReport] = createSignal(false)

  createEffect(() => {
    uiActions.setPageTitle('系统设置')
    uiActions.setBreadcrumbs([{ label: '系统设置', href: '/settings' }])
  })

  createEffect(() => {
    setTimeout(() => setLoading(false), 500)
  })

  const handleSave = async () => {
    setSaving(true)
    // 模拟保存
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    uiActions.addNotification({
      type: 'success',
      title: '保存成功',
      message: '设置已更新',
    })
  }

  return (
    <>
      <Title>系统设置 - HaloLight</Title>

      <div class="space-y-6">
        {/* 页面头部 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">系统设置</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">管理系统配置和偏好设置</p>
          </div>
          <Button variant="primary" onClick={handleSave} disabled={saving()}>
            {saving() ? '保存中...' : '保存设置'}
          </Button>
        </div>

        <Show
          when={!loading()}
          fallback={
            <div class="flex items-center justify-center h-64">
              <div class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          }
        >
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 侧边导航 */}
            <div class="lg:col-span-1">
              <Card>
                <CardContent class="p-2">
                  <nav class="space-y-1">
                    <For each={settingSections}>
                      {(section) => (
                        <button
                          onClick={() => setActiveSection(section.id)}
                          class={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                            activeSection() === section.id
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span class="mr-3">{section.icon}</span>
                          <div class="text-left">
                            <div class="font-medium">{section.title}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">{section.description}</div>
                          </div>
                        </button>
                      )}
                    </For>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* 设置内容 */}
            <div class="lg:col-span-3 space-y-6">
              {/* 基本设置 */}
              <Show when={activeSection() === 'general'}>
                <Card>
                  <CardHeader>
                    <CardTitle>基本设置</CardTitle>
                  </CardHeader>
                  <CardContent class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">网站名称</label>
                        <Input
                          value={siteName()}
                          onInput={(e) => setSiteName(e.currentTarget.value)}
                          placeholder="请输入网站名称"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">语言</label>
                        <select
                          value={language()}
                          onChange={(e) => setLanguage(e.currentTarget.value)}
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="zh-CN">简体中文</option>
                          <option value="zh-TW">繁體中文</option>
                          <option value="en-US">English</option>
                          <option value="ja-JP">日本語</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">网站描述</label>
                      <Textarea
                        value={siteDescription()}
                        onInput={(e) => setSiteDescription(e.currentTarget.value)}
                        placeholder="请输入网站描述"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">时区</label>
                      <select
                        value={timezone()}
                        onChange={(e) => setTimezone(e.currentTarget.value)}
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Asia/Shanghai">中国标准时间 (UTC+8)</option>
                        <option value="Asia/Tokyo">日本标准时间 (UTC+9)</option>
                        <option value="America/New_York">美国东部时间 (UTC-5)</option>
                        <option value="Europe/London">格林威治时间 (UTC+0)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </Show>

              {/* 外观设置 */}
              <Show when={activeSection() === 'appearance'}>
                <Card>
                  <CardHeader>
                    <CardTitle>外观设置</CardTitle>
                  </CardHeader>
                  <CardContent class="space-y-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">主题模式</label>
                      <div class="grid grid-cols-3 gap-4">
                        <button
                          onClick={() => {
                            setTheme('light')
                            uiActions.setTheme('light')
                          }}
                          class={`p-4 rounded-lg border-2 transition-all ${
                            theme() === 'light'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div class="w-full h-20 bg-white border border-gray-200 rounded-md mb-2"></div>
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">浅色</span>
                        </button>
                        <button
                          onClick={() => {
                            setTheme('dark')
                            uiActions.setTheme('dark')
                          }}
                          class={`p-4 rounded-lg border-2 transition-all ${
                            theme() === 'dark'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div class="w-full h-20 bg-gray-800 border border-gray-700 rounded-md mb-2"></div>
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">深色</span>
                        </button>
                        <button
                          onClick={() => {
                            setTheme('system')
                            uiActions.setTheme('system')
                          }}
                          class={`p-4 rounded-lg border-2 transition-all ${
                            theme() === 'system'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div class="w-full h-20 bg-gradient-to-r from-white to-gray-800 border border-gray-300 rounded-md mb-2"></div>
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">跟随系统</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Show>

              {/* 通知设置 */}
              <Show when={activeSection() === 'notifications'}>
                <Card>
                  <CardHeader>
                    <CardTitle>通知设置</CardTitle>
                  </CardHeader>
                  <CardContent class="space-y-6">
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 dark:text-white">邮件通知</h4>
                          <p class="text-sm text-gray-500 dark:text-gray-400">接收重要更新的邮件通知</p>
                        </div>
                        <button
                          onClick={() => setEmailNotifications(!emailNotifications())}
                          class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            emailNotifications() ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              emailNotifications() ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 dark:text-white">推送通知</h4>
                          <p class="text-sm text-gray-500 dark:text-gray-400">在浏览器中接收推送通知</p>
                        </div>
                        <button
                          onClick={() => setPushNotifications(!pushNotifications())}
                          class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            pushNotifications() ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              pushNotifications() ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 dark:text-white">周报邮件</h4>
                          <p class="text-sm text-gray-500 dark:text-gray-400">每周接收活动汇总报告</p>
                        </div>
                        <button
                          onClick={() => setWeeklyReport(!weeklyReport())}
                          class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            weeklyReport() ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              weeklyReport() ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Show>

              {/* 隐私设置 */}
              <Show when={activeSection() === 'privacy'}>
                <Card>
                  <CardHeader>
                    <CardTitle>隐私设置</CardTitle>
                  </CardHeader>
                  <CardContent class="space-y-6">
                    <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-400">数据管理</h4>
                      <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                        您可以导出或删除您的账户数据。请注意，删除数据后将无法恢复。
                      </p>
                    </div>
                    <div class="flex space-x-4">
                      <Button variant="secondary">导出数据</Button>
                      <Button variant="ghost" class="text-red-600 hover:text-red-700">
                        删除账户
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Show>

              {/* 集成设置 */}
              <Show when={activeSection() === 'integrations'}>
                <Card>
                  <CardHeader>
                    <CardTitle>第三方集成</CardTitle>
                  </CardHeader>
                  <CardContent class="space-y-4">
                    <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4">
                          <span class="text-xl">📧</span>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 dark:text-white">邮件服务</h4>
                          <p class="text-xs text-gray-500 dark:text-gray-400">配置 SMTP 邮件发送服务</p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">
                        配置
                      </Button>
                    </div>
                    <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4">
                          <span class="text-xl">☁️</span>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 dark:text-white">云存储</h4>
                          <p class="text-xs text-gray-500 dark:text-gray-400">配置文件存储服务</p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">
                        配置
                      </Button>
                    </div>
                    <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4">
                          <span class="text-xl">🔐</span>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 dark:text-white">OAuth 登录</h4>
                          <p class="text-xs text-gray-500 dark:text-gray-400">配置第三方登录服务</p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">
                        配置
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </>
  )
}
