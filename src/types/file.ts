/**
 * 文件相关类型定义
 */

/** 文件类型 */
export type FileType = 'folder' | 'image' | 'video' | 'audio' | 'archive' | 'document' | 'other'

/** 文件项 */
export interface FileItem {
  id: string
  name: string
  type: FileType | string
  size: number | null
  items?: number | null
  path: string
  parentId?: string | null
  mimeType?: string
  thumbnail?: string | null
  createdAt: string
  updatedAt: string
  createdBy?: string | {id: string; name: string}
  shared?: boolean
  starred?: boolean
}

/** 存储信息 */
export interface StorageInfo {
  used: number
  total: number
  breakdown: {
    images: number
    videos: number
    audio: number
    documents: number
    archives: number
    others: number
  }
}

/** 文件上传请求 */
export interface FileUploadRequest {
  file: File
  folder?: string
  tags?: string[]
}

/** 创建文件夹请求 */
export interface CreateFolderRequest {
  name: string
  parentPath?: string
}

/** 文件移动请求 */
export interface FileMoveRequest {
  fileIds: string[]
  targetPath: string
}

/** 文件复制请求 */
export interface FileCopyRequest {
  fileIds: string[]
  targetPath: string
}

/** 文件分享请求 */
export interface FileShareRequest {
  fileId: string
  userIds?: string[]
  expiresAt?: string
  permission: 'view' | 'edit'
}

/** 文件分享链接 */
export interface FileShareLink {
  id: string
  fileId: string
  url: string
  permission: 'view' | 'edit'
  expiresAt?: string
  createdAt: string
}

/** 文件过滤参数 */
export interface FileFilterParams {
  path?: string
  type?: FileType
  search?: string
  starred?: boolean
  shared?: boolean
}

/** 文件统计 */
export interface FileStats {
  totalFiles: number
  totalFolders: number
  totalSize: number
  byType: Record<FileType, { count: number; size: number }>
}
