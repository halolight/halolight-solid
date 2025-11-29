import { createSignal, createEffect, For, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { roleService } from '~/services/roles'
import { Button, Card, CardContent, Input } from '~/components/ui'
import type { Role } from '~/types/auth'
import type { PaginationParams } from '~/types/api'

export default function RolesPage() {
  const navigate = useNavigate()

  const [roles, setRoles] = createSignal<Role[]>([])
  const [loading, setLoading] = createSignal(true)
  const [searchTerm, setSearchTerm] = createSignal('')
  const [currentPage, setCurrentPage] = createSignal(1)
  const [pageSize] = createSignal(10)
  const [total, setTotal] = createSignal(0)

  // 设置页面信息
  createEffect(() => {
    uiActions.setPageTitle('角色管理')
    uiActions.setBreadcrumbs([{ label: '角色管理', href: '/roles' }])
  })

  // 加载角色数据
  createEffect(() => {
    loadRoles()
  })

  const loadRoles = async () => {
    setLoading(true)
    try {
      const params: PaginationParams = {
        page: currentPage(),
        pageSize: pageSize(),
        search: searchTerm() || undefined,
      }

      const response = await roleService.getRoles(params)
      setRoles(response.data.data.list)
      setTotal(response.data.data.total)
    } catch (error) {
      console.error('Failed to load roles:', error)
      // 使用模拟数据
      setRoles([
        {
          id: '1',
          name: 'admin',
          label: '管理员',
          permissions: ['*'],
          description: '系统管理员，拥有所有权限',
        },
        {
          id: '2',
          name: 'manager',
          label: '经理',
          permissions: ['dashboard:view', 'users:view', 'users:create', 'analytics:view'],
          description: '部门经理，管理用户和查看数据',
        },
        {
          id: '3',
          name: 'user',
          label: '普通用户',
          permissions: ['dashboard:view'],
          description: '普通用户，只能查看仪表盘',
        },
      ])
      setTotal(3)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadRoles()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadRoles()
  }

  const handleCreateRole = () => {
    navigate('/roles/new')
  }

  const handleEditRole = (id: string) => {
    navigate(`/roles/${id}/edit`)
  }

  const handleDeleteRole = async (id: string) => {
    if (confirm('确定要删除这个角色吗？此操作不可恢复。')) {
      try {
        await roleService.deleteRole(id)
        uiActions.addNotification({
          type: 'success',
          title: '删除成功',
          message: '角色已删除',
        })
        loadRoles()
      } catch (error) {
        console.error('Failed to delete role:', error)
        uiActions.addNotification({
          type: 'error',
          title: '删除失败',
          message: '删除角色失败',
        })
      }
    }
  }

  const getPermissionCount = (role: Role) => {
    if (role.permissions.includes('*')) {
      return '所有权限'
    }
    return `${role.permissions.length} 个权限`
  }

  const totalPages = () => Math.ceil(total() / pageSize())

  return (
    <>
      <Title>角色管理 - HaloLight</Title>

      <div class="space-y-6">
        {/* 页面头部 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">角色管理</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">管理系统中的角色和权限</p>
          </div>
          <Button onClick={handleCreateRole} variant="primary">
            添加角色
          </Button>
        </div>

        {/* 搜索 */}
        <Card>
          <CardContent class="p-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <Input
                  placeholder="搜索角色名称..."
                  value={searchTerm()}
                  onInput={(e) => setSearchTerm(e.currentTarget.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />
              </div>
              <Button onClick={handleSearch} variant="secondary">
                搜索
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 角色列表 */}
        <Card>
          <CardContent class="p-0">
            <Show
              when={!loading()}
              fallback={
                <div class="p-8 text-center">
                  <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p class="text-gray-600 dark:text-gray-400">正在加载角色数据...</p>
                </div>
              }
            >
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        角色名称
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        描述
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        权限数量
                      </th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    <For each={roles()}>
                      {(role) => (
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <div class="flex-shrink-0 h-10 w-10">
                                <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                  <svg
                                    class="h-5 w-5 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">{role.label}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">{role.name}</div>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="text-sm text-gray-900 dark:text-white">{role.description || '暂无描述'}</div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              {getPermissionCount(role)}
                            </span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex items-center justify-end space-x-2">
                              <Button onClick={() => handleEditRole(role.id)} variant="ghost" size="sm">
                                编辑
                              </Button>
                              <Button
                                onClick={() => handleDeleteRole(role.id)}
                                variant="ghost"
                                size="sm"
                                class="text-red-600 hover:text-red-700"
                              >
                                删除
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <Show when={total() > pageSize()}>
                <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700 dark:text-gray-400">
                      显示第 {(currentPage() - 1) * pageSize() + 1} 到 {Math.min(currentPage() * pageSize(), total())}{' '}
                      条，共 {total()} 条记录
                    </div>
                    <div class="flex space-x-2">
                      <Button
                        onClick={() => handlePageChange(currentPage() - 1)}
                        disabled={currentPage() === 1}
                        variant="secondary"
                      >
                        上一页
                      </Button>
                      <span class="flex items-center px-3 text-sm text-gray-700 dark:text-gray-400">
                        第 {currentPage()} 页，共 {totalPages()} 页
                      </span>
                      <Button
                        onClick={() => handlePageChange(currentPage() + 1)}
                        disabled={currentPage() === totalPages()}
                        variant="secondary"
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                </div>
              </Show>
            </Show>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
