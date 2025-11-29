import { createSignal, createEffect, Show, onMount } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { roleService } from '~/services/roles'
import { Card, CardContent, Button } from '~/components/ui'
import { Form, FormField } from '~/components/ui/Form'
import type { Role } from '~/types/auth'
import type { UpdateRoleData } from '~/services/roles'

const AVAILABLE_PERMISSIONS = [
  { value: '*', label: '所有权限' },
  { value: 'dashboard:view', label: '查看仪表盘' },
  { value: 'users:view', label: '查看用户' },
  { value: 'users:create', label: '创建用户' },
  { value: 'users:edit', label: '编辑用户' },
  { value: 'users:delete', label: '删除用户' },
  { value: 'roles:view', label: '查看角色' },
  { value: 'roles:create', label: '创建角色' },
  { value: 'roles:edit', label: '编辑角色' },
  { value: 'roles:delete', label: '删除角色' },
  { value: 'analytics:view', label: '查看分析' },
  { value: 'settings:view', label: '查看设置' },
  { value: 'settings:edit', label: '编辑设置' },
]

export default function EditRolePage() {
  const navigate = useNavigate()
  const params = useParams()

  const [role, setRole] = createSignal<Role | null>(null)
  const [loading, setLoading] = createSignal(false)
  const [formErrors, setFormErrors] = createSignal<Record<string, string>>({})
  const [initialLoading, setInitialLoading] = createSignal(true)

  // 设置页面信息
  createEffect(() => {
    uiActions.setPageTitle('编辑角色')
    uiActions.setBreadcrumbs([
      { label: '角色管理', href: '/roles' },
      { label: '编辑角色', href: `/roles/${params.id}/edit` },
    ])
  })

  // 加载角色数据
  onMount(async () => {
    try {
      const response = await roleService.getRole(params.id)
      setRole(response.data)
    } catch (error) {
      console.error('Failed to load role:', error)
      uiActions.addNotification({
        type: 'error',
        title: '加载失败',
        message: '无法加载角色数据',
      })
      navigate('/roles')
    } finally {
      setInitialLoading(false)
    }
  })

  const formFields: FormField[] = [
    {
      name: 'name',
      label: '角色标识',
      type: 'text',
      placeholder: '请输入角色标识（如：admin）',
      required: true,
      validation: {
        required: '请输入角色标识',
        pattern: {
          value: /^[a-zA-Z0-9_-]+$/,
          message: '角色标识只能包含字母、数字、下划线和连字符',
        },
        minLength: { value: 2, message: '角色标识至少需要2个字符' },
        maxLength: { value: 50, message: '角色标识不能超过50个字符' },
      },
    },
    {
      name: 'label',
      label: '角色名称',
      type: 'text',
      placeholder: '请输入角色名称（如：管理员）',
      required: true,
      validation: {
        required: '请输入角色名称',
        minLength: { value: 2, message: '角色名称至少需要2个字符' },
        maxLength: { value: 50, message: '角色名称不能超过50个字符' },
      },
    },
    {
      name: 'description',
      label: '角色描述',
      type: 'textarea',
      placeholder: '请输入角色描述（可选）',
      validation: {
        maxLength: { value: 500, message: '角色描述不能超过500个字符' },
      },
    },
    {
      name: 'permissions',
      label: '权限配置',
      type: 'select',
      placeholder: '请选择权限',
      required: true,
      options: AVAILABLE_PERMISSIONS,
      validation: {
        required: '请至少选择一项权限',
      },
    },
  ]

  const handleSubmit = async (data: Record<string, any>) => {
    setLoading(true)
    setFormErrors({})

    try {
      // 转换权限数据格式
      const permissions = data.permissions === '*' ? ['*'] : [data.permissions]

      const roleData: UpdateRoleData = {
        name: data.name,
        label: data.label,
        description: data.description,
        permissions,
      }

      await roleService.updateRole(params.id, roleData)

      uiActions.addNotification({
        type: 'success',
        title: '更新成功',
        message: '角色更新成功',
      })

      // 返回角色列表
      navigate('/roles')
    } catch (error: any) {
      console.error('Failed to update role:', error)

      // 处理表单错误
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors)
      } else {
        uiActions.addNotification({
          type: 'error',
          title: '更新失败',
          message: error.message || '更新角色失败',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/roles')
  }

  const getInitialFormData = () => {
    const currentRole = role()
    if (!currentRole) return {}

    // 确定默认选中的权限
    const defaultPermission = currentRole.permissions.includes('*') ? '*' : currentRole.permissions[0] || ''

    return {
      name: currentRole.name,
      label: currentRole.label,
      description: currentRole.description || '',
      permissions: defaultPermission,
    }
  }

  return (
    <>
      <Title>编辑角色 - HaloLight</Title>

      <div class="max-w-2xl mx-auto">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">编辑角色</h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">编辑角色信息和权限配置</p>
        </div>

        <Show
          when={!initialLoading()}
          fallback={
            <Card>
              <CardContent class="p-8">
                <div class="text-center">
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
              </CardContent>
            </Card>
          }
        >
          <Card>
            <CardContent class="p-6">
              <Form
                fields={formFields}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading()}
                errors={formErrors()}
                submitText="更新角色"
                cancelText="返回"
                {...getInitialFormData()}
              />
            </CardContent>
          </Card>
        </Show>
      </div>
    </>
  )
}
