import { createSignal, createEffect, Show, For, createMemo } from 'solid-js'
import { useNavigate, useSearchParams, A } from '@solidjs/router'
import { Title, Meta } from '@solidjs/meta'
import { authStore, actions as authActions } from '~/stores/auth'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { AuthShell } from '~/components/auth/AuthShell'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, Input } from '~/components/ui'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = createSignal({
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = createSignal(false)
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false)
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [isSuccess, setIsSuccess] = createSignal(false)
  const [error, setError] = createSignal('')
  const [mounted, setMounted] = createSignal(false)
  const [countdown, setCountdown] = createSignal(3)

  const token = () => {
    const t = searchParams.token
    return Array.isArray(t) ? t[0] : t || ''
  }

  createEffect(() => {
    uiActions.setPageTitle('重置密码')
    setTimeout(() => setMounted(true), 100)

    // 验证 token 是否存在
    if (!token()) {
      setError('无效的重置链接，请重新申请密码重置')
    }
  })

  // 密码强度计算
  const passwordStrength = createMemo(() => {
    const password = formData().password
    if (!password) return { score: 0, label: '', color: '' }

    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++

    if (score <= 1) return { score: 1, label: '弱', color: 'bg-red-500' }
    if (score <= 2) return { score: 2, label: '较弱', color: 'bg-orange-500' }
    if (score <= 3) return { score: 3, label: '中等', color: 'bg-yellow-500' }
    if (score <= 4) return { score: 4, label: '强', color: 'bg-green-500' }
    return { score: 5, label: '很强', color: 'bg-emerald-500' }
  })

  // 密码规则检查
  const passwordRules = createMemo(() => [
    { label: '至少8个字符', met: formData().password.length >= 8 },
    { label: '包含小写字母', met: /[a-z]/.test(formData().password) },
    { label: '包含大写字母', met: /[A-Z]/.test(formData().password) },
    { label: '包含数字', met: /\d/.test(formData().password) },
    { label: '包含特殊字符', met: /[^a-zA-Z\d]/.test(formData().password) },
  ])

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return '密码长度至少 8 位'
    }
    if (!/[A-Z]/.test(password)) {
      return '密码需包含至少一个大写字母'
    }
    if (!/[a-z]/.test(password)) {
      return '密码需包含至少一个小写字母'
    }
    if (!/[0-9]/.test(password)) {
      return '密码需包含至少一个数字'
    }
    return ''
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    if (isSubmitting()) return

    setError('')

    const { password, confirmPassword } = formData()

    // 验证密码强度
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    // 验证密码匹配
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setIsSubmitting(true)

    try {
      await authActions.resetPassword({
        token: token(),
        password,
        confirmPassword,
      })

      setIsSuccess(true)

      uiActions.addNotification({
        type: 'success',
        title: '密码重置成功',
        message: '请使用新密码登录',
      })

      // 倒计时跳转
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            navigate('/login')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      setError(err.message || '密码重置失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: 'password' | 'confirmPassword', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error()) setError('')
  }

  // 与 Next.js 版本一致的特性列表
  const features = [
    { icon: '🔒', text: '使用至少 8 个字符' },
    { icon: '🔤', text: '混合大小写字母' },
    { icon: '🔢', text: '包含数字和符号' },
    { icon: '🛡️', text: '避免使用个人信息' },
  ]

  return (
    <>
      <Title>重置密码 - HaloLight</Title>
      <Meta name="description" content="设置您的新密码" />

      <AuthShell
        leftGradientClassName="bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700"
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
            <h1 class="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              重置密码
              <span class="inline-block ml-2 animate-pulse-icon">🔐</span>
            </h1>
            <p class="text-lg text-white/70 max-w-md leading-relaxed mb-12">
              设置一个安全的新密码，保护您的账户安全。请确保密码足够复杂。
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
              @keyframes pulse-icon {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
              .animate-pulse-icon {
                animation: pulse-icon 2s ease-in-out infinite;
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
              <div class="inline-flex items-center gap-3 mb-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl">
                <span class="text-2xl">✨</span>
                <span class="text-xl font-bold text-white">Admin Pro</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">设置您的新密码</p>
            </div>

            <Card class="border border-gray-200/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 overflow-hidden">
              <Show when={!isSuccess()}>
                {/* 顶部装饰条 */}
                <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

                <CardHeader class="space-y-1 text-center px-4 sm:px-6 pt-7 sm:pt-9 pb-5 sm:pb-6">
                  {/* 大图标 - 与 Next.js 版本一致 */}
                  <div class="mx-auto relative mb-6">
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
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent animate-pulse-slow" />
                    </div>
                  </div>

                  <CardTitle class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                    设置新密码
                  </CardTitle>
                  <CardDescription class="text-sm leading-relaxed">请设置您的新密码，确保密码足够安全</CardDescription>
                </CardHeader>
              </Show>

              <Show when={isSuccess()}>
                {/* 成功状态顶部装饰条 */}
                <div class="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

                <CardHeader class="space-y-1 text-center px-4 sm:px-6 pt-8 sm:pt-10 pb-6">
                  {/* 成功大图标 - 与 Next.js 版本一致 */}
                  <div class="mx-auto relative mb-6">
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
                    密码重置成功
                  </CardTitle>
                  <CardDescription class="text-sm leading-relaxed">您的密码已成功重置</CardDescription>
                </CardHeader>
              </Show>

              <CardContent class="space-y-3 sm:space-y-4 px-4 sm:px-6">
                <Show when={!isSuccess()}>
                  {/* 无效 token 警告 */}
                  <Show when={!token()}>
                    <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <div class="flex items-center gap-2">
                        <svg
                          class="h-5 w-5 text-red-600 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p class="text-sm text-red-700 dark:text-red-400">无效的重置链接，请重新申请密码重置</p>
                      </div>
                      <Button
                        class="w-full mt-4 h-10 text-sm bg-red-600 hover:bg-red-700"
                        onClick={() => navigate('/forgot-password')}
                      >
                        重新申请
                      </Button>
                    </div>
                  </Show>

                  <Show when={token()}>
                    <form onSubmit={handleSubmit} class="space-y-4">
                      {/* 错误提示 */}
                      <Show when={error()}>
                        <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs sm:text-sm animate-shake">
                          {error()}
                        </div>
                      </Show>

                      {/* 新密码输入 */}
                      <div class="space-y-2">
                        <label class="text-xs font-medium text-gray-600 dark:text-gray-400">新密码</label>
                        <div class="relative group">
                          <svg
                            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-600 transition-colors"
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
                            placeholder="设置您的新密码"
                            class="pl-10 pr-10 h-12 text-sm border-gray-300 dark:border-gray-600 focus:border-teal-500 dark:focus:border-teal-500 rounded-xl transition-all"
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

                        {/* 密码强度指示器 */}
                        <Show when={formData().password}>
                          <div class="space-y-2">
                            <div class="flex items-center gap-2">
                              <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  class={`h-full ${passwordStrength().color} transition-all duration-300`}
                                  style={{ width: `${(passwordStrength().score / 5) * 100}%` }}
                                />
                              </div>
                              <span class="text-xs text-gray-500 dark:text-gray-400">{passwordStrength().label}</span>
                            </div>

                            {/* 密码规则 */}
                            <div class="grid grid-cols-2 gap-1.5">
                              <For each={passwordRules()}>
                                {(rule) => (
                                  <div class="flex items-center gap-1.5 text-xs">
                                    <Show
                                      when={rule.met}
                                      fallback={
                                        <svg
                                          class="h-3 w-3 text-gray-300"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <circle cx="12" cy="12" r="10" stroke-width="2" />
                                        </svg>
                                      }
                                    >
                                      <svg
                                        class="h-3 w-3 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </Show>
                                    <span class={rule.met ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                                      {rule.label}
                                    </span>
                                  </div>
                                )}
                              </For>
                            </div>
                          </div>
                        </Show>
                      </div>

                      {/* 确认密码输入 */}
                      <div class="space-y-2">
                        <label class="text-xs font-medium text-gray-600 dark:text-gray-400">确认新密码</label>
                        <div class="relative group">
                          <svg
                            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-600 transition-colors"
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
                          <Input
                            type={showConfirmPassword() ? 'text' : 'password'}
                            placeholder="再次输入新密码"
                            class="pl-10 pr-10 h-12 text-sm border-gray-300 dark:border-gray-600 focus:border-teal-500 dark:focus:border-teal-500 rounded-xl transition-all"
                            value={formData().confirmPassword}
                            onInput={(e) => handleInputChange('confirmPassword', e.currentTarget.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                          >
                            <Show
                              when={showConfirmPassword()}
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
                        <Show when={formData().confirmPassword && formData().password !== formData().confirmPassword}>
                          <p class="text-xs text-red-500">两次输入的密码不一致</p>
                        </Show>
                        <Show
                          when={
                            formData().confirmPassword &&
                            formData().password === formData().confirmPassword &&
                            formData().confirmPassword.length > 0
                          }
                        >
                          <p class="text-xs text-green-500 flex items-center gap-1">
                            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            密码匹配
                          </p>
                        </Show>
                      </div>

                      {/* 重置按钮 */}
                      <Button
                        type="submit"
                        class="w-full h-12 text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={isSubmitting()}
                      >
                        <Show
                          when={isSubmitting()}
                          fallback={
                            <>
                              重置密码
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
                          重置中...
                        </Show>
                      </Button>
                    </form>
                  </Show>
                </Show>

                <Show when={isSuccess()}>
                  <div class="space-y-4">
                    {/* 成功提示框 - 与 Next.js 版本一致 */}
                    <div class="p-4 rounded-xl bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/50">
                      <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        ✅ 您的密码已成功更新
                        <br />
                        🔐 现在可以使用新密码登录您的账户
                      </p>
                    </div>

                    <Button
                      type="button"
                      class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => navigate('/login')}
                    >
                      前往登录
                      <span class="ml-2 animate-arrow">→</span>
                    </Button>
                  </div>
                </Show>
              </CardContent>

              <CardFooter class="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-5 sm:pb-8 pt-2">
                <div class="relative w-full">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
                  记起密码了？{' '}
                  <A
                    href="/login"
                    class="text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 font-semibold transition-colors"
                  >
                    返回登录
                  </A>
                </p>
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
              @keyframes success-bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
              .animate-success-bounce {
                animation: success-bounce 0.5s ease-out;
              }
            `}</style>
          </div>
        }
      />
    </>
  )
}
