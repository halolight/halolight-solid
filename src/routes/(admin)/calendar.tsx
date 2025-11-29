import { createSignal, createEffect, For, Show } from 'solid-js'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { Button, Card, CardContent, CardHeader, CardTitle } from '~/components/ui'
import type { CalendarEvent, CalendarEventType } from '~/types/calendar'

// 模拟事件数据
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: '产品评审会议',
    description: '讨论新版本功能规划',
    start: '2024-11-30T09:00:00Z',
    end: '2024-11-30T10:30:00Z',
    type: 'meeting',
    color: '#3B82F6',
    location: '会议室A',
    attendees: [
      { id: '1', name: '张三', avatar: 'https://ui-avatars.com/api/?name=张三', status: 'accepted' },
      { id: '2', name: '李四', avatar: 'https://ui-avatars.com/api/?name=李四', status: 'accepted' },
    ],
  },
  {
    id: '2',
    title: '代码审查',
    description: '审查本周提交的代码',
    start: '2024-11-30T14:00:00Z',
    end: '2024-11-30T15:00:00Z',
    type: 'task',
    color: '#10B981',
  },
  {
    id: '3',
    title: '周报提交截止',
    start: '2024-11-30T18:00:00Z',
    end: '2024-11-30T18:00:00Z',
    type: 'reminder',
    color: '#F59E0B',
  },
  {
    id: '4',
    title: '客户演示',
    description: '向客户演示新功能',
    start: '2024-12-01T10:00:00Z',
    end: '2024-12-01T11:30:00Z',
    type: 'meeting',
    color: '#8B5CF6',
    location: '线上会议',
  },
  {
    id: '5',
    title: '团队建设活动',
    description: '年度团建活动',
    start: '2024-12-05T09:00:00Z',
    end: '2024-12-05T18:00:00Z',
    type: 'other',
    color: '#EC4899',
    allDay: true,
  },
]

const eventTypeLabels: Record<CalendarEventType, { label: string; color: string }> = {
  meeting: { label: '会议', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  task: { label: '任务', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  reminder: { label: '提醒', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  holiday: { label: '假日', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  birthday: { label: '生日', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' },
  other: { label: '其他', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
}

export default function CalendarPage() {
  const [events, setEvents] = createSignal<CalendarEvent[]>(mockEvents)
  const [loading, setLoading] = createSignal(true)
  const [currentDate, setCurrentDate] = createSignal(new Date())
  const [viewMode, setViewMode] = createSignal<'month' | 'week' | 'day'>('month')
  const [selectedEvent, setSelectedEvent] = createSignal<CalendarEvent | null>(null)

  createEffect(() => {
    uiActions.setPageTitle('日程安排')
    uiActions.setBreadcrumbs([{ label: '日程安排', href: '/calendar' }])
  })

  createEffect(() => {
    setTimeout(() => setLoading(false), 500)
  })

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
  }

  const getDaysInMonth = () => {
    const year = currentDate().getFullYear()
    const month = currentDate().getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: Date[] = []

    // 添加上个月的天数来填充第一周
    const startDayOfWeek = firstDay.getDay()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i)
      days.push(day)
    }

    // 添加当月的天数
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    // 添加下个月的天数来填满最后一周
    const remainingDays = 42 - days.length // 6周 * 7天
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    return events().filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate().getMonth()
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate().getFullYear(), currentDate().getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate().getFullYear(), currentDate().getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const upcomingEvents = () => {
    const now = new Date()
    return events()
      .filter((event) => new Date(event.start) >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5)
  }

  return (
    <>
      <Title>日程安排 - HaloLight</Title>

      <div class="space-y-6">
        {/* 页面头部 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">日程安排</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">管理您的日程和事件</p>
          </div>
          <Button variant="primary">新建事件</Button>
        </div>

        <Show
          when={!loading()}
          fallback={
            <div class="flex items-center justify-center h-64">
              <div class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          }
        >
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 日历主体 */}
            <div class="lg:col-span-3">
              <Card>
                <CardContent class="p-4">
                  {/* 日历导航 */}
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-4">
                      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentDate().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
                      </h2>
                      <div class="flex space-x-1">
                        <button onClick={prevMonth} class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button onClick={nextMonth} class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <Button variant="secondary" size="sm" onClick={goToToday}>
                        今天
                      </Button>
                    </div>
                  </div>

                  {/* 星期标题 */}
                  <div class="grid grid-cols-7 gap-1 mb-2">
                    <For each={['日', '一', '二', '三', '四', '五', '六']}>
                      {(day) => (
                        <div class="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">{day}</div>
                      )}
                    </For>
                  </div>

                  {/* 日期网格 */}
                  <div class="grid grid-cols-7 gap-1">
                    <For each={getDaysInMonth()}>
                      {(date) => {
                        const dayEvents = getEventsForDate(date)
                        return (
                          <div
                            class={`min-h-24 p-1 border rounded-lg cursor-pointer transition-colors ${
                              isToday(date)
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                : isCurrentMonth(date)
                                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                  : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'
                            }`}
                          >
                            <div
                              class={`text-sm font-medium mb-1 ${
                                isToday(date) ? 'text-blue-600 dark:text-blue-400' : ''
                              }`}
                            >
                              {date.getDate()}
                            </div>
                            <div class="space-y-1">
                              <For each={dayEvents.slice(0, 2)}>
                                {(event) => (
                                  <div
                                    class="text-xs px-1 py-0.5 rounded truncate"
                                    style={{ 'background-color': `${event.color}20`, color: event.color }}
                                    onClick={() => setSelectedEvent(event)}
                                  >
                                    {event.title}
                                  </div>
                                )}
                              </For>
                              <Show when={dayEvents.length > 2}>
                                <div class="text-xs text-gray-500 dark:text-gray-400 px-1">
                                  +{dayEvents.length - 2} 更多
                                </div>
                              </Show>
                            </div>
                          </div>
                        )
                      }}
                    </For>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 侧边栏 - 即将到来的事件 */}
            <div class="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>即将到来</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <For each={upcomingEvents()}>
                      {(event) => (
                        <div
                          class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div class="flex items-start">
                            <div
                              class="w-1 h-full rounded-full mr-3 self-stretch"
                              style={{ 'background-color': event.color }}
                            ></div>
                            <div class="flex-1 min-w-0">
                              <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">{event.title}</h4>
                              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDate(event.start)}
                                {!event.allDay && ` · ${formatTime(event.start)}`}
                              </p>
                              <Show when={event.type}>
                                <span
                                  class={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2 ${eventTypeLabels[event.type!].color}`}
                                >
                                  {eventTypeLabels[event.type!].label}
                                </span>
                              </Show>
                            </div>
                          </div>
                        </div>
                      )}
                    </For>
                    <Show when={upcomingEvents().length === 0}>
                      <p class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">暂无即将到来的事件</p>
                    </Show>
                  </div>
                </CardContent>
              </Card>

              {/* 事件类型图例 */}
              <Card>
                <CardHeader>
                  <CardTitle>事件类型</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-2">
                    <For each={Object.entries(eventTypeLabels)}>
                      {([type, { label, color }]) => (
                        <div class="flex items-center">
                          <span class={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>{label}</span>
                        </div>
                      )}
                    </For>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Show>
      </div>
    </>
  )
}
