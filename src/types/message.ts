/**
 * 消息相关类型定义
 */

/** 消息类型 */
export type MessageType = 'text' | 'image' | 'file' | 'audio' | 'video'

/** 消息发送者 */
export interface MessageSender {
  id: string
  name: string
  avatar?: string
}

/** 消息 */
export interface Message {
  id: string
  conversationId?: string
  sender?: MessageSender
  senderId?: string
  senderName?: string
  senderAvatar?: string
  type?: MessageType | string
  status?: string
  content: string
  createdAt: string
  read?: boolean
  attachments?: MessageAttachment[]
}

/** 消息附件 */
export interface MessageAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  thumbnail?: string
}

/** 会话类型 */
export type ConversationType = 'private' | 'group'

/** 会话成员 */
export interface ConversationMember {
  id: string
  name: string
  avatar?: string
  role?: 'admin' | 'member'
  joinedAt?: string
}

/** 会话 */
export interface Conversation {
  id: string
  type: ConversationType
  name: string
  avatar?: string
  lastMessage?: Message | string
  lastMessageTime?: string
  unreadCount: number
  online?: boolean
  members?: ConversationMember[]
  participants?: Array<{id: string; name: string; avatar: string}>
  createdAt?: string
  updatedAt?: string
}

/** 发送消息请求 */
export interface SendMessageRequest {
  conversationId: string
  content: string
  type?: MessageType
  attachments?: string[]
}

/** 创建会话请求 */
export interface CreateConversationRequest {
  type: ConversationType
  name?: string
  memberIds: string[]
}

/** 消息统计 */
export interface MessageStats {
  totalConversations: number
  unreadMessages: number
  todayMessages: number
}
