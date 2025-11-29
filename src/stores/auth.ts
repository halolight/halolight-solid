import { createStore } from 'solid-js/store'
import { createEffect } from 'solid-js'
import type {
  User,
  TokenPair,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
} from '~/types/auth'
import type { ApiResponse } from '~/types/api'
import { authService } from '~/services/auth'
import { storage } from '~/lib/storage'

interface AuthState {
  user: User | null
  accounts: User[]
  activeAccountId: string | null
  token: TokenPair | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  switchAccount: (accountId: string) => void
  addAccount: (user: User, token: TokenPair) => void
  removeAccount: (accountId: string) => void
  loadAccounts: () => Promise<void>
  forgotPassword: (data: ForgotPasswordData) => Promise<void>
  resetPassword: (data: ResetPasswordData) => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void
  initialize: () => void
}

const initialState: AuthState = {
  user: null,
  accounts: [],
  activeAccountId: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const [authStore, setAuthStore] = createStore<AuthState>(initialState)

const actions: AuthActions = {
  async login(credentials: LoginCredentials) {
    setAuthStore('isLoading', true)
    setAuthStore('error', null)

    try {
      const response = await authService.login(credentials)
      const { user, token } = response.data

      setAuthStore({
        user,
        accounts: [],
        activeAccountId: user.id,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      // 保存token到本地存储
      storage.set('token', token)
      storage.set('user', user)

      // 设置记住我
      if (credentials.remember) {
        storage.set('rememberMe', true)
      }
    } catch (error: any) {
      setAuthStore({
        isLoading: false,
        error: error.message || '登录失败，请检查用户名和密码',
      })
      throw error
    }
  },

  async register(data: RegisterData) {
    setAuthStore('isLoading', true)
    setAuthStore('error', null)

    try {
      await authService.register(data)
      setAuthStore('isLoading', false)
    } catch (error: any) {
      setAuthStore({
        isLoading: false,
        error: error.message || '注册失败，请稍后重试',
      })
      throw error
    }
  },

  logout() {
    // 清除本地存储
    storage.remove('token')
    storage.remove('user')
    storage.remove('rememberMe')
    storage.remove('accounts')

    // 重置状态
    setAuthStore(initialState)
  },

  switchAccount(accountId: string) {
    const account = authStore.accounts.find((item) => item.id === accountId)
    if (!account) {
      setAuthStore('error', '账号不存在')
      return
    }

    // Store the account as current user
    storage.set('user', account)
    storage.set('activeAccountId', account.id)

    setAuthStore({
      user: account,
      activeAccountId: account.id,
      isAuthenticated: true,
      error: null,
    })
  },

  addAccount(user: User, token: TokenPair) {
    // Check if account already exists
    const existingIndex = authStore.accounts.findIndex((acc) => acc.id === user.id)
    if (existingIndex !== -1) {
      // Update existing account
      setAuthStore('accounts', existingIndex, user)
    } else {
      // Add new account
      setAuthStore('accounts', [...authStore.accounts, user])
    }

    // Update storage
    storage.set('accounts', authStore.accounts)

    // If this is the first account, set it as active
    if (!authStore.user) {
      setAuthStore({
        user,
        activeAccountId: user.id,
        token,
        isAuthenticated: true,
      })
      storage.set('user', user)
      storage.set('token', token)
      storage.set('activeAccountId', user.id)
    }
  },

  removeAccount(accountId: string) {
    const updatedAccounts = authStore.accounts.filter((acc) => acc.id !== accountId)

    // If removing active account, switch to another or logout
    if (authStore.activeAccountId === accountId) {
      if (updatedAccounts.length > 0) {
        const nextAccount = updatedAccounts[0]
        storage.set('user', nextAccount)
        storage.set('activeAccountId', nextAccount.id)
        setAuthStore({
          user: nextAccount,
          accounts: updatedAccounts,
          activeAccountId: nextAccount.id,
          error: null,
        })
      } else {
        // No accounts left, logout
        actions.logout()
        return
      }
    } else {
      setAuthStore('accounts', updatedAccounts)
    }

    storage.set('accounts', updatedAccounts)
  },

  async loadAccounts() {
    setAuthStore('isLoading', true)
    try {
      // Try to load accounts from storage first
      const storedAccounts = storage.get<User[]>('accounts')
      if (storedAccounts && storedAccounts.length > 0) {
        setAuthStore({
          accounts: storedAccounts,
          isLoading: false,
        })
      } else {
        // If no stored accounts, create a list with current user
        const accounts = authStore.user ? [authStore.user] : []
        setAuthStore({
          accounts,
          isLoading: false,
        })
        storage.set('accounts', accounts)
      }
    } catch (error: any) {
      setAuthStore({
        isLoading: false,
        error: error.message || '加载账号失败',
      })
    }
  },

  async forgotPassword(data: ForgotPasswordData) {
    setAuthStore('isLoading', true)
    setAuthStore('error', null)

    try {
      await authService.forgotPassword(data)
      setAuthStore('isLoading', false)
    } catch (error: any) {
      setAuthStore({
        isLoading: false,
        error: error.message || '发送邮件失败，请稍后重试',
      })
      throw error
    }
  },

  async resetPassword(data: ResetPasswordData) {
    setAuthStore('isLoading', true)
    setAuthStore('error', null)

    try {
      await authService.resetPassword(data)
      setAuthStore('isLoading', false)
    } catch (error: any) {
      setAuthStore({
        isLoading: false,
        error: error.message || '重置密码失败，请稍后重试',
      })
      throw error
    }
  },

  async refreshToken() {
    if (!authStore.token?.refreshToken) {
      return
    }

    try {
      const response = await authService.refreshToken(authStore.token.refreshToken)
      const { token } = response.data

      setAuthStore('token', token)
      storage.set('token', token)
    } catch (error) {
      // 刷新token失败，需要重新登录
      actions.logout()
      throw error
    }
  },

  clearError() {
    setAuthStore('error', null)
  },

  initialize() {
    // 从本地存储恢复状态
    const token = storage.get<TokenPair>('token')
    const user = storage.get<User>('user')
    const accounts = storage.get<User[]>('accounts') ?? []

    if (token && user) {
      setAuthStore({
        user,
        accounts,
        activeAccountId: user.id,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    }
  },
}

// 初始化时从本地存储恢复状态
createEffect(() => {
  actions.initialize()
})

// 监听token过期，自动刷新
createEffect(() => {
  if (authStore.isAuthenticated && authStore.token) {
    // 这里可以添加token过期检查逻辑
    // 如果token即将过期，自动刷新
  }
})

export { authStore, actions }
