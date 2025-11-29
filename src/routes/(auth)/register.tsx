import { createSignal, createEffect, Show, For, createMemo } from 'solid-js'
import { useNavigate, A } from '@solidjs/router'
import { Title, Meta } from '@solidjs/meta'
import { authStore, actions as authActions } from '~/stores/auth'
import { uiStore, actions as uiActions } from '~/stores/ui'
import type { RegisterData } from '~/types/auth'
import { AuthShell } from '~/components/auth/AuthShell'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, Input } from '~/components/ui'

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = createSignal<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = createSignal(false)
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false)
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [validationErrors, setValidationErrors] = createSignal<Partial<Record<keyof RegisterData, string>>>({})
  const [mounted, setMounted] = createSignal(false)
  const [agreedToTerms, setAgreedToTerms] = createSignal(false)

  // 如果已登录，重定向到仪表盘
  createEffect(() => {
    if (authStore.isAuthenticated) {
      navigate('/dashboard')
    }
  })

  // 设置页面标题和动画
  createEffect(() => {
    uiActions.setPageTitle('注册')
    setTimeout(() => setMounted(true), 100)
  })

  // 密码强度计算 - 与 Next.js 版本一致，使用 4 级评分
  const passwordStrength = createMemo(() => {
    const password = formData().password
    if (!password) return 0

    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++

    // 映射到 1-4 级
    if (score <= 1) return 1
    if (score <= 2) return 2
    if (score <= 3) return 3
    return 4
  })

  // 密码规则检查
  const passwordRules = createMemo(() => [
    { label: '至少8个字符', met: formData().password.length >= 8 },
    { label: '包含小写字母', met: /[a-z]/.test(formData().password) },
    { label: '包含大写字母', met: /[A-Z]/.test(formData().password) },
    { label: '包含数字', met: /\d/.test(formData().password) },
    { label: '包含特殊字符', met: /[^a-zA-Z\d]/.test(formData().password) },
  ])

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof RegisterData, string>> = {}
    const data = formData()

    if (!data.name.trim()) {
      errors.name = '请输入姓名'
    } else if (data.name.trim().length < 2) {
      errors.name = '姓名至少需要2个字符'
    }

    if (!data.email.trim()) {
      errors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = '请输入有效的邮箱地址'
    }

    if (!data.password) {
      errors.password = '请输入密码'
    } else if (data.password.length < 8) {
      errors.password = '密码至少需要8个字符'
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = '请确认密码'
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    if (isSubmitting() || !validateForm()) return

    if (!agreedToTerms()) {
      uiActions.addNotification({
        type: 'warning',
        title: '请同意条款',
        message: '请先阅读并同意服务条款和隐私政策',
      })
      return
    }

    setIsSubmitting(true)
    authActions.clearError()

    try {
      await authActions.register(formData())

      uiActions.addNotification({
        type: 'success',
        title: '注册成功',
        message: '账户创建成功，请登录',
      })

      navigate('/login')
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof RegisterData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setValidationErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
    if (authStore.error) {
      authActions.clearError()
    }
  }

  const handleSocialRegister = (provider: string) => {
    console.log(`使用 ${provider} 注册`)
    uiActions.addNotification({
      type: 'info',
      title: '功能开发中',
      message: `${provider} 注册功能即将上线`,
    })
  }

  // 与 Next.js 版本一致的特性列表
  const features = [
    { icon: '🎁', text: '完全免费的基础功能' },
    { icon: '📊', text: '实时数据分析和报告' },
    { icon: '👥', text: '团队协作和权限管理' },
    { icon: '💬', text: '7x24 小时技术支持' },
  ]

  const socialProviders = [
    { name: 'github', label: 'GitHub', icon: '🐙' },
    { name: 'google', label: 'Google', icon: '🔍' },
    { name: 'wechat', label: '微信', icon: '💬' },
  ]

  return (
    <>
      <Title>注册 - HaloLight</Title>
      <Meta name="description" content="注册HaloLight后台管理系统账户" />

      <AuthShell
        leftGradientClassName="bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600"
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
              创建账户
              <span class="inline-block ml-2 animate-pulse-icon">✨</span>
            </h1>
            <p class="text-lg text-white/70 max-w-md leading-relaxed mb-12">
              加入我们，开始体验强大的后台管理功能，提升您的工作效率。
            </p>

            {/* 特性列表 - 与 Next.js 版本一致 */}
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
              <div class="inline-flex items-center gap-3 mb-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-xl">
                <span class="text-2xl">✨</span>
                <span class="text-xl font-bold text-white">Admin Pro</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">创建您的账户，开始管理之旅</p>
            </div>

            <Card class="border border-gray-200/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 overflow-hidden">
              {/* 顶部装饰条 */}
              <div class="h-1 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600" />

              <CardHeader class="space-y-1 text-center pb-3 sm:pb-5 pt-4 sm:pt-7">
                <CardTitle class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  创建账户
                </CardTitle>
                <CardDescription class="text-xs sm:text-sm mt-2">填写以下信息完成注册</CardDescription>
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
                          class="w-full h-11 sm:h-12 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 group"
                          onClick={() => handleSocialRegister(provider.name)}
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
                      或使用邮箱注册
                    </span>
                  </div>
                </div>

                {/* 注册表单 */}
                <form onSubmit={handleSubmit} class="space-y-3 sm:space-y-4">
                  {/* 错误提示 */}
                  <Show when={authStore.error}>
                    <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs sm:text-sm animate-shake">
                      {authStore.error}
                    </div>
                  </Show>

                  {/* 姓名输入 */}
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">姓名</label>
                    <div class="relative group">
                      <svg
                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-600 transition-colors z-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <Input
                        type="text"
                        placeholder="请输入您的姓名"
                        class="pl-10 h-12 text-sm border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 rounded-xl transition-all"
                        value={formData().name}
                        onInput={(e) => handleInputChange('name', e.currentTarget.value)}
                      />
                    </div>
                    <Show when={validationErrors().name}>
                      <p class="text-xs text-red-500">{validationErrors().name}</p>
                    </Show>
                  </div>

                  {/* 邮箱输入 */}
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">邮箱地址</label>
                    <div class="relative group">
                      <svg
                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-600 transition-colors z-10"
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
                        class="pl-10 h-12 text-sm border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 rounded-xl transition-all"
                        value={formData().email}
                        onInput={(e) => handleInputChange('email', e.currentTarget.value)}
                      />
                    </div>
                    <Show when={validationErrors().email}>
                      <p class="text-xs text-red-500">{validationErrors().email}</p>
                    </Show>
                  </div>

                  {/* 密码输入 */}
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">密码</label>
                    <div class="relative group">
                      <svg
                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-600 transition-colors"
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
                        placeholder="设置您的密码"
                        class="pl-10 pr-10 h-12 text-sm border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 rounded-xl transition-all"
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
                    <Show when={validationErrors().password}>
                      <p class="text-xs text-red-500">{validationErrors().password}</p>
                    </Show>

                    {/* 密码强度指示器 - 与 Next.js 版本一致，4 格进度条 */}
                    <Show when={formData().password}>
                      <div class="space-y-2">
                        <div class="flex gap-1">
                          <For each={[1, 2, 3, 4]}>
                            {(level) => (
                              <div
                                class={`h-1.5 flex-1 rounded-full transition-colors ${
                                  passwordStrength() >= level
                                    ? passwordStrength() <= 1
                                      ? 'bg-red-500'
                                      : passwordStrength() <= 2
                                        ? 'bg-orange-500'
                                        : passwordStrength() <= 3
                                          ? 'bg-yellow-500'
                                          : 'bg-green-500'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                              />
                            )}
                          </For>
                        </div>

                        {/* 密码规则 */}
                        <div class="grid grid-cols-2 gap-1">
                          <For each={passwordRules()}>
                            {(rule) => (
                              <div
                                class={`flex items-center gap-1 text-xs ${rule.met ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}
                              >
                                <Show
                                  when={rule.met}
                                  fallback={
                                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  }
                                >
                                  <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </Show>
                                {rule.label}
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    </Show>
                  </div>

                  {/* 确认密码输入 */}
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">确认密码</label>
                    <div class="relative group">
                      <svg
                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-600 transition-colors"
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
                        placeholder="再次输入密码"
                        class="pl-10 pr-10 h-12 text-sm border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 rounded-xl transition-all"
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
                    <Show when={validationErrors().confirmPassword}>
                      <p class="text-xs text-red-500">{validationErrors().confirmPassword}</p>
                    </Show>
                  </div>

                  {/* 同意条款 */}
                  <div class="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms()}
                      onChange={(e) => setAgreedToTerms(e.currentTarget.checked)}
                      class="mt-1 rounded border-gray-300 w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <label for="terms" class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      我已阅读并同意{' '}
                      <A href="/terms" class="text-purple-600 hover:text-purple-500 dark:text-purple-400 font-medium">
                        服务条款
                      </A>{' '}
                      和{' '}
                      <A href="/privacy" class="text-purple-600 hover:text-purple-500 dark:text-purple-400 font-medium">
                        隐私政策
                      </A>
                    </label>
                  </div>

                  {/* 注册按钮 */}
                  <Button
                    type="submit"
                    class="w-full h-12 text-sm font-medium bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isSubmitting()}
                  >
                    <Show
                      when={isSubmitting()}
                      fallback={
                        <>
                          创建账户
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
                      注册中...
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
                  已有账户？{' '}
                  <A
                    href="/login"
                    class="text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 font-semibold transition-colors"
                  >
                    立即登录
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
            `}</style>
          </div>
        }
      />
    </>
  )
}
