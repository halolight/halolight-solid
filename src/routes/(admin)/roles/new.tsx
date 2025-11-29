import { createSignal, createEffect, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { roleService } from '~/services/roles'
import { Card, CardContent, Button, Input, Textarea } from '~/components/ui'
import { PermissionSelector } from '~/components/ui/PermissionSelector'
import type { CreateRoleData } from '~/services/roles'

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

export default function CreateRolePage() {
  const navigate = useNavigate()

  const [loading, setLoading] = createSignal(false)
  const [formData, setFormData] = createSignal({
    name: '',
    label: '',
    description: '',
    permissions: [],
  })
  const [formErrors, setFormErrors] = createSignal<Record<string, string>>({})

  // 设置页面信息
  createEffect(() => {
    uiActions.setPageTitle('创建角色')
    uiActions.setBreadcrumbs([
      { label: '角色管理', href: '/roles' },
      { label: '创建角色', href: '/roles/new' },
    ])
  })

  const validateForm = () => {
    const errors: Record<string, string> = {}
    const data = formData()

    if (!data.name.trim()) {
      errors.name = '请输入角色标识'
    } else if (!/^[a-zA-Z0-9_-]+$/.test(data.name)) {
      errors.name = '角色标识只能包含字母、数字、下划线和连字符'
    } else if (data.name.length < 2) {
      errors.name = '角色标识至少需要2个字符'
    } else if (data.name.length > 50) {
      errors.name = '角色标识不能超过50个字符'
    }

    if (!data.label.trim()) {
      errors.label = '请输入角色名称'
    } else if (data.label.length < 2) {
      errors.label = '角色名称至少需要2个字符'
    } else if (data.label.length > 50) {
      errors.label = '角色名称不能超过50个字符'
    }

    if (data.description && data.description.length > 500) {
      errors.description = '角色描述不能超过500个字符'
    }

    if (data.permissions.length === 0) {
      errors.permissions = '请至少选择一项权限'
    }

    return errors
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setLoading(true)
    setFormErrors({})

    try {
      const roleData: CreateRoleData = {
        name: formData().name,
        label: formData().label,
        description: formData().description,
        permissions: formData().permissions,
      }

      await roleService.createRole(roleData)

      uiActions.addNotification({
        type: 'success',
        title: '创建成功',
        message: '角色创建成功',
      })

      // 返回角色列表
      navigate('/roles')
    } catch (error: any) {
      console.error('Failed to create role:', error)

      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors)
      } else {
        uiActions.addNotification({
          type: 'error',
          title: '创建失败',
          message: error.message || '创建角色失败',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/roles')
  }

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    // 清除该字段的错误信息
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }

  const handlePermissionsChange = (permissions: string[]) => {
    setFormData((prev) => ({ ...prev, permissions }))
    // 清除权限错误信息
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.permissions
      return newErrors
    })
  }

  return (
    <>
      <Title>创建角色 - HaloLight</Title>

      <div class="max-w-2xl mx-auto">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">创建角色</h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">创建新的角色并配置权限</p>
        </div>

        <Card>
          <CardContent class="p-6">
            <form onSubmit={handleSubmit} class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  角色标识
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData().name}
                  onInput={(e) => handleInputChange('name', e.currentTarget.value)}
                  placeholder="请输入角色标识（如：admin）"
                  class={formErrors().name ? 'border-red-300' : ''}
                />
                <Show when={formErrors().name}>
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors().name}</p>
                </Show>
              </div>

              <div>
                <label for="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  角色名称
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <Input
                  id="label"
                  name="label"
                  type="text"
                  value={formData().label}
                  onInput={(e) => handleInputChange('label', e.currentTarget.value)}
                  placeholder="请输入角色名称（如：管理员）"
                  class={formErrors().label ? 'border-red-300' : ''}
                />
                <Show when={formErrors().label}>
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors().label}</p>
                </Show>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  角色描述
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData().description}
                  onInput={(e) => handleInputChange('description', e.currentTarget.value)}
                  placeholder="请输入角色描述（可选）"
                  rows={4}
                  class={formErrors().description ? 'border-red-300' : ''}
                />
                <Show when={formErrors().description}>
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors().description}</p>
                </Show>
              </div>

              <PermissionSelector
                name="permissions"
                label="权限配置"
                value={formData().permissions}
                options={AVAILABLE_PERMISSIONS}
                onChange={handlePermissionsChange}
                error={formErrors().permissions}
                required={true}
              />

              <div class="flex justify-end space-x-3 pt-6">
                <Button type="button" onClick={handleCancel} variant="secondary" disabled={loading()}>
                  返回
                </Button>
                <Button type="submit" variant="primary" disabled={loading()} loading={loading()}>
                  创建角色
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
