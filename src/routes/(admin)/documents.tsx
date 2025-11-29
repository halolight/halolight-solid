import { createSignal, createEffect, For, Show } from 'solid-js'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { Button, Card, CardContent, Input } from '~/components/ui'
import type { Document, DocumentType } from '~/types/document'

// 模拟数据
const mockDocuments: Document[] = [
  {
    id: '1',
    title: '2024年度工作计划',
    type: 'document',
    size: 245760,
    shared: true,
    tags: ['工作', '计划'],
    views: 128,
    createdAt: '2024-11-20T10:00:00Z',
    updatedAt: '2024-11-28T15:30:00Z',
    author: { id: '1', name: '张三', avatar: 'https://ui-avatars.com/api/?name=张三' },
  },
  {
    id: '2',
    title: '产品需求文档 v2.0',
    type: 'document',
    size: 512000,
    shared: true,
    tags: ['产品', 'PRD'],
    views: 256,
    createdAt: '2024-11-18T09:00:00Z',
    updatedAt: '2024-11-29T11:20:00Z',
    author: { id: '2', name: '李四', avatar: 'https://ui-avatars.com/api/?name=李四' },
  },
  {
    id: '3',
    title: '技术架构设计',
    type: 'document',
    size: 384000,
    shared: false,
    tags: ['技术', '架构'],
    views: 89,
    createdAt: '2024-11-15T14:00:00Z',
    updatedAt: '2024-11-27T16:45:00Z',
    author: { id: '1', name: '张三', avatar: 'https://ui-avatars.com/api/?name=张三' },
  },
  {
    id: '4',
    title: '市场分析报告.pdf',
    type: 'pdf',
    size: 1048576,
    shared: true,
    tags: ['市场', '报告'],
    views: 312,
    createdAt: '2024-11-10T08:30:00Z',
    updatedAt: '2024-11-25T10:00:00Z',
    author: { id: '3', name: '王五', avatar: 'https://ui-avatars.com/api/?name=王五' },
  },
  {
    id: '5',
    title: '财务报表Q3.xlsx',
    type: 'spreadsheet',
    size: 768000,
    shared: false,
    tags: ['财务', '报表'],
    views: 45,
    createdAt: '2024-11-05T11:00:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    author: { id: '4', name: '赵六', avatar: 'https://ui-avatars.com/api/?name=赵六' },
  },
]

const typeIcons: Record<DocumentType, string> = {
  pdf: '📄',
  doc: '📝',
  document: '📝',
  image: '🖼️',
  spreadsheet: '📊',
  presentation: '📽️',
  code: '💻',
  other: '📎',
}

export default function DocumentsPage() {
  const [documents, setDocuments] = createSignal<Document[]>(mockDocuments)
  const [loading, setLoading] = createSignal(true)
  const [searchTerm, setSearchTerm] = createSignal('')
  const [viewMode, setViewMode] = createSignal<'grid' | 'list'>('grid')

  createEffect(() => {
    uiActions.setPageTitle('文档管理')
    uiActions.setBreadcrumbs([{ label: '文档管理', href: '/documents' }])
  })

  createEffect(() => {
    setTimeout(() => setLoading(false), 500)
  })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const filteredDocuments = () => {
    const term = searchTerm().toLowerCase()
    if (!term) return documents()
    return documents().filter(
      (doc) => doc.title?.toLowerCase().includes(term) || doc.tags?.some((tag) => tag.toLowerCase().includes(term))
    )
  }

  return (
    <>
      <Title>文档管理 - HaloLight</Title>

      <div class="space-y-6">
        {/* 页面头部 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">文档管理</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">管理和共享您的文档</p>
          </div>
          <Button variant="primary">新建文档</Button>
        </div>

        {/* 搜索和筛选 */}
        <Card>
          <CardContent class="p-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <Input
                  placeholder="搜索文档..."
                  value={searchTerm()}
                  onInput={(e) => setSearchTerm(e.currentTarget.value)}
                />
              </div>
              <div class="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  class={`p-2 rounded-md ${viewMode() === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  class={`p-2 rounded-md ${viewMode() === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

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
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <For each={filteredDocuments()}>
                {(doc) => (
                  <Card class="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent class="p-4">
                      <div class="flex items-start space-x-3">
                        <span class="text-3xl">{typeIcons[doc.type]}</span>
                        <div class="flex-1 min-w-0">
                          <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.title}</h3>
                          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatFileSize(doc.size)} · {formatDate(doc.updatedAt)}
                          </p>
                          <div class="flex items-center mt-2 space-x-2">
                            <Show when={doc.shared}>
                              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                已共享
                              </span>
                            </Show>
                            <span class="text-xs text-gray-400">{doc.views} 次查看</span>
                          </div>
                        </div>
                      </div>
                      <div class="mt-3 flex items-center">
                        <img class="w-6 h-6 rounded-full" src={doc.author?.avatar} alt={doc.author?.name} />
                        <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">{doc.author?.name}</span>
                      </div>
                    </CardContent>
                  </Card>
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
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        文档名称
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        作者
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        大小
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        更新时间
                      </th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <For each={filteredDocuments()}>
                      {(doc) => (
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <span class="text-xl mr-3">{typeIcons[doc.type]}</span>
                              <div>
                                <div class="text-sm font-medium text-gray-900 dark:text-white">{doc.title}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">
                                  {doc.tags?.map((tag) => `#${tag}`).join(' ')}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <img class="w-6 h-6 rounded-full" src={doc.author?.avatar} alt="" />
                              <span class="ml-2 text-sm text-gray-900 dark:text-white">{doc.author?.name}</span>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(doc.size)}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(doc.updatedAt)}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-right">
                            <Button variant="ghost" size="sm">
                              查看
                            </Button>
                            <Button variant="ghost" size="sm">
                              编辑
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
