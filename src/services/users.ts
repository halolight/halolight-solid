import { apiService } from './api'
import type { User, UserStatus } from '~/types/auth'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '~/types/api'

export interface UserFilters extends PaginationParams {
  search?: string
  status?: UserStatus
  role?: string
  department?: string
}

export interface CreateUserData {
  name: string
  email: string
  phone?: string
  roleId: string
  department?: string
  position?: string
  bio?: string
  avatar?: string
}

export interface UpdateUserData extends Partial<CreateUserData> {
  status?: UserStatus
}

class UserService {
  private readonly prefix = '/users'

  /**
   * 获取用户列表
   */
  async getUsers(filters: UserFilters): Promise<ApiResponse<PaginatedResponse<User>>> {
    return apiService.get<PaginatedResponse<User>>(this.prefix, filters)
  }

  /**
   * 获取单个用户信息
   */
  async getUser(id: string): Promise<ApiResponse<User>> {
    return apiService.get<User>(`${this.prefix}/${id}`)
  }

  /**
   * 创建用户
   */
  async createUser(data: CreateUserData): Promise<ApiResponse<User>> {
    return apiService.post<User>(this.prefix, data)
  }

  /**
   * 更新用户信息
   */
  async updateUser(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    return apiService.put<User>(`${this.prefix}/${id}`, data)
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.prefix}/${id}`)
  }

  /**
   * 批量删除用户
   */
  async batchDeleteUsers(ids: string[]): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.prefix}/batch-delete`, { ids })
  }

  /**
   * 重置用户密码
   */
  async resetPassword(id: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.prefix}/${id}/reset-password`)
  }

  /**
   * 启用用户
   */
  async enableUser(id: string): Promise<ApiResponse<void>> {
    return apiService.patch<void>(`${this.prefix}/${id}/enable`)
  }

  /**
   * 禁用用户
   */
  async disableUser(id: string): Promise<ApiResponse<void>> {
    return apiService.patch<void>(`${this.prefix}/${id}/disable`)
  }

  /**
   * 导出用户数据
   */
  async exportUsers(filters: UserFilters): Promise<ApiResponse<{ url: string }>> {
    return apiService.post<{ url: string }>(`${this.prefix}/export`, filters)
  }

  /**
   * 导入用户数据
   */
  async importUsers(file: File): Promise<ApiResponse<{ imported: number; failed: number }>> {
    return apiService.upload<{ imported: number; failed: number }>(`${this.prefix}/import`, file)
  }
}

export const userService = new UserService()
