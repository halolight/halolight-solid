export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: Role
  status: UserStatus
  department?: string
  position?: string
  bio?: string
  createdAt: string
  lastLoginAt?: string
}

export interface Role {
  id: string
  name: string
  label: string
  permissions: Permission[]
  description?: string
}

export type Permission =
  | '*'
  | 'dashboard:view'
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  | 'analytics:view'
  | 'analytics:export'
  | 'settings:view'
  | 'settings:edit'
  | 'roles:view'
  | 'roles:create'
  | 'roles:edit'
  | 'roles:delete'
  | 'permissions:view'
  | 'permissions:edit'
  | 'documents:view'
  | 'documents:create'
  | 'documents:edit'
  | 'documents:delete'
  | 'files:view'
  | 'files:upload'
  | 'files:delete'
  | 'messages:view'
  | 'messages:send'
  | 'calendar:view'
  | 'calendar:edit'
  | 'notifications:view'
  | 'notifications:manage'
  | 'teams:view'
  | 'teams:create'
  | 'teams:edit'
  | 'teams:delete'

export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}
