import { apiService } from './api'
import type { Role, Permission } from '~/types/auth'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '~/types/api'

export interface RoleFilters extends PaginationParams {
  search?: string
}

export interface CreateRoleData {
  name: string
  label: string
  permissions: Permission[]
  description?: string
}

export interface UpdateRoleData extends Partial<CreateRoleData> {}

class RoleService {
  private readonly prefix = '/roles'

  /**
   * 获取角色列表
   */
  async getRoles(filters: RoleFilters): Promise<ApiResponse<PaginatedResponse<Role>>> {
    return apiService.get<PaginatedResponse<Role>>(this.prefix, filters)
  }

  /**
   * 获取单个角色信息
   */
  async getRole(id: string): Promise<ApiResponse<Role>> {
    return apiService.get<Role>(`${this.prefix}/${id}`)
  }

  /**
   * 创建角色
   */
  async createRole(data: CreateRoleData): Promise<ApiResponse<Role>> {
    return apiService.post<Role>(this.prefix, data)
  }

  /**
   * 更新角色信息
   */
  async updateRole(id: string, data: UpdateRoleData): Promise<ApiResponse<Role>> {
    return apiService.put<Role>(`${this.prefix}/${id}`, data)
  }

  /**
   * 删除角色
   */
  async deleteRole(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.prefix}/${id}`)
  }

  /**
   * 批量删除角色
   */
  async batchDeleteRoles(ids: string[]): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.prefix}/batch-delete`, { ids })
  }

  /**
   * 获取权限列表
   */
  async getPermissions(): Promise<ApiResponse<{ permissions: Permission[] }>> {
    return apiService.get<{ permissions: Permission[] }>('/permissions')
  }
}

export const roleService = new RoleService()
