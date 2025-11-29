import { createSignal, createEffect, For, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { userService } from '~/services/users'
import { Button, Card, CardContent, Input } from '~/components/ui'
import type { User, UserStatus } from '~/types/auth'
import type { PaginationParams } from '~/types/api'

export default function UsersPage() {
  const navigate = useNavigate()

  const [users, setUsers] = createSignal<User[]>([])
  const [loading, setLoading] = createSignal(true)
  const [searchTerm, setSearchTerm] = createSignal('')
  const [statusFilter, setStatusFilter] = createSignal<UserStatus | ''>('')
  const [currentPage, setCurrentPage] = createSignal(1)
  const [pageSize] = createSignal(10)
  const [total, setTotal] = createSignal(0)

  // 设置页面信息
  createEffect(() => {
    uiActions.setPageTitle('用户管理')
    uiActions.setBreadcrumbs([{ label: '用户管理', href: '/users' }])
  })

  // 加载用户数据
  createEffect(() => {
    loadUsers()
  })

  const loadUsers = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage(),
        pageSize: pageSize(),
        search: searchTerm() || undefined,
        status: statusFilter() || undefined,
      }

      const response = await userService.getUsers(params as any)
      setUsers(response.data.data.list)
      setTotal(response.data.data.total)
    } catch (error) {
      console.error('Failed to load users:', error)
      // 使用模拟数据
      setUsers(generateMockUsers())
      setTotal(25)
    } finally {
      setLoading(false)
    }
  }

  const generateMockUsers = (): User[] => {
    return [
      {
        id: '1',
        name: '张三',
        email: 'zhang@example.com',
        phone: '13800138000',
        avatar: 'https://ui-avatars.com/api/?name=张三&background=random',
        role: {
          id: '1',
          name: 'admin',
          label: '管理员',
          permissions: ['*'],
          description: '系统管理员',
        },
        status: 'active',
        department: '技术部',
        position: '经理',
        bio: '技术部经理，负责团队管理',
        createdAt: '2024-01-15T10:00:00Z',
        lastLoginAt: '2024-11-30T15:30:00Z',
      },
      {
        id: '2',
        name: '李四',
        email: 'li@example.com',
        phone: '13900139000',
        avatar: 'https://ui-avatars.com/api/?name=李四&background=random',
        role: {
          id: '2',
          name: 'manager',
          label: '经理',
          permissions: ['dashboard:view', 'users:view', 'users:create'],
          description: '部门经理',
        },
        status: 'active',
        department: '市场部',
        position: '主管',
        bio: '市场部主管',
        createdAt: '2024-02-20T09:00:00Z',
        lastLoginAt: '2024-11-29T18:45:00Z',
      },
      {
        id: '3',
        name: '王五',
        email: 'wang@example.com',
        status: 'inactive',
        role: {
          id: '3',
          name: 'user',
          label: '普通用户',
          permissions: ['dashboard:view'],
          description: '普通用户',
        },
        createdAt: '2024-03-10T14:20:00Z',
        lastLoginAt: '2024-10-15T12:00:00Z',
      },
    ]
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadUsers()
  }

  const handleStatusFilter = (status: UserStatus | '') => {
    setStatusFilter(status)
    setCurrentPage(1)
    loadUsers()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadUsers()
  }

  const handleCreateUser = () => {
    navigate('/users/new')
  }

  const handleEditUser = (id: string) => {
    navigate(`/users/${id}/edit`)
  }

  const handleDeleteUser = async (id: string) => {
    if (confirm('确定要删除这个用户吗？')) {
      try {
        await userService.deleteUser(id)
        uiActions.addNotification({
          type: 'success',
          title: '删除成功',
          message: '用户已删除',
        })
        loadUsers()
      } catch (error) {
        console.error('Failed to delete user:', error)
        uiActions.addNotification({
          type: 'error',
          title: '删除失败',
          message: '删除用户时出错',
        })
      }
    }
  }

  const handleEnableUser = async (id: string) => {
    try {
      await userService.enableUser(id)
      uiActions.addNotification({
        type: 'success',
        title: '启用成功',
        message: '用户已启用',
      })
      loadUsers()
    } catch (error) {
      console.error('Failed to enable user:', error)
    }
  }

  const handleDisableUser = async (id: string) => {
    try {
      await userService.disableUser(id)
      uiActions.addNotification({
        type: 'success',
        title: '禁用成功',
        message: '用户已禁用',
      })
      loadUsers()
    } catch (error) {
      console.error('Failed to disable user:', error)
    }
  }

  const getStatusBadge = (status: UserStatus) => {
    const statusMap = {
      active: { text: '活跃', class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      inactive: { text: '未激活', class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
      suspended: { text: '已禁用', class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
    }

    const statusInfo = statusMap[status]
    return (
      <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    )
  }

  const totalPages = () => Math.ceil(total() / pageSize())

  return (
    <>
      <Title>用户管理 - HaloLight</Title>

      <div class="space-y-6">
        {/* 页面头部 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">用户管理</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">管理系统中的所有用户账户</p>
          </div>
          <Button onClick={handleCreateUser} variant="primary">
            添加用户
          </Button>
        </div>

        {/* 搜索和筛选 */}
        <Card>
          <CardContent class="p-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <Input
                  placeholder="搜索用户姓名或邮箱..."
                  value={searchTerm()}
                  onInput={(e) => setSearchTerm(e.currentTarget.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />
              </div>
              <div class="flex gap-2">
                <select
                  value={statusFilter()}
                  onChange={(e) => handleStatusFilter(e.currentTarget.value as UserStatus | '')}
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">所有状态</option>
                  <option value="active">活跃</option>
                  <option value="inactive">未激活</option>
                  <option value="suspended">已禁用</option>
                </select>
                <Button onClick={handleSearch} variant="secondary">
                  搜索
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 用户列表 */}
        <Card>
          <CardContent class="p-0">
            <Show
              when={!loading()}
              fallback={
                <div class="p-8 text-center">
                  <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p class="text-gray-600 dark:text-gray-400">正在加载用户数据...</p>
                </div>
              }
            >
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        用户
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        角色
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        状态
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        注册时间
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        最后登录
                      </th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    <For each={users()}>
                      {(user) => (
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <img
                                class="h-10 w-10 rounded-full"
                                src={
                                  user.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                                }
                                alt={user.name}
                              />
                              <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900 dark:text-white">{user.role?.label || '未分配'}</div>
                            <Show when={user.department}>
                              <div class="text-sm text-gray-500 dark:text-gray-400">
                                {user.department} - {user.position}
                              </div>
                            </Show>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <Show when={user.lastLoginAt} fallback={<span class="text-gray-400">从未登录</span>}>
                              {(lastLoginAt) => new Date(lastLoginAt()).toLocaleDateString('zh-CN')}
                            </Show>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex items-center justify-end space-x-2">
                              <Button onClick={() => handleEditUser(user.id)} variant="ghost" size="sm">
                                编辑
                              </Button>
                              <Show
                                when={user.status === 'suspended'}
                                fallback={
                                  <Button
                                    onClick={() => handleDisableUser(user.id)}
                                    variant="ghost"
                                    size="sm"
                                    class="text-red-600 hover:text-red-700"
                                  >
                                    禁用
                                  </Button>
                                }
                              >
                                <Button
                                  onClick={() => handleEnableUser(user.id)}
                                  variant="ghost"
                                  size="sm"
                                  class="text-green-600 hover:text-green-700"
                                >
                                  启用
                                </Button>
                              </Show>
                              <Button
                                onClick={() => handleDeleteUser(user.id)}
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
