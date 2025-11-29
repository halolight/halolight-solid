import { createSignal, createEffect, Show, For } from 'solid-js'
import { useNavigate, useSearchParams, A } from '@solidjs/router'
import { Title, Meta } from '@solidjs/meta'
import { authStore, actions as authActions } from '~/stores/auth'
import { uiStore, actions as uiActions } from '~/stores/ui'
import type { LoginCredentials } from '~/types/auth'
import { AuthShell } from '~/components/auth/AuthShell'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, Input } from '~/components/ui'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = createSignal<LoginCredentials>({
    email: '',
    password: '',
    remember: false,
  })

  const [showPassword, setShowPassword] = createSignal(false)
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [mounted, setMounted] = createSignal(false)

  const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'demo@example.com'
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'demo123'
  const showDemoHint = import.meta.env.VITE_SHOW_DEMO_HINT === 'true'

  // 如果已登录，重定向到仪表盘
  createEffect(() => {
    if (authStore.isAuthenticated) {
      const redirect = searchParams.redirect
      const redirectTo = Array.isArray(redirect) ? redirect[0] : redirect || '/dashboard'
      navigate(redirectTo)
    }
  })

  // 设置页面标题和动画
  createEffect(() => {
    uiActions.setPageTitle('登录')
    setTimeout(() => setMounted(true), 100)
  })

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    if (isSubmitting()) return

    setIsSubmitting(true)
    authActions.clearError()

    try {
      await authActions.login(formData())

      uiActions.addNotification({
        type: 'success',
        title: '登录成功',
        message: '欢迎回来！',
      })

      const redirect = searchParams.redirect
      const redirectTo = Array.isArray(redirect) ? redirect[0] : redirect || '/dashboard'
      navigate(redirectTo)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof LoginCredentials, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (authStore.error) {
      authActions.clearError()
    }
  }

  const fillDemoCredentials = () => {
    setFormData({
      email: demoEmail,
      password: demoPassword,
      remember: true,
    })
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`使用 ${provider} 登录`)
    uiActions.addNotification({
      type: 'info',
      title: '功能开发中',
      message: `${provider} 登录功能即将上线`,
    })
  }

  const features = [
    { icon: '🚀', text: '快速部署，即刻启动' },
    { icon: '📊', text: '实时数据分析与可视化' },
    { icon: '🔒', text: '企业级安全保障' },
    { icon: '⚡', text: '极致性能体验' },
  ]

  const socialProviders = [
    { name: 'github', label: 'GitHub', icon: '🐙' },
    { name: 'google', label: 'Google', icon: '🔍' },
    { name: 'wechat', label: '微信', icon: '💬' },
  ]

  return (
    <>
      <Title>登录 - HaloLight</Title>
      <Meta name="description" content="登录到HaloLight后台管理系统" />

      <AuthShell
        rightPaddingClassName="p-3 sm:p-4 lg:px-10 lg:py-6"
        left={
          <div
            class={`${mounted() ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} transition-all duration-800 delay-400`}
          >
            {/* Logo 和品牌 */}
            <div class="flex items-center gap-3 mb-12 group cursor-pointer">
              <div class="relative h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
                <span class="text-3xl">✨</span>
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <div>
                <h2 class="text-2xl font-bold tracking-tight">Admin Pro</h2>
                <p class="text-xs text-white/60">企业级管理系统</p>
              </div>
            </div>

            {/* 标题 */}
            <h1 class="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              欢迎回来
              <span class="inline-block ml-2 animate-wave">👋</span>
            </h1>
            <p class="text-lg text-white/70 max-w-md leading-relaxed mb-12">
              登录您的账户，开始管理您的业务数据和团队协作，体验高效的工作流程。
            </p>

            {/* 特性列表 */}
            <div class="space-y-4">
              <For each={features}>
                {(item, index) => (
                  <div
                    class={`flex items-center gap-3 group ${mounted() ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'} transition-all duration-600`}
                    style={{ 'transition-delay': `${600 + index() * 100}ms` }}
                  >
                    <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span class="text-white/90">{item.text}</span>
                  </div>
                )}
              </For>
            </div>

            <style>{`
              @keyframes wave {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(20deg); }
                75% { transform: rotate(-20deg); }
              }
              .animate-wave {
                animation: wave 2s ease-in-out infinite;
              }
            `}</style>
          </div>
        }
        right={
          <div
            class={`w-full max-w-md ${mounted() ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-800 delay-200`}
          >
            {/* 移动端 Logo */}
            <div
              class={`mb-5 lg:hidden text-center ${mounted() ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'} transition-all duration-600 delay-300`}
            >
              <div class="inline-flex items-center gap-3 mb-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl">
                <span class="text-2xl">✨</span>
                <span class="text-xl font-bold text-white">Admin Pro</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">欢迎回来，请登录您的账户</p>
            </div>

            <Card class="border border-gray-200/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 overflow-hidden">
              {/* 顶部装饰条 */}
              <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

              <CardHeader class="space-y-1 text-center pb-3 sm:pb-5 pt-4 sm:pt-7">
                <CardTitle class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  登录账户
                </CardTitle>
                <CardDescription class="text-xs sm:text-sm mt-2">输入您的邮箱和密码登录</CardDescription>
              </CardHeader>

              <CardContent class="space-y-3 sm:space-y-4 px-4 sm:px-6">
                {/* 社交登录按钮 */}
                <div class="grid grid-cols-3 gap-2 sm:gap-3">
                  <For each={socialProviders}>
                    {(provider, index) => (
                      <div
                        class={`${mounted() ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} transition-all duration-500`}
                        style={{ 'transition-delay': `${500 + index() * 100}ms` }}
                      >
                        <Button
                          variant="outline"
                          class="w-full h-11 sm:h-12 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
                          onClick={() => handleSocialLogin(provider.name)}
                        >
                          <span class="text-xl group-hover:scale-110 transition-transform">{provider.icon}</span>
                        </Button>
                      </div>
                    )}
                  </For>
                </div>

                {/* 分隔线 */}
                <div class="relative py-3">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400 font-medium">
                      或使用邮箱登录
                    </span>
                  </div>
                </div>

                {/* 登录表单 */}
                <form onSubmit={handleSubmit} class="space-y-3 sm:space-y-4">
                  {/* 错误提示 */}
                  <Show when={authStore.error}>
                    <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs sm:text-sm animate-shake">
                      {authStore.error}
                    </div>
                  </Show>

                  {/* 邮箱输入 */}
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">邮箱地址</label>
                    <div class="relative group">
                      <svg
                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <Input
                        type="email"
                        placeholder="your@email.h7ml.cn"
                        class="pl-10 h-12 text-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl transition-all"
                        value={formData().email}
                        onInput={(e) => handleInputChange('email', e.currentTarget.value)}
                      />
                    </div>
                  </div>

                  {/* 密码输入 */}
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">密码</label>
                    <div class="relative group">
                      <svg
                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <Input
                        type={showPassword() ? 'text' : 'password'}
                        placeholder="••••••••"
                        class="pl-10 pr-10 h-12 text-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl transition-all"
                        value={formData().password}
                        onInput={(e) => handleInputChange('password', e.currentTarget.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword())}
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      >
                        <Show
                          when={showPassword()}
                          fallback={
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          }
                        >
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        </Show>
                      </button>
                    </div>
                  </div>

                  {/* 记住我 & 忘记密码 */}
                  <div class="flex items-center justify-between text-xs sm:text-sm">
                    <label class="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData().remember}
                        onChange={(e) => handleInputChange('remember', e.currentTarget.checked)}
                        class="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span class="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                        记住我
                      </span>
                    </label>
                    <A
                      href="/forgot-password"
                      class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      忘记密码？
                    </A>
                  </div>

                  {/* 测试账号按钮 */}
                  <Show when={demoEmail && demoPassword}>
                    <div class="flex items-center gap-2 py-2">
                      <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={fillDemoCredentials}
                        class="h-7 px-3 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      >
                        <svg class="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        测试账号
                      </Button>
                      <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </Show>

                  {/* 登录按钮 */}
                  <Button
                    type="submit"
                    class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isSubmitting()}
                  >
                    <Show
                      when={isSubmitting()}
                      fallback={
                        <>
                          登录
                          <span class="ml-2 animate-arrow">→</span>
                        </>
                      }
                    >
                      <svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      登录中...
                    </Show>
                  </Button>
                </form>
              </CardContent>

              <CardFooter class="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-5 sm:pb-8 pt-2">
                <div class="relative w-full">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
                  还没有账户？{' '}
                  <A
                    href="/register"
                    class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    立即注册
                  </A>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 text-center leading-relaxed">
                  阅读我们的{' '}
                  <A
                    href="/terms"
                    class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    服务条款
                  </A>{' '}
                  和{' '}
                  <A
                    href="/privacy"
                    class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    隐私政策
                  </A>{' '}
                  了解更多信息。
                </p>
                <Show when={showDemoHint}>
                  <p class="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">
                    测试账号请点击上方"测试账号"按钮自动填充
                  </p>
                </Show>
              </CardFooter>
            </Card>

            <style>{`
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
              }
              .animate-shake {
                animation: shake 0.5s ease-in-out;
              }
              @keyframes arrow {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(4px); }
              }
              .animate-arrow {
                display: inline-block;
                animation: arrow 1.5s ease-in-out infinite;
              }
            `}</style>
          </div>
        }
      />
    </>
  )
}
