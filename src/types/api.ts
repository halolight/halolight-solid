import type { UserStatus } from './auth'

export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  code: number
  data: {
    list: T[]
    total: number
    page: number
    pageSize: number
  }
  message: string
}

export interface ApiError {
  code: number
  message: string
  details?: Record<string, any>
}

export interface PaginationParams {
  page: number
  pageSize: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  status?: string
}

export interface UserFilters extends PaginationParams {
  status?: UserStatus
  role?: string
  department?: string
}
