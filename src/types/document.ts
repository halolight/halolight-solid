/**
 * 文档相关类型定义
 */

/** 文档类型 */
export type DocumentType = 'pdf' | 'doc' | 'document' | 'image' | 'spreadsheet' | 'presentation' | 'code' | 'other'

/** 文档作者 */
export interface DocumentAuthor {
  id: string
  name: string
  avatar?: string
}

/** 文档协作者 */
export interface DocumentCollaborator {
  id: string
  name: string
  avatar?: string
  permission: 'view' | 'edit' | 'admin'
}

/** 文档 */
export interface Document {
  id: string
  name?: string
  title?: string
  type: DocumentType | string
  size: number
  folder?: string
  folderId?: string | null
  path?: string
  content?: string
  author?: DocumentAuthor
  createdBy?: DocumentAuthor | string
  shared?: boolean
  tags?: string[]
  views?: number
  viewCount?: number
  downloadCount?: number
  version?: string
  createdAt: string
  updatedAt: string
  collaborators?: DocumentCollaborator[]
}

/** 文档创建请求 */
export interface DocumentCreateRequest {
  title: string
  type: DocumentType
  content?: string
  folder?: string
  tags?: string[]
  shared?: boolean
}

/** 文档更新请求 */
export interface DocumentUpdateRequest {
  title?: string
  content?: string
  folder?: string
  tags?: string[]
  shared?: boolean
}

/** 文档文件夹 */
export interface DocumentFolder {
  id: string
  name: string
  parentId?: string | null
  documentCount?: number
  createdAt: string
  updatedAt: string
}

/** 文档统计 */
export interface DocumentStats {
  total: number
  byType: Record<DocumentType, number>
  recentlyViewed: number
  shared: number
}
