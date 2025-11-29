import { createSignal, createEffect, For, Show } from 'solid-js'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { Button, Card, CardContent, Input } from '~/components/ui'
import type { FileItem, FileType, StorageInfo } from '~/types/file'

// 模拟数据
const mockFiles: FileItem[] = [
  {
    id: '1',
    name: '项目文档',
    type: 'folder',
    size: null,
    items: 12,
    path: '/项目文档',
    createdAt: '2024-11-01',
    updatedAt: '2024-11-30',
  },
  {
    id: '2',
    name: '产品图片',
    type: 'folder',
    size: null,
    items: 45,
    path: '/产品图片',
    createdAt: '2024-10-15',
    updatedAt: '2024-11-28',
  },
  {
    id: '3',
    name: '视频素材',
    type: 'folder',
    size: null,
    items: 8,
    path: '/视频素材',
    createdAt: '2024-09-20',
    updatedAt: '2024-11-25',
  },
  {
    id: '4',
    name: '产品宣传图.png',
    type: 'image',
    size: 2458624,
    items: null,
    path: '/产品宣传图.png',
    thumbnail: 'https://picsum.photos/200',
    createdAt: '2024-11-28',
    updatedAt: '2024-11-28',
  },
  {
    id: '5',
    name: '年度报告.pdf',
    type: 'document',
    size: 5242880,
    items: null,
    path: '/年度报告.pdf',
    createdAt: '2024-11-20',
    updatedAt: '2024-11-20',
  },
  {
    id: '6',
    name: '宣传视频.mp4',
    type: 'video',
    size: 52428800,
    items: null,
    path: '/宣传视频.mp4',
    createdAt: '2024-11-15',
    updatedAt: '2024-11-15',
  },
  {
    id: '7',
    name: '备份文件.zip',
    type: 'archive',
    size: 104857600,
    items: null,
    path: '/备份文件.zip',
    createdAt: '2024-11-10',
    updatedAt: '2024-11-10',
  },
  {
    id: '8',
    name: '音频素材.mp3',
    type: 'audio',
    size: 8388608,
    items: null,
    path: '/音频素材.mp3',
    createdAt: '2024-11-05',
    updatedAt: '2024-11-05',
  },
]

const mockStorageInfo: StorageInfo = {
  used: 1073741824 * 2.5, // 2.5 GB
  total: 1073741824 * 10, // 10 GB
  breakdown: {
    images: 524288000,
    videos: 1073741824,
    audio: 104857600,
    documents: 314572800,
    archives: 524288000,
    others: 52428800,
  },
}

const typeIcons: Record<FileType, { icon: string; color: string }> = {
  folder: { icon: '📁', color: 'text-yellow-500' },
  image: { icon: '🖼️', color: 'text-green-500' },
  video: { icon: '🎬', color: 'text-purple-500' },
  audio: { icon: '🎵', color: 'text-pink-500' },
  archive: { icon: '📦', color: 'text-orange-500' },
  document: { icon: '📄', color: 'text-blue-500' },
  other: { icon: '📎', color: 'text-gray-500' },
}

export default function FilesPage() {
  const [files, setFiles] = createSignal<FileItem[]>(mockFiles)
  const [loading, setLoading] = createSignal(true)
  const [currentPath, setCurrentPath] = createSignal('/')
  const [selectedFiles, setSelectedFiles] = createSignal<Set<string>>(new Set())
  const [viewMode, setViewMode] = createSignal<'grid' | 'list'>('grid')

  createEffect(() => {
    uiActions.setPageTitle('文件存储')
    uiActions.setBreadcrumbs([{ label: '文件存储', href: '/files' }])
  })

  createEffect(() => {
    setTimeout(() => setLoading(false), 500)
  })

  const formatFileSize = (bytes: number | null) => {
    if (bytes === null) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN')
  }

  const storagePercentage = () => {
    return ((mockStorageInfo.used / mockStorageInfo.total) * 100).toFixed(1)
  }

  const toggleFileSelection = (id: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <>
      <Title>文件存储 - HaloLight</Title>

      <div class="space-y-6">
        {/* 页面头部 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">文件存储</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">管理您的文件和文件夹</p>
          </div>
          <div class="mt-4 sm:mt-0 flex gap-2">
            <Button variant="secondary">新建文件夹</Button>
            <Button variant="primary">上传文件</Button>
          </div>
        </div>

        {/* 存储信息 */}
        <Card>
          <CardContent class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">存储空间</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(mockStorageInfo.used)} / {formatFileSize(mockStorageInfo.total)}
              </span>
            </div>
            <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${storagePercentage()}%` }}
              ></div>
            </div>
            <div class="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
              <div class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                <span class="text-gray-600 dark:text-gray-400">
                  图片 {formatFileSize(mockStorageInfo.breakdown.images)}
                </span>
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                <span class="text-gray-600 dark:text-gray-400">
                  视频 {formatFileSize(mockStorageInfo.breakdown.videos)}
                </span>
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-pink-500 rounded-full mr-1"></span>
                <span class="text-gray-600 dark:text-gray-400">
                  音频 {formatFileSize(mockStorageInfo.breakdown.audio)}
                </span>
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                <span class="text-gray-600 dark:text-gray-400">
                  文档 {formatFileSize(mockStorageInfo.breakdown.documents)}
                </span>
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                <span class="text-gray-600 dark:text-gray-400">
                  压缩包 {formatFileSize(mockStorageInfo.breakdown.archives)}
                </span>
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
                <span class="text-gray-600 dark:text-gray-400">
                  其他 {formatFileSize(mockStorageInfo.breakdown.others)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 路径导航 */}
        <div class="flex items-center space-x-2 text-sm">
          <button class="text-blue-600 hover:text-blue-700 dark:text-blue-400">根目录</button>
          <Show when={currentPath() !== '/'}>
            <span class="text-gray-400">/</span>
            <span class="text-gray-600 dark:text-gray-400">{currentPath()}</span>
          </Show>
        </div>

        <Show
          when={!loading()}
          fallback={
            <div class="flex items-center justify-center h-64">
              <div class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          }
        >
          {/* 网格视图 */}
          <Show when={viewMode() === 'grid'}>
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              <For each={files()}>
                {(file) => (
                  <div
                    class={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedFiles().has(file.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-transparent bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                    onClick={() => (file.type === 'folder' ? null : toggleFileSelection(file.id))}
                    onDblClick={() => file.type === 'folder' && setCurrentPath(file.path)}
                  >
                    <div class="flex flex-col items-center">
                      <span class="text-4xl mb-2">{typeIcons[file.type].icon}</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white text-center truncate w-full">
                        {file.name}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {file.type === 'folder' ? `${file.items} 项` : formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          {/* 列表视图 */}
          <Show when={viewMode() === 'list'}>
            <Card>
              <CardContent class="p-0">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th class="w-8 px-4 py-3">
                        <input type="checkbox" class="rounded" />
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        名称
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        大小
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        修改日期
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <For each={files()}>
                      {(file) => (
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td class="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedFiles().has(file.id)}
                              onChange={() => toggleFileSelection(file.id)}
                              class="rounded"
                            />
                          </td>
                          <td class="px-4 py-3">
                            <div class="flex items-center">
                              <span class="text-xl mr-3">{typeIcons[file.type].icon}</span>
                              <span class="text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                            </div>
                          </td>
                          <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {file.type === 'folder' ? `${file.items} 项` : formatFileSize(file.size)}
                          </td>
                          <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(file.updatedAt)}
                          </td>
                          <td class="px-4 py-3 text-right">
                            <Button variant="ghost" size="sm">
                              下载
                            </Button>
                            <Button variant="ghost" size="sm">
                              删除
                            </Button>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </Show>
        </Show>
      </div>
    </>
  )
}
