/**
 * 通知相关类型定义
 */

/** 通知类型 */
export type NotificationType = 'system' | 'user' | 'message' | 'task' | 'alert'

/** 通知优先级 */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

/** 通知发送者 */
export interface NotificationSender {
  id: string
  name: string
  avatar?: string
}

/** 通知 */
export interface Notification {
  id: string
  type: NotificationType | string
  title: string
  content: string
  read: boolean
  starred?: boolean
  priority?: NotificationPriority
  createdAt: string
  expiresAt?: string
  link?: string
  sender?: NotificationSender
}

/** 通知创建请求 */
export interface NotificationCreateRequest {
  type: NotificationType
  title: string
  content: string
  priority?: NotificationPriority
  link?: string
  targetUserIds?: string[]
}

/** 通知统计 */
export interface NotificationStats {
  total: number
  unread: number
  byType: Record<NotificationType, number>
}
