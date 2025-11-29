import { createSignal, createEffect, Show } from 'solid-js'
import { Title } from '@solidjs/meta'
import { authStore, actions as authActions } from '~/stores/auth'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '~/components/ui'

export default function ProfilePage() {
  const [loading, setLoading] = createSignal(true)
  const [saving, setSaving] = createSignal(false)
  const [activeTab, setActiveTab] = createSignal<'profile' | 'security' | 'activity'>('profile')

  // 用户信息
  const [name, setName] = createSignal(authStore.user?.name || '')
  const [email, setEmail] = createSignal(authStore.user?.email || '')
  const [phone, setPhone] = createSignal(authStore.user?.phone || '')
  const [department, setDepartment] = createSignal(authStore.user?.department || '')
  const [position, setPosition] = createSignal(authStore.user?.position || '')
  const [bio, setBio] = createSignal(authStore.user?.bio || '')

  // 密码修改
  const [currentPassword, setCurrentPassword] = createSignal('')
  const [newPassword, setNewPassword] = createSignal('')
  const [confirmPassword, setConfirmPassword] = createSignal('')

  createEffect(() => {
    uiActions.setPageTitle('个人资料')
    uiActions.setBreadcrumbs([{ label: '个人资料', href: '/profile' }])
  })

  createEffect(() => {
    setTimeout(() => setLoading(false), 500)
  })

  const handleSaveProfile = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    uiActions.addNotification({
      type: 'success',
      title: '保存成功',
      message: '个人资料已更新',
    })
  }

  const handleChangePassword = async () => {
    if (newPassword() !== confirmPassword()) {
      uiActions.addNotification({
        type: 'error',
        title: '密码不匹配',
        message: '两次输入的密码不一致',
      })
      return
    }

    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    uiActions.addNotification({
      type: 'success',
      title: '密码已更新',
      message: '请使用新密码重新登录',
    })
  }

  // 模拟活动记录
  const activities = [
    { id: '1', action: '登录系统', time: '2024-11-30 10:30:00', ip: '192.168.1.1', device: 'Chrome / macOS' },
    { id: '2', action: '修改个人资料', time: '2024-11-29 15:45:00', ip: '192.168.1.1', device: 'Chrome / macOS' },
    { id: '3', action: '登录系统', time: '2024-11-29 09:00:00', ip: '192.168.1.1', device: 'Safari / iPhone' },
    { id: '4', action: '修改密码', time: '2024-11-28 14:20:00', ip: '192.168.1.100', device: 'Firefox / Windows' },
    { id: '5', action: '登录系统', time: '2024-11-28 09:15:00', ip: '192.168.1.100', device: 'Firefox / Windows' },
  ]

  return (
    <>
      <Title>个人资料 - HaloLight</Title>

      <div class="space-y-6">
        {/* 页面头部 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">个人资料</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">管理您的账户信息和安全设置</p>
          </div>
        </div>

        <Show
          when={!loading()}
          fallback={
            <div class="flex items-center justify-center h-64">
              <div class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          }
        >
          {/* 用户卡片 */}
          <Card>
            <CardContent class="p-6">
              <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div class="relative">
                  <img
                    class="w-24 h-24 rounded-full"
                    src={
                      authStore.user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user?.name || 'User')}&size=96&background=3B82F6&color=fff`
                    }
                    alt={authStore.user?.name}
                  />
                  <button class="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div class="text-center sm:text-left">
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">{authStore.user?.name}</h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{authStore.user?.email}</p>
                  <div class="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {authStore.user?.role?.label || '普通用户'}
                    </span>
                    <Show when={authStore.user?.department}>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                        {authStore.user?.department}
                      </span>
                    </Show>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 标签页 */}
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                class={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab() === 'profile'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                基本信息
              </button>
              <button
                onClick={() => setActiveTab('security')}
                class={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab() === 'security'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                安全设置
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                class={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab() === 'activity'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                活动记录
              </button>
            </nav>
          </div>

          {/* 基本信息 */}
          <Show when={activeTab() === 'profile'}>
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">姓名</label>
                    <Input value={name()} onInput={(e) => setName(e.currentTarget.value)} />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">邮箱</label>
                    <Input type="email" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">手机号</label>
                    <Input
                      value={phone()}
                      onInput={(e) => setPhone(e.currentTarget.value)}
                      placeholder="请输入手机号"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">部门</label>
                    <Input
                      value={department()}
                      onInput={(e) => setDepartment(e.currentTarget.value)}
                      placeholder="请输入部门"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">职位</label>
                    <Input
                      value={position()}
                      onInput={(e) => setPosition(e.currentTarget.value)}
                      placeholder="请输入职位"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">个人简介</label>
                  <Textarea
                    value={bio()}
                    onInput={(e) => setBio(e.currentTarget.value)}
                    placeholder="介绍一下自己..."
                    rows={4}
                  />
                </div>
                <div class="flex justify-end">
                  <Button variant="primary" onClick={handleSaveProfile} disabled={saving()}>
                    {saving() ? '保存中...' : '保存修改'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Show>

          {/* 安全设置 */}
          <Show when={activeTab() === 'security'}>
            <Card>
              <CardHeader>
                <CardTitle>修改密码</CardTitle>
              </CardHeader>
              <CardContent class="space-y-6">
                <div class="max-w-md space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">当前密码</label>
                    <Input
                      type="password"
                      value={currentPassword()}
                      onInput={(e) => setCurrentPassword(e.currentTarget.value)}
                      placeholder="请输入当前密码"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">新密码</label>
                    <Input
                      type="password"
                      value={newPassword()}
                      onInput={(e) => setNewPassword(e.currentTarget.value)}
                      placeholder="请输入新密码"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">确认新密码</label>
                    <Input
                      type="password"
                      value={confirmPassword()}
                      onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                      placeholder="请再次输入新密码"
                    />
                  </div>
                </div>
                <div class="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleChangePassword}
                    disabled={saving() || !currentPassword() || !newPassword() || !confirmPassword()}
                  >
                    {saving() ? '修改中...' : '修改密码'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>两步验证</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">启用两步验证</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">使用验证器应用增强账户安全性</p>
                  </div>
                  <Button variant="secondary">设置</Button>
                </div>
              </CardContent>
            </Card>
          </Show>

          {/* 活动记录 */}
          <Show when={activeTab() === 'activity'}>
            <Card>
              <CardHeader>
                <CardTitle>最近活动</CardTitle>
              </CardHeader>
              <CardContent class="p-0">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        操作
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        时间
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        IP 地址
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        设备
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    {activities.map((activity) => (
                      <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {activity.action}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {activity.ip}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {activity.device}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </Show>
        </Show>
      </div>
    </>
  )
}
