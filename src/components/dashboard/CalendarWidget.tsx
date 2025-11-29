import { For, Show, createSignal, onMount } from 'solid-js'
import { Card, CardContent } from '~/components/ui'
import type { CalendarEvent } from '~/types/calendar'

export interface CalendarWidgetProps {
  isMobile?: boolean
}

// Mock data - will be replaced with API call
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: '团队周会',
    description: '讨论本周工作进展',
    start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    type: 'meeting',
    color: '#3b82f6',
  },
  {
    id: '2',
    title: '项目评审',
    description: '新功能设计评审',
    start: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    type: 'meeting',
    color: '#10b981',
  },
  {
    id: '3',
    title: '客户沟通',
    description: '需求确认会议',
    start: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
    type: 'meeting',
    color: '#f59e0b',
  },
  {
    id: '4',
    title: '代码审查',
    description: '审查PR #123',
    start: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    type: 'task',
    color: '#8b5cf6',
  },
]

export function CalendarWidget(props: CalendarWidgetProps) {
  const [events, setEvents] = createSignal<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = createSignal(true)

  onMount(() => {
    // Simulate API call
    setTimeout(() => {
      // Filter today's events
      const today = new Date().toISOString().slice(0, 10)
      const todayEvents = mockEvents.filter((event) => {
        const startDate = event.start?.slice(0, 10)
        return startDate === today
      })
      setEvents(todayEvents)
      setIsLoading(false)
    }, 500)
  })

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '时间未定'
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatTimeRange = (start?: string, end?: string) => {
    if (!start) return '时间未定'
    const startTime = formatTime(start)
    const endTime = end ? formatTime(end) : ''
    return endTime ? `${startTime} - ${endTime}` : startTime
  }

  const getEventTypeLabel = (type?: string) => {
    switch (type) {
      case 'meeting':
        return '会议'
      case 'task':
        return '任务'
      case 'reminder':
        return '提醒'
      case 'holiday':
        return '假期'
      case 'birthday':
        return '生日'
      default:
        return '事件'
    }
  }

  const displayEvents = () => {
    const allEvents = events()
    if (props.isMobile) {
      return allEvents.slice(0, 3)
    }
    return allEvents.slice(0, 6)
  }

  return (
    <div class="h-full flex flex-col gap-3">
      <div class="flex-1 overflow-auto rounded-md border bg-muted/30 p-3">
        <Show when={isLoading()}>
          <p class="text-xs text-muted-foreground">加载中...</p>
        </Show>

        <Show when={!isLoading() && events().length === 0}>
          <p class="text-xs text-muted-foreground text-center py-4">今日暂无日程</p>
        </Show>

        <Show when={!isLoading() && events().length > 0}>
          <ul class="space-y-2">
            <For each={displayEvents()}>
              {(event) => (
                <li class="flex items-start justify-between gap-2 rounded-md bg-background p-2 shadow-xs hover:shadow-sm transition-shadow">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <div
                        class="h-2 w-2 rounded-full flex-shrink-0"
                        style={{
                          'background-color': event.color || '#3b82f6',
                        }}
                      />
                      <p class="text-sm font-medium leading-tight truncate">{event.title || '未命名事件'}</p>
                    </div>
                    <p class="text-[11px] text-muted-foreground leading-tight mt-1 ml-4">
                      {formatTimeRange(event.start, event.end)}
                    </p>
                    <Show when={event.description}>
                      <p class="text-[11px] text-muted-foreground leading-tight mt-0.5 ml-4 truncate">
                        {event.description}
                      </p>
                    </Show>
                  </div>
                  <span class="text-[11px] text-muted-foreground whitespace-nowrap">
                    {getEventTypeLabel(event.type)}
                  </span>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </div>
  )
}

export default CalendarWidget
