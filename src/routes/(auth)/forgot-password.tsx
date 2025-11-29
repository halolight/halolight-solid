import { createSignal, createEffect, Show, For } from 'solid-js'
import { useNavigate, A } from '@solidjs/router'
import { Title, Meta } from '@solidjs/meta'
import { authStore, actions as authActions } from '~/stores/auth'
import { uiStore, actions as uiActions } from '~/stores/ui'
import type { ForgotPasswordData } from '~/types/auth'
import { AuthShell } from '~/components/auth/AuthShell'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, Input } from '~/components/ui'

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = createSignal('')
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [isSuccess, setIsSuccess] = createSignal(false)
  const [validationError, setValidationError] = createSignal('')
  const [mounted, setMounted] = createSignal(false)

  // 如果已登录，重定向到仪表盘
  createEffect(() => {
    if (authStore.isAuthenticated) {
      navigate('/dashboard')
    }
  })

  // 设置页面标题和动画
  createEffect(() => {
    uiActions.setPageTitle('忘记密码')
    setTimeout(() => setMounted(true), 100)
  })

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setValidationError('请输入邮箱地址')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('请输入有效的邮箱地址')
      return false
    }
    setValidationError('')
    return true
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    if (isSubmitting() || !validateEmail(email())) return

    setIsSubmitting(true)
    authActions.clearError()

    try {
      await authActions.forgotPassword({ email: email() })
      setIsSuccess(true)

      uiActions.addNotification({
        type: 'success',
        title: '邮件发送成功',
        message: '密码重置邮件已发送到您的邮箱',
      })
    } catch (error) {
      console.error('Forgot password failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (authStore.error) {
      authActions.clearError()
    }
    if (validationError()) {
      setValidationError('')
    }
  }

  // 与 Next.js 版本一致的特性列表
  const features = [
    { icon: '📧', text: '输入注册邮箱地址' },
    { icon: '🔗', text: '接收安全重置链接' },
    { icon: '🔐', text: '设置新的安全密码' },
    { icon: '✅', text: '重新登录您的账户' },
  ]

  return (
    <>
      <Title>忘记密码 - HaloLight</Title>
      <Meta name="description" content="重置您的HaloLight账户密码" />

      <AuthShell
        leftGradientClassName="bg-gradient-to-br from-sky-600 via-cyan-600 to-emerald-600"
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

            {/* 标题 - 与 Next.js 版本一致 */}
            <h1 class="text-5xl xl:text-6xl font-bold mb-6 leading-tight">找回密码</h1>
            <p class="text-lg text-white/70 max-w-md leading-relaxed mb-12">
              别担心，我们会帮助您重新获得账户访问权限。只需几个简单的步骤即可完成。
            </p>

            {/* 特性列表 - 与 Next.js 版本一致 */}
            <div class="space-y-4">
              <For each={features}>
                {(item, index) => (
                  <div
                    class={`flex items-center gap-3 group ${mounted() ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'} transition-all duration-600`}
                    style={{ 'transition-delay': `${600 + index() * 100}ms` }}
                  >
                    <div class="shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span class="text-white/90">{item.text}</span>
                  </div>
                )}
              </For>
            </div>
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
              <div class="inline-flex items-center gap-3 mb-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl">
                <span class="text-2xl">✨</span>
                <span class="text-xl font-bold text-white">Admin Pro</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">重置您的账户密码</p>
            </div>

            <Card class="border border-gray-200/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-xl bg-white/85 dark:bg-gray-800/85 overflow-hidden">
              <Show when={!isSuccess()}>
                {/* 顶部装饰条 */}
                <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

                <CardHeader class="space-y-1 text-center px-4 sm:px-6 pt-7 sm:pt-9 pb-5 sm:pb-6">
                  {/* 大图标 - 与 Next.js 版本一致 */}
                  <div class="mx-auto relative mb-5">
                    <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl">
                      <svg
                        class="h-10 w-10 sm:h-12 sm:w-12 text-white"
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
                      <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent animate-pulse-slow" />
                    </div>
                    <div class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg animate-wiggle">
                      <span class="text-sm">✨</span>
                    </div>
                  </div>

                  <CardTitle class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                    忘记密码？
                  </CardTitle>
                  <CardDescription class="text-sm sm:text-base leading-relaxed">
                    别担心，输入您的邮箱地址
                    <br />
                    我们将发送密码重置链接
                  </CardDescription>
                </CardHeader>
              </Show>

              <Show when={isSuccess()}>
                {/* 成功状态顶部装饰条 */}
                <div class="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

                <CardHeader class="space-y-1 text-center px-4 sm:px-6 pt-7 sm:pt-9 pb-5 sm:pb-6">
                  {/* 成功大图标 - 与 Next.js 版本一致 */}
                  <div class="mx-auto relative mb-5">
                    <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl animate-success-pulse">
                      <svg
                        class="h-10 w-10 sm:h-12 sm:w-12 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <CardTitle class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                    邮件已发送
                  </CardTitle>
                  <CardDescription class="text-sm leading-relaxed">
                    我们已向 <span class="font-semibold text-gray-900 dark:text-white">{email()}</span>{' '}
                    发送了密码重置链接
                  </CardDescription>
                </CardHeader>
              </Show>

              <CardContent class="px-4 sm:px-6 pb-7">
                <Show when={!isSuccess()}>
                  <form onSubmit={handleSubmit} class="space-y-4">
                    {/* 错误提示 */}
                    <Show when={authStore.error || validationError()}>
                      <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs sm:text-sm animate-shake">
                        {authStore.error || validationError()}
                      </div>
                    </Show>

                    {/* 邮箱输入 */}
                    <div class="space-y-2">
                      <label class="text-xs font-medium text-gray-500 dark:text-gray-400">邮箱地址</label>
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
                          placeholder="your@email.com"
                          class="pl-10 h-12 text-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl transition-all"
                          value={email()}
                          onInput={(e) => handleEmailChange(e.currentTarget.value)}
                        />
                      </div>
                    </div>

                    {/* 发送按钮 */}
                    <Button
                      type="submit"
                      class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isSubmitting()}
                    >
                      <Show
                        when={isSubmitting()}
                        fallback={
                          <>
                            发送重置链接
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
                        发送中...
                      </Show>
                    </Button>

                    {/* 安全提示 - 与 Next.js 版本一致 */}
                    <div class="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50">
                      <svg
                        class="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <div class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        <p class="font-medium text-gray-700 dark:text-gray-300 mb-1">安全提示</p>
                        重置链接将在15分钟后过期，请及时查收邮件并完成密码重置。
                      </div>
                    </div>
                  </form>
                </Show>

                <Show when={isSuccess()}>
                  <div class="space-y-4">
                    {/* 成功提示框 */}
                    <div class="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50">
                      <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        📧 请检查您的邮箱并点击链接重置密码
                        <br />
                        📁 如果没有收到，请检查垃圾邮件文件夹
                        <br />⏰ 链接将在15分钟后过期
                      </p>
                    </div>

                    {/* 重新发送按钮 */}
                    <Button
                      variant="outline"
                      class="w-full h-11 text-sm border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                      onClick={() => {
                        setIsSuccess(false)
                        setEmail('')
                      }}
                    >
                      重新发送
                    </Button>
                  </div>
                </Show>
              </CardContent>

              <CardFooter class="px-4 sm:px-6 pb-5 sm:pb-7 pt-2">
                <A
                  href="/login"
                  class="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors w-full group"
                >
                  <svg
                    class="h-4 w-4 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  返回登录
                </A>
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
              @keyframes pulse-slow {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 0.8; }
              }
              .animate-pulse-slow {
                animation: pulse-slow 2s ease-in-out infinite;
              }
              @keyframes wiggle {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(10deg); }
                75% { transform: rotate(-10deg); }
              }
              .animate-wiggle {
                animation: wiggle 2s ease-in-out infinite;
              }
              @keyframes success-pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                50% { box-shadow: 0 0 0 20px rgba(34, 197, 94, 0); }
              }
              .animate-success-pulse {
                animation: success-pulse 1.5s ease-in-out infinite;
              }
            `}</style>
          </div>
        }
      />
    </>
  )
}
