/**
 * 团队相关类型定义
 */

/** 团队成员角色 */
export type TeamMemberRole = 'owner' | 'admin' | 'member'

/** 团队成员 */
export interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  avatar?: string
  role: TeamMemberRole
  joinedAt: string
}

/** 团队 */
export interface Team {
  id: string
  name: string
  description?: string
  avatar?: string
  memberCount: number
  members?: TeamMember[]
  createdAt: string
  updatedAt: string
  createdBy?: string
}

/** 团队创建请求 */
export interface TeamCreateRequest {
  name: string
  description?: string
  memberIds?: string[]
}

/** 团队更新请求 */
export interface TeamUpdateRequest {
  name?: string
  description?: string
}

/** 添加团队成员请求 */
export interface TeamAddMemberRequest {
  userId: string
  role?: TeamMemberRole
}

/** 更新团队成员请求 */
export interface TeamUpdateMemberRequest {
  role: TeamMemberRole
}

/** 团队邀请 */
export interface TeamInvite {
  id: string
  teamId: string
  email: string
  role: TeamMemberRole
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  expiresAt: string
  createdAt: string
}

/** 团队统计 */
export interface TeamStats {
  totalMembers: number
  activeMembers: number
  pendingInvites: number
}
