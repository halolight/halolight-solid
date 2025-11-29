import { Show } from 'solid-js'
import { Card, CardContent } from '~/components/ui'

interface StatsWidgetProps {
  title: string
  value: string | number
  change?: number
  icon: 'users' | 'active-users' | 'revenue' | 'conversion'
}

const iconMap = {
  users: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
      />
    </svg>
  ),
  'active-users': (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  revenue: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  conversion: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
}

export default function StatsWidget(props: StatsWidgetProps) {
  const IconComponent = iconMap[props.icon]

  const getChangeColor = () => {
    if (!props.change) return 'text-gray-500'
    return props.change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getChangeIcon = () => {
    if (!props.change) return null
    return props.change >= 0 ? '↗' : '↘'
  }

  return (
    <Card>
      <CardContent>
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{props.title}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{props.value}</p>
            <Show when={props.change !== undefined}>
              <p class={`text-sm flex items-center ${getChangeColor()}`}>
                <span class="mr-1">{getChangeIcon()}</span>
                {Math.abs(props.change!)}%
              </p>
            </Show>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <IconComponent class="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
