import { createSignal, createEffect, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { userService } from '~/services/users'
import { roleService } from '~/services/roles'
import { Card, CardContent, Button } from '~/components/ui'
import { Form, FormField } from '~/components/ui/Form'
import type { Role } from '~/types/auth'
import type { CreateUserData } from '~/services/users'

export default function CreateUserPage() {
  const navigate = useNavigate()

  const [roles, setRoles] = createSignal<Role[]>([])
  const [loading, setLoading] = createSignal(false)
  const [formErrors, setFormErrors] = createSignal<Record<string, string>>({})

  // 设置页面信息
  createEffect(() => {
    uiActions.setPageTitle('创建用户')
    uiActions.setBreadcrumbs([
      { label: '用户管理', href: '/users' },
      { label: '创建用户', href: '/users/new' },
    ])
  })

  // 加载角色列表
  createEffect(() => {
    loadRoles()
  })

  const loadRoles = async () => {
    try {
      const response = await roleService.getRoles({ page: 1, pageSize: 100 })
      setRoles(response.data.data.list)
    } catch (error) {
      console.error('Failed to load roles:', error)
      // 使用模拟数据
      setRoles([
        {
          id: '1',
          name: 'admin',
          label: '管理员',
          permissions: ['*'],
          description: '系统管理员',
        },
        {
          id: '2',
          name: 'manager',
          label: '经理',
          permissions: ['dashboard:view', 'users:view'],
          description: '部门经理',
        },
        {
          id: '3',
          name: 'user',
          label: '普通用户',
          permissions: ['dashboard:view'],
          description: '普通用户',
        },
      ])
    }
  }

  const formFields: FormField[] = [
    {
      name: 'name',
      label: '姓名',
      type: 'text',
      placeholder: '请输入用户姓名',
      required: true,
      validation: {
        required: '请输入用户姓名',
        minLength: { value: 2, message: '姓名至少需要2个字符' },
        maxLength: { value: 50, message: '姓名不能超过50个字符' },
      },
    },
    {
      name: 'email',
      label: '邮箱地址',
      type: 'email',
      placeholder: '请输入邮箱地址',
      required: true,
      validation: {
        required: '请输入邮箱地址',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '请输入有效的邮箱地址',
        },
      },
    },
    {
      name: 'phone',
      label: '手机号码',
      type: 'text',
      placeholder: '请输入手机号码',
      validation: {
        pattern: {
          value: /^1[3-9]\d{9}$/,
          message: '请输入有效的手机号码',
        },
      },
    },
    {
      name: 'roleId',
      label: '角色',
      type: 'select',
      placeholder: '请选择角色',
      required: true,
      options: roles().map((role) => ({
        value: role.id,
        label: role.label,
      })),
      validation: {
        required: '请选择用户角色',
      },
    },
    {
      name: 'department',
      label: '部门',
      type: 'text',
      placeholder: '请输入部门名称',
    },
    {
      name: 'position',
      label: '职位',
      type: 'text',
      placeholder: '请输入职位',
    },
    {
      name: 'bio',
      label: '个人简介',
      type: 'textarea',
      placeholder: '请输入个人简介（可选）',
      validation: {
        maxLength: { value: 500, message: '个人简介不能超过500个字符' },
      },
    },
  ]

  const handleSubmit = async (data: Record<string, any>) => {
    setLoading(true)
    setFormErrors({})

    try {
      const userData: CreateUserData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        roleId: data.roleId,
        department: data.department,
        position: data.position,
        bio: data.bio,
      }

      await userService.createUser(userData)

      uiActions.addNotification({
        type: 'success',
        title: '创建成功',
        message: '用户创建成功',
      })

      // 返回用户列表
      navigate('/users')
    } catch (error: any) {
      console.error('Failed to create user:', error)

      // 处理表单错误
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors)
      } else {
        uiActions.addNotification({
          type: 'error',
          title: '创建失败',
          message: error.message || '创建用户失败',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/users')
  }

  return (
    <>
      <Title>创建用户 - HaloLight</Title>

      <div class="max-w-2xl mx-auto">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">创建用户</h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">创建新的用户账户</p>
        </div>

        <Card>
          <CardContent class="p-6">
            <Show
              when={roles().length > 0}
              fallback={
                <div class="text-center py-8">
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
              <Form
                fields={formFields}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading()}
                errors={formErrors()}
                submitText="创建用户"
                cancelText="返回"
              />
            </Show>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
