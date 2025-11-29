import { apiService } from './api'
import type {
  User,
  TokenPair,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
} from '~/types/auth'
import type { ApiResponse } from '~/types/api'

class AuthService {
  private readonly prefix = '/auth'

  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: TokenPair }>> {
    return apiService.post<{ user: User; token: TokenPair }>(`${this.prefix}/login`, credentials)
  }

  /**
   * 用户注册
   */
  async register(data: RegisterData): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.prefix}/register`, data)
  }

  /**
   * 用户登出
   */
  async logout(): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.prefix}/logout`)
  }

  /**
   * 忘记密码
   */
  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.prefix}/forgot-password`, data)
  }

  /**
   * 重置密码
   */
  async resetPassword(data: ResetPasswordData): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.prefix}/reset-password`, data)
  }

  /**
   * 刷新Token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: TokenPair }>> {
    return apiService.post<{ token: TokenPair }>(`${this.prefix}/refresh`, { refreshToken })
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiService.get<User>(`${this.prefix}/me`)
  }

  /**
   * 更新用户信息
   */
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put<User>(`${this.prefix}/profile`, data)
  }

  /**
   * 修改密码
   */
  async changePassword(data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<ApiResponse<void>> {
    return apiService.put<void>(`${this.prefix}/change-password`, data)
  }

  /**
   * 验证邮箱
   */
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.prefix}/verify-email`, { token })
  }

  /**
   * 重新发送验证邮件
   */
  async resendVerificationEmail(email: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.prefix}/resend-verification`, { email })
  }
}

export const authService = new AuthService()
