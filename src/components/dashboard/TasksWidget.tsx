import { For, Show, createSignal, onMount } from 'solid-js'
import { Card, CardContent, CardHeader } from '~/components/ui'
import type { Task } from '~/types/dashboard'

export interface TasksWidgetProps {
  isMobile?: boolean
}

// Mock data - will be replaced with API call
const mockTasks: Task[] = [
  {
    id: '1',
    title: '完成项目报告',
    description: '撰写Q4项目总结报告',
    completed: false,
    priority: 'high',
    dueDate: '2025-01-15',
    createdAt: '2025-01-01',
  },
  {
    id: '2',
    title: '代码审查',
    description: '审查新功能PR',
    completed: false,
    priority: 'medium',
    dueDate: '2025-01-10',
    createdAt: '2025-01-02',
  },
  {
    id: '3',
    title: '团队会议',
    description: '参加周会讨论',
    completed: true,
    priority: 'low',
    dueDate: '2025-01-08',
    createdAt: '2025-01-03',
  },
  {
    id: '4',
    title: '更新文档',
    description: '更新API文档',
    completed: false,
    priority: 'medium',
    dueDate: '2025-01-12',
    createdAt: '2025-01-04',
  },
  {
    id: '5',
    title: '修复bug',
    description: '修复用户反馈的问题',
    completed: false,
    priority: 'high',
    dueDate: '2025-01-09',
    createdAt: '2025-01-05',
  },
]

export function TasksWidget(props: TasksWidgetProps) {
  const [tasks, setTasks] = createSignal<Task[]>([])
  const [isLoading, setIsLoading] = createSignal(true)

  onMount(() => {
    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks)
      setIsLoading(false)
    }, 500)
  })

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '高'
      case 'medium':
        return '中'
      case 'low':
        return '低'
      default:
        return ''
    }
  }

  const displayTasks = () => {
    const allTasks = tasks()
    if (props.isMobile) {
      return allTasks.slice(0, 3)
    }
    return allTasks
  }

  return (
    <div class="space-y-3">
      <Show when={isLoading()}>
        <div class="text-sm text-muted-foreground">加载中...</div>
      </Show>

      <Show when={!isLoading() && tasks().length === 0}>
        <div class="text-sm text-muted-foreground text-center py-4">暂无任务</div>
      </Show>

      <Show when={!isLoading() && tasks().length > 0}>
        <For each={displayTasks()}>
          {(task) => (
            <div
              class="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              classList={{
                'opacity-60': task.completed,
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                onchange={(e) => {
                  const checked = e.currentTarget.checked
                  setTasks((prev) =>
                    prev.map((t) => (t.id === task.id ? { ...t, completed: checked } : t))
                  )
                }}
              />

              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-medium"
                  classList={{
                    'line-through': task.completed,
                  }}
                >
                  {task.title}
                </p>
                <Show when={task.description}>
                  <p class="text-xs text-muted-foreground truncate">{task.description}</p>
                </Show>
                <Show when={task.dueDate}>
                  <p class="text-xs text-muted-foreground mt-1">
                    截止: {new Date(task.dueDate).toLocaleDateString('zh-CN')}
                  </p>
                </Show>
              </div>

              <span
                class={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${getPriorityColor(task.priority)}`}
              >
                {getPriorityLabel(task.priority)}
              </span>
            </div>
          )}
        </For>
      </Show>
    </div>
  )
}

export default TasksWidget
