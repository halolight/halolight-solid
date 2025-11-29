import Mock from 'mockjs'
import type { User, Permission, Role } from '~/types/auth'
import type { DashboardStats } from '~/types/dashboard'
import type { CalendarEvent } from '~/types/calendar'
import type { Document, DocumentFolder } from '~/types/document'
import type { Message, Conversation } from '~/types/message'
import type { FileItem } from '~/types/file'
import type { Notification } from '~/types/notification'

// 设置Mock.js配置
Mock.setup({
  timeout: '200-600', // 模拟网络延迟
})

// 模拟角色数据
const roles: Role[] = [
  {
    id: '1',
    name: 'admin',
    label: '管理员',
    description: '系统管理员，拥有所有权限',
    permissions: ['*'] as Permission[],
  },
  {
    id: '2',
    name: 'manager',
    label: '经理',
    description: '部门经理，管理用户和查看数据',
    permissions: ['dashboard:view', 'users:view', 'users:create', 'users:edit', 'analytics:view'] as Permission[],
  },
  {
    id: '3',
    name: 'user',
    label: '普通用户',
    description: '普通用户，只能查看仪表盘',
    permissions: ['dashboard:view'] as Permission[],
  },
]

// 模拟用户数据
const generateUsers = (count: number): User[] => {
  return Mock.mock({
    [`users|${count}`]: [
      {
        'id|+1': 1,
        name: '@cname',
        email: '@email',
        phone: /^1[3-9]\d{9}$/,
        avatar: '@image("100x100", "#4A90E2", "#FFF", "Avatar")',
        role: () => roles[Mock.Random.integer(0, roles.length - 1)],
        'status|1': ['active', 'inactive', 'suspended'],
        department: '@pick(["技术部", "市场部", "销售部", "人事部"])',
        position: '@pick(["经理", "主管", "专员", "助理"])',
        bio: '@paragraph(1, 3)',
        createdAt: '@datetime',
        lastLoginAt: '@datetime',
      },
    ],
  }).users
}

// 模拟仪表盘统计数据
const generateDashboardStats = (): DashboardStats => {
  return Mock.mock({
    'totalUsers|1000-10000': 1000,
    'activeUsers|500-8000': 500,
    'totalRevenue|100000-1000000': 100000,
    'totalOrders|100-1000': 100,
    'conversionRate|1-10': 1,
    'recentOrders|10-100': 10,
    'pendingTasks|5-50': 5,
    'userGrowth|5-25': 5,
    'revenueGrowth|5-30': 5,
    'orderGrowth|5-20': 5,
    'rateGrowth|-5-15': -5,
  })
}

// 模拟图表数据
const generateChartData = (type: string, days: number = 30) => {
  const data = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]

    let value: number
    switch (type) {
      case 'user-growth':
        value = Mock.Random.integer(100, 500)
        break
      case 'revenue-trend':
        value = Mock.Random.integer(10000, 50000)
        break
      case 'order-stats':
        value = Mock.Random.integer(50, 200)
        break
      case 'conversion-rate':
        value = Mock.Random.float(1, 10)
        break
      default:
        value = Mock.Random.integer(100, 1000)
    }

    data.push({
      label: dateStr,
      value: value,
    })
  }

  return data
}

// 模拟最近用户
const generateRecentUsers = (limit: number = 10) => {
  return generateUsers(limit).map((user) => ({
    ...user,
    status: 'active' as const,
  }))
}

// 模拟通知消息
const generateNotifications = (limit: number = 10) => {
  return Mock.mock({
    [`notifications|${limit}`]: [
      {
        'id|+1': 1,
        title: '@pick(["系统更新", "新用户注册", "存储空间警告", "安全提醒", "数据备份完成"])',
        message: '@paragraph(1, 2)',
        type: '@pick(["info", "success", "warning", "error"])',
        'read|1-2': true,
        createdAt: '@datetime',
      },
    ],
  }).notifications
}

// 模拟待办任务
const generateTasks = (status: string = 'all') => {
  const tasks = Mock.mock({
    'tasks|10': [
      {
        'id|+1': 1,
        title: '@pick(["更新用户文档", "修复系统bug", "优化数据库性能", "部署新功能", "备份数据", "安全检查"])',
        description: '@paragraph(1, 2)',
        'completed|1-2': true,
        priority: '@pick(["low", "medium", "high"])',
        dueDate: '@datetime',
        createdAt: '@datetime',
      },
    ],
  }).tasks

  if (status !== 'all') {
    return tasks.filter((task: any) => task.completed === (status === 'completed'))
  }

  return tasks
}

// 模拟快捷操作
const generateQuickActions = () => {
  return [
    {
      id: 'add-user',
      title: '添加用户',
      description: '创建新用户账户',
      icon: 'user-plus',
      href: '/users/new',
    },
    {
      id: 'view-analytics',
      title: '查看分析',
      description: '查看详细数据分析',
      icon: 'chart-bar',
      href: '/analytics',
    },
    {
      id: 'system-settings',
      title: '系统设置',
      description: '配置系统参数',
      icon: 'cog',
      href: '/settings',
    },
    {
      id: 'manage-roles',
      title: '角色管理',
      description: '管理用户角色权限',
      icon: 'user-group',
      href: '/roles',
    },
  ]
}

// 模拟日历事件
const generateCalendarEvents = (count: number = 20): CalendarEvent[] => {
  const events: CalendarEvent[] = []
  const now = new Date()
  const types = ['meeting', 'task', 'reminder', 'holiday']
  const colors = ['blue', 'green', 'red', 'yellow', 'purple']

  for (let i = 0; i < count; i++) {
    const startDate = new Date(now.getTime() + Mock.Random.integer(-15, 30) * 24 * 60 * 60 * 1000)
    const endDate = new Date(startDate.getTime() + Mock.Random.integer(1, 4) * 60 * 60 * 1000)

    events.push({
      id: String(i + 1),
      title: Mock.Random.pick([
        '产品评审会议',
        '团队周会',
        '项目截止',
        '客户拜访',
        '代码审查',
        '技术分享',
        '培训课程',
        '假期',
      ]),
      description: Mock.Random.paragraph(1, 2),
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      allDay: Mock.Random.boolean(),
      type: Mock.Random.pick(types),
      color: Mock.Random.pick(colors),
      location: Mock.Random.pick(['会议室A', '会议室B', '线上会议', '客户办公室', '']),
      attendees: Mock.mock({
        'list|1-5': [
          {
            'id|+1': 100,
            name: '@cname',
            email: '@email',
            status: '@pick(["accepted", "declined", "pending"])',
          },
        ],
      }).list,
      reminders: [{ type: 'notification', minutes: 15 }],
      createdAt: Mock.Random.datetime(),
      updatedAt: Mock.Random.datetime(),
    })
  }

  return events
}

// 模拟文档数据
const generateDocuments = (count: number = 30): Document[] => {
  const documents: Document[] = []
  const types = ['word', 'excel', 'ppt', 'pdf', 'image', 'video', 'audio', 'archive', 'code', 'other']

  for (let i = 0; i < count; i++) {
    documents.push({
      id: String(i + 1),
      name:
        Mock.Random.pick(['产品需求文档', '技术方案', '会议纪要', '项目计划', '年度报告', '培训资料', '用户手册']) +
        '.' +
        Mock.Random.pick(['docx', 'xlsx', 'pptx', 'pdf']),
      type: Mock.Random.pick(types),
      size: Mock.Random.integer(10240, 10485760),
      path: '/documents/' + Mock.Random.word(5, 10),
      folderId: Mock.Random.pick(['1', '2', '3', null]),
      tags: Mock.mock({ 'list|0-3': ['@pick(["重要", "待审核", "已归档", "公开", "机密"])'] }).list,
      version: Mock.Random.pick(['1.0', '1.1', '2.0', '2.1']),
      createdBy: {
        id: String(Mock.Random.integer(1, 10)),
        name: Mock.Random.cname(),
        avatar: '',
      },
      createdAt: Mock.Random.datetime(),
      updatedAt: Mock.Random.datetime(),
      downloadCount: Mock.Random.integer(0, 100),
      viewCount: Mock.Random.integer(0, 500),
    })
  }

  return documents
}

// 模拟文档文件夹
const generateDocumentFolders = (): DocumentFolder[] => {
  return [
    { id: '1', name: '产品文档', parentId: null, createdAt: Mock.Random.datetime(), updatedAt: Mock.Random.datetime() },
    { id: '2', name: '技术文档', parentId: null, createdAt: Mock.Random.datetime(), updatedAt: Mock.Random.datetime() },
    { id: '3', name: '行政文档', parentId: null, createdAt: Mock.Random.datetime(), updatedAt: Mock.Random.datetime() },
    { id: '4', name: '需求文档', parentId: '1', createdAt: Mock.Random.datetime(), updatedAt: Mock.Random.datetime() },
    { id: '5', name: '设计文档', parentId: '1', createdAt: Mock.Random.datetime(), updatedAt: Mock.Random.datetime() },
  ]
}

// 模拟消息数据
const generateMessages = (conversationId: string, count: number = 20): Message[] => {
  const messages: Message[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const isMe = Mock.Random.boolean()
    messages.push({
      id: String(i + 1),
      conversationId,
      content: Mock.Random.paragraph(1, 3),
      type: Mock.Random.pick(['text', 'image', 'file']) as any,
      senderId: isMe ? 'me' : String(Mock.Random.integer(1, 10)),
      senderName: isMe ? '我' : Mock.Random.cname(),
      senderAvatar: '',
      status: Mock.Random.pick(['sent', 'delivered', 'read']) as any,
      createdAt: new Date(now.getTime() - (count - i) * 60 * 1000).toISOString(),
    })
  }

  return messages
}

// 模拟会话列表
const generateConversations = (count: number = 10): Conversation[] => {
  const conversations: Conversation[] = []

  for (let i = 0; i < count; i++) {
    const isGroup = Mock.Random.boolean()
    conversations.push({
      id: String(i + 1),
      type: isGroup ? 'group' : 'private',
      name: isGroup ? Mock.Random.pick(['产品团队', '技术讨论组', '项目A群', '全员群']) : Mock.Random.cname(),
      avatar: '',
      lastMessage: {
        id: '1',
        conversationId: String(i + 1),
        content: Mock.Random.paragraph(1, 1),
        type: 'text',
        senderId: 'other',
        senderName: Mock.Random.cname(),
        senderAvatar: '',
        status: 'read',
        createdAt: Mock.Random.datetime(),
      },
      unreadCount: Mock.Random.integer(0, 10),
      participants: isGroup
        ? Mock.mock({
            'list|3-8': [
              {
                'id|+1': 1,
                name: '@cname',
                avatar: '',
              },
            ],
          }).list
        : [],
      createdAt: Mock.Random.datetime(),
      updatedAt: Mock.Random.datetime(),
    })
  }

  return conversations
}

// 模拟文件存储数据
const generateFiles = (count: number = 30): FileItem[] => {
  const files: FileItem[] = []
  const types = ['folder', 'image', 'video', 'audio', 'document', 'archive', 'other']
  const extensions = {
    image: ['jpg', 'png', 'gif', 'webp'],
    video: ['mp4', 'mov', 'avi'],
    audio: ['mp3', 'wav', 'flac'],
    document: ['pdf', 'docx', 'xlsx', 'pptx', 'txt'],
    archive: ['zip', 'rar', '7z', 'tar.gz'],
    other: ['exe', 'dmg', 'iso'],
  }

  for (let i = 0; i < count; i++) {
    const type = Mock.Random.pick(types)
    const isFolder = type === 'folder'
    const ext = isFolder ? '' : Mock.Random.pick(extensions[type as keyof typeof extensions] || ['bin'])

    files.push({
      id: String(i + 1),
      name: isFolder
        ? Mock.Random.pick(['项目文件', '备份', '下载', '图片', '视频', '文档'])
        : Mock.Random.word(5, 15) + (ext ? '.' + ext : ''),
      type,
      size: isFolder ? 0 : Mock.Random.integer(1024, 104857600),
      path: '/files/' + Mock.Random.word(3, 8),
      parentId: Mock.Random.pick([null, '1', '2']),
      mimeType: isFolder ? '' : 'application/octet-stream',
      thumbnail: type === 'image' ? Mock.Random.image('200x200') : undefined,
      createdBy: {
        id: String(Mock.Random.integer(1, 10)),
        name: Mock.Random.cname(),
      },
      createdAt: Mock.Random.datetime(),
      updatedAt: Mock.Random.datetime(),
      shared: Mock.Random.boolean(),
      starred: Mock.Random.boolean(),
    })
  }

  return files
}

// 模拟完整通知数据
const generateFullNotifications = (count: number = 20): Notification[] => {
  const notifications: Notification[] = []
  const types = ['system', 'message', 'task', 'alert', 'update']

  for (let i = 0; i < count; i++) {
    notifications.push({
      id: String(i + 1),
      type: Mock.Random.pick(types),
      title: Mock.Random.pick(['系统更新通知', '新消息提醒', '任务到期提醒', '安全警告', '审批通知', '会议提醒']),
      content: Mock.Random.paragraph(1, 2),
      read: Mock.Random.boolean(),
      starred: Mock.Random.boolean(),
      sender: Mock.Random.boolean()
        ? {
            id: String(Mock.Random.integer(1, 10)),
            name: Mock.Random.cname(),
            avatar: '',
          }
        : undefined,
      link: Mock.Random.boolean() ? '/dashboard' : undefined,
      createdAt: Mock.Random.datetime(),
      expiresAt: Mock.Random.boolean() ? Mock.Random.datetime() : undefined,
    })
  }

  return notifications
}

// 导出所有模拟数据生成函数
export const mockData = {
  users: generateUsers,
  roles,
  dashboardStats: generateDashboardStats,
  chartData: generateChartData,
  recentUsers: generateRecentUsers,
  notifications: generateNotifications,
  tasks: generateTasks,
  quickActions: generateQuickActions,
  calendarEvents: generateCalendarEvents,
  documents: generateDocuments,
  documentFolders: generateDocumentFolders,
  messages: generateMessages,
  conversations: generateConversations,
  files: generateFiles,
  fullNotifications: generateFullNotifications,
}

// 设置全局Mock规则
export const setupMock = () => {
  // 只在开发环境且启用mock时生效
  if (import.meta.env.PROD) {
    return
  }

  console.log('Mock data enabled')

  // 认证相关
  Mock.mock('/api/auth/login', 'post', (options: any) => {
    const { email, password } = JSON.parse(options.body)

    // 演示账户
    if (email === 'demo@example.com' && password === 'demo123') {
      return {
        code: 200,
        data: {
          user: {
            id: 'demo-user',
            name: '演示用户',
            email: 'demo@example.com',
            avatar: 'https://ui-avatars.com/api/?name=演示用户&background=random',
            role: roles[0], // 管理员角色
            status: 'active',
            department: '技术部',
            position: '经理',
            bio: '这是一个演示账户',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          },
          token: {
            accessToken: 'demo-access-token',
            refreshToken: 'demo-refresh-token',
          },
        },
        message: '登录成功',
      }
    }

    // 普通用户
    const user = generateUsers(1)[0]
    user.email = email

    return {
      code: 200,
      data: {
        user,
        token: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      },
      message: '登录成功',
    }
  })

  Mock.mock('/api/auth/register', 'post', {
    code: 200,
    data: null,
    message: '注册成功，请检查邮箱验证账户',
  })

  Mock.mock('/api/auth/forgot-password', 'post', {
    code: 200,
    data: null,
    message: '密码重置邮件已发送，请检查您的邮箱',
  })

  Mock.mock('/api/auth/reset-password', 'post', {
    code: 200,
    data: null,
    message: '密码重置成功，请使用新密码登录',
  })

  Mock.mock('/api/auth/refresh', 'post', {
    code: 200,
    data: {
      token: {
        accessToken: 'new-mock-access-token',
        refreshToken: 'new-mock-refresh-token',
      },
    },
    message: 'Token刷新成功',
  })

  // 仪表盘相关
  Mock.mock('/api/dashboard/stats', 'get', {
    code: 200,
    data: mockData.dashboardStats(),
    message: '获取统计数据成功',
  })

  Mock.mock('/api/dashboard/widgets', 'get', {
    code: 200,
    data: [],
    message: '获取组件列表成功',
  })

  Mock.mock(RegExp('/api/dashboard/charts/.*'), 'get', (options: any) => {
    const url = options.url
    const type = url.split('/').pop()
    const params = new URLSearchParams(url.split('?')[1] || '')
    const days = parseInt(params.get('days') || '30')

    return {
      code: 200,
      data: {
        labels: mockData.chartData(type, days).map((item: any) => item.label),
        datasets: [
          {
            label: type,
            data: mockData.chartData(type, days).map((item: any) => item.value),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
        ],
      },
      message: '获取图表数据成功',
    }
  })

  Mock.mock('/api/dashboard/recent-users', 'get', (options: any) => {
    const params = new URLSearchParams(options.url.split('?')[1] || '')
    const limit = parseInt(params.get('limit') || '10')

    return {
      code: 200,
      data: mockData.recentUsers(limit),
      message: '获取最近用户成功',
    }
  })

  Mock.mock('/api/dashboard/notifications', 'get', (options: any) => {
    const params = new URLSearchParams(options.url.split('?')[1] || '')
    const limit = parseInt(params.get('limit') || '10')

    return {
      code: 200,
      data: mockData.notifications(limit),
      message: '获取通知列表成功',
    }
  })

  Mock.mock('/api/dashboard/tasks', 'get', (options: any) => {
    const params = new URLSearchParams(options.url.split('?')[1] || '')
    const status = params.get('status') || 'all'

    return {
      code: 200,
      data: mockData.tasks(status),
      message: '获取任务列表成功',
    }
  })

  // 用户管理相关
  Mock.mock('/api/users', 'get', (options: any) => {
    const params = new URLSearchParams(options.url.split('?')[1] || '')
    const page = parseInt(params.get('page') || '1')
    const pageSize = parseInt(params.get('pageSize') || '10')
    const search = params.get('search') || ''
    const status = params.get('status')

    let users = mockData.users(50)

    // 搜索过滤
    if (search) {
      users = users.filter((user: User) => user.name.includes(search) || user.email.includes(search))
    }

    // 状态过滤
    if (status) {
      users = users.filter((user: User) => user.status === status)
    }

    const total = users.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = users.slice(start, end)

    return {
      code: 200,
      data: {
        list,
        total,
        page,
        pageSize,
      },
      message: '获取用户列表成功',
    }
  })

  Mock.mock(RegExp('/api/users/[^/]+'), 'get', (options: any) => {
    const id = options.url.split('/').pop()
    const user = mockData.users(1)[0]
    user.id = id

    return {
      code: 200,
      data: user,
      message: '获取用户信息成功',
    }
  })

  Mock.mock('/api/users', 'post', {
    code: 200,
    data: null,
    message: '创建用户成功',
  })

  Mock.mock(RegExp('/api/users/[^/]+'), 'put', {
    code: 200,
    data: null,
    message: '更新用户成功',
  })

  Mock.mock(RegExp('/api/users/[^/]+'), 'delete', {
    code: 200,
    data: null,
    message: '删除用户成功',
  })

  // 角色管理相关
  Mock.mock('/api/roles', 'get', {
    code: 200,
    data: {
      list: roles,
      total: roles.length,
      page: 1,
      pageSize: 20,
    },
    message: '获取角色列表成功',
  })

  Mock.mock('/api/permissions', 'get', {
    code: 200,
    data: {
      permissions: [
        'dashboard:view',
        'users:view',
        'users:create',
        'users:edit',
        'users:delete',
        'roles:view',
        'roles:create',
        'roles:edit',
        'roles:delete',
        'analytics:view',
        'documents:view',
        'documents:create',
        'documents:edit',
        'documents:delete',
        'files:view',
        'files:upload',
        'files:delete',
        'messages:view',
        'messages:send',
        'calendar:view',
        'calendar:create',
        'calendar:edit',
        'calendar:delete',
        'notifications:view',
        'notifications:manage',
        'settings:view',
        'settings:edit',
        'profile:view',
        'profile:edit',
      ],
    },
    message: '获取权限列表成功',
  })

  // 日历相关
  Mock.mock('/api/calendar/events', 'get', (options: any) => {
    const params = new URLSearchParams(options.url.split('?')[1] || '')
    const month = params.get('month')

    return {
      code: 200,
      data: mockData.calendarEvents(20),
      message: '获取日历事件成功',
    }
  })

  Mock.mock('/api/calendar/events', 'post', {
    code: 200,
    data: { id: String(Date.now()) },
    message: '创建日历事件成功',
  })

  Mock.mock(RegExp('/api/calendar/events/[^/]+'), 'put', {
    code: 200,
    data: null,
    message: '更新日历事件成功',
  })

  Mock.mock(RegExp('/api/calendar/events/[^/]+'), 'delete', {
    code: 200,
    data: null,
    message: '删除日历事件成功',
  })

  // 文档相关
  Mock.mock('/api/documents', 'get', (options: any) => {
    const params = new URLSearchParams(options.url.split('?')[1] || '')
    const page = parseInt(params.get('page') || '1')
    const pageSize = parseInt(params.get('pageSize') || '20')
    const folderId = params.get('folderId')

    let documents = mockData.documents(30)
    if (folderId) {
      documents = documents.filter((doc: Document) => doc.folderId === folderId)
    }

    const total = documents.length
    const start = (page - 1) * pageSize
    const list = documents.slice(start, start + pageSize)

    return {
      code: 200,
      data: { list, total, page, pageSize },
      message: '获取文档列表成功',
    }
  })

  Mock.mock('/api/documents/folders', 'get', {
    code: 200,
    data: mockData.documentFolders(),
    message: '获取文件夹列表成功',
  })

  Mock.mock('/api/documents', 'post', {
    code: 200,
    data: { id: String(Date.now()) },
    message: '上传文档成功',
  })

  Mock.mock(RegExp('/api/documents/[^/]+'), 'delete', {
    code: 200,
    data: null,
    message: '删除文档成功',
  })

  // 文件存储相关
  Mock.mock('/api/files', 'get', (options: any) => {
    const params = new URLSearchParams(options.url.split('?')[1] || '')
    const parentId = params.get('parentId')

    let files = mockData.files(30)
    if (parentId) {
      files = files.filter((file: FileItem) => file.parentId === parentId)
    } else {
      files = files.filter((file: FileItem) => !file.parentId)
    }

    return {
      code: 200,
      data: {
        files,
        storage: {
          used: Mock.Random.integer(1073741824, 10737418240),
          total: 10737418240,
          percentage: Mock.Random.integer(10, 90),
        },
      },
      message: '获取文件列表成功',
    }
  })

  Mock.mock('/api/files/upload', 'post', {
    code: 200,
    data: { id: String(Date.now()) },
    message: '上传文件成功',
  })

  Mock.mock(RegExp('/api/files/[^/]+'), 'delete', {
    code: 200,
    data: null,
    message: '删除文件成功',
  })

  // 消息相关
  Mock.mock('/api/conversations', 'get', {
    code: 200,
    data: mockData.conversations(10),
    message: '获取会话列表成功',
  })

  Mock.mock(RegExp('/api/conversations/[^/]+/messages'), 'get', (options: any) => {
    const conversationId = options.url.split('/')[3]

    return {
      code: 200,
      data: mockData.messages(conversationId, 20),
      message: '获取消息列表成功',
    }
  })

  Mock.mock(RegExp('/api/conversations/[^/]+/messages'), 'post', {
    code: 200,
    data: { id: String(Date.now()) },
    message: '发送消息成功',
  })

  // 通知相关
  Mock.mock('/api/notifications', 'get', (options: any) => {
    const params = new URLSearchParams(options.url.split('?')[1] || '')
    const page = parseInt(params.get('page') || '1')
    const pageSize = parseInt(params.get('pageSize') || '20')
    const type = params.get('type')

    let notifications = mockData.fullNotifications(50)
    if (type) {
      notifications = notifications.filter((n: Notification) => n.type === type)
    }

    const total = notifications.length
    const start = (page - 1) * pageSize
    const list = notifications.slice(start, start + pageSize)
    const unreadCount = notifications.filter((n: Notification) => !n.read).length

    return {
      code: 200,
      data: { list, total, page, pageSize, unreadCount },
      message: '获取通知列表成功',
    }
  })

  Mock.mock(RegExp('/api/notifications/[^/]+/read'), 'put', {
    code: 200,
    data: null,
    message: '标记已读成功',
  })

  Mock.mock('/api/notifications/read-all', 'put', {
    code: 200,
    data: null,
    message: '全部标记已读成功',
  })

  // 设置相关
  Mock.mock('/api/settings', 'get', {
    code: 200,
    data: {
      general: {
        siteName: 'HaloLight',
        siteDescription: '现代化后台管理系统',
        logo: '/logo.svg',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
      },
      appearance: {
        theme: 'light',
        primaryColor: '#3b82f6',
        sidebarCollapsed: false,
      },
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        profileVisibility: 'public',
        activityTracking: true,
      },
    },
    message: '获取设置成功',
  })

  Mock.mock('/api/settings', 'put', {
    code: 200,
    data: null,
    message: '保存设置成功',
  })

  // 个人资料相关
  Mock.mock('/api/profile', 'get', {
    code: 200,
    data: {
      id: 'current-user',
      name: '当前用户',
      email: 'user@example.com',
      phone: '13800138000',
      avatar: '',
      department: '技术部',
      position: '高级工程师',
      bio: '热爱技术，追求卓越',
    },
    message: '获取个人资料成功',
  })

  Mock.mock('/api/profile', 'put', {
    code: 200,
    data: null,
    message: '更新个人资料成功',
  })

  Mock.mock('/api/profile/password', 'put', {
    code: 200,
    data: null,
    message: '修改密码成功',
  })

  Mock.mock('/api/profile/activity', 'get', {
    code: 200,
    data: Mock.mock({
      'list|10': [
        {
          'id|+1': 1,
          action: '@pick(["登录系统", "修改资料", "上传文件", "创建文档", "发送消息"])',
          ip: '@ip',
          device: '@pick(["Chrome/Mac", "Safari/iPhone", "Firefox/Windows"])',
          createdAt: '@datetime',
        },
      ],
    }).list,
    message: '获取活动记录成功',
  })

  console.log('Mock data setup completed')
}

export default mockData

// 自动初始化（仅在开发环境）
if (import.meta.env.DEV) {
  setupMock()
}
