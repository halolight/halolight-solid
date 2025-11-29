/**
 * 路由与权限配置中心
 * 统一管理所有路由、权限映射和菜单配置
 */

import type { Permission } from '~/types/auth'
import type { JSX } from 'solid-js'

// ============================================================================
// 路由常量
// ============================================================================

/** 公开路由 - 无需认证即可访问 */
export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'] as const

/** 认证路由 - 已登录用户不能访问（如登录页） */
export const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'] as const

// ============================================================================
// 路由权限映射
// ============================================================================

/** 路由与权限的映射关系 */
export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  '/dashboard': 'dashboard:view',
  '/users': 'users:view',
  '/roles': 'roles:view',
  '/analytics': 'analytics:view',
  '/documents': 'documents:view',
  '/files': 'files:view',
  '/messages': 'messages:view',
  '/calendar': 'calendar:view',
  '/notifications': 'notifications:view',
  '/settings': 'settings:view',
  '/settings/teams': 'teams:view',
  '/settings/teams/roles': 'roles:view',
  '/profile': 'settings:view',
}

/** 路由与页面标题的映射 */
export const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': '仪表盘',
  '/users': '用户管理',
  '/roles': '角色权限',
  '/analytics': '数据分析',
  '/documents': '文档管理',
  '/files': '文件存储',
  '/messages': '消息中心',
  '/calendar': '日程安排',
  '/notifications': '通知中心',
  '/settings': '系统设置',
  '/settings/teams': '团队设置',
  '/settings/teams/roles': '角色管理',
  '/profile': '个人资料',
}

// ============================================================================
// 权限规则（用于正则匹配）
// ============================================================================

export interface PermissionRule {
  /** 路由匹配正则 */
  pattern: RegExp
  /** 所需权限 */
  permission: Permission
  /** 页面标签 */
  label: string
}

/** 权限规则列表 - 用于动态路由匹配 */
export const PERMISSION_RULES: PermissionRule[] = [
  { pattern: /^\/dashboard$/, permission: 'dashboard:view', label: '仪表盘' },
  { pattern: /^\/users/, permission: 'users:view', label: '用户管理' },
  { pattern: /^\/roles/, permission: 'roles:view', label: '角色权限' },
  { pattern: /^\/analytics/, permission: 'analytics:view', label: '数据分析' },
  { pattern: /^\/documents/, permission: 'documents:view', label: '文档管理' },
  { pattern: /^\/files/, permission: 'files:view', label: '文件存储' },
  { pattern: /^\/messages/, permission: 'messages:view', label: '消息中心' },
  { pattern: /^\/calendar/, permission: 'calendar:view', label: '日程安排' },
  { pattern: /^\/notifications/, permission: 'notifications:view', label: '通知中心' },
  { pattern: /^\/settings/, permission: 'settings:view', label: '系统设置' },
  { pattern: /^\/profile/, permission: 'settings:view', label: '个人资料' },
]

// ============================================================================
// 菜单配置
// ============================================================================

export interface MenuItem {
  /** 菜单标题 */
  title: string
  /** 菜单图标名称 */
  icon: string
  /** 路由路径 */
  href: string
  /** 所需权限 */
  permission?: Permission
  /** 子菜单 */
  children?: MenuItem[]
}

/** 侧边栏菜单项配置 */
export const MENU_ITEMS: MenuItem[] = [
  { title: '仪表盘', icon: 'dashboard', href: '/dashboard', permission: 'dashboard:view' },
  { title: '用户管理', icon: 'users', href: '/users', permission: 'users:view' },
  { title: '角色权限', icon: 'shield', href: '/roles', permission: 'roles:view' },
  {
    title: '内容管理',
    icon: 'file-text',
    href: '/documents',
    permission: 'documents:view',
    children: [
      { title: '文档管理', icon: 'file-text', href: '/documents', permission: 'documents:view' },
      { title: '文件存储', icon: 'folder', href: '/files', permission: 'files:view' },
    ],
  },
  {
    title: '业务运营',
    icon: 'bar-chart',
    href: '/analytics',
    permission: 'analytics:view',
    children: [
      { title: '数据分析', icon: 'bar-chart', href: '/analytics', permission: 'analytics:view' },
      { title: '消息中心', icon: 'mail', href: '/messages', permission: 'messages:view' },
      { title: '日程安排', icon: 'calendar', href: '/calendar', permission: 'calendar:view' },
    ],
  },
  { title: '通知中心', icon: 'bell', href: '/notifications', permission: 'notifications:view' },
  {
    title: '系统设置',
    icon: 'settings',
    href: '/settings',
    permission: 'settings:view',
    children: [
      { title: '基础设置', icon: 'settings', href: '/settings', permission: 'settings:view' },
      { title: '团队管理', icon: 'users', href: '/settings/teams', permission: 'teams:view' },
    ],
  },
]

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 检查路径是否为公开路由
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

/**
 * 检查路径是否为认证路由
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

/**
 * 获取路径所需的权限
 */
export function getRoutePermission(pathname: string): Permission | undefined {
  // 先尝试精确匹配
  if (pathname in ROUTE_PERMISSIONS) {
    return ROUTE_PERMISSIONS[pathname]
  }
  // 再尝试正则匹配
  const rule = PERMISSION_RULES.find((r) => r.pattern.test(pathname))
  return rule?.permission
}

/**
 * 获取路径对应的页面标题
 */
export function getRouteTitle(pathname: string): string {
  if (pathname in ROUTE_TITLES) {
    return ROUTE_TITLES[pathname]
  }
  const rule = PERMISSION_RULES.find((r) => r.pattern.test(pathname))
  return rule?.label ?? 'HaloLight'
}

/**
 * 根据路径查找匹配的权限规则
 */
export function findPermissionRule(pathname: string): PermissionRule | undefined {
  return PERMISSION_RULES.find((rule) => rule.pattern.test(pathname))
}

/**
 * 获取菜单项所需的权限
 */
export function getMenuPermission(href: string): Permission | undefined {
  return ROUTE_PERMISSIONS[href]
}

/**
 * 检查用户是否拥有指定权限
 */
export function hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
  if (userPermissions.includes('*' as Permission)) return true
  return userPermissions.includes(requiredPermission)
}

/**
 * 过滤用户有权限访问的菜单项
 */
export function filterMenuByPermissions(items: MenuItem[], userPermissions: Permission[]): MenuItem[] {
  return items.filter((item) => {
    if (!item.permission) return true
    if (!hasPermission(userPermissions, item.permission)) return false

    if (item.children) {
      item.children = filterMenuByPermissions(item.children, userPermissions)
    }

    return true
  })
}
