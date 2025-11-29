import { For, Show } from 'solid-js'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui'

interface ChartWidgetProps {
  title: string
  type: 'line' | 'bar' | 'pie'
  data: Array<{ label: string; value: number; color?: string }>
}

export default function ChartWidget(props: ChartWidgetProps) {
  const maxValue = Math.max(...props.data.map((item) => item.value))

  const renderChart = () => {
    if (props.type === 'pie') {
      return renderPieChart()
    } else if (props.type === 'line') {
      return renderLineChart()
    } else {
      return renderBarChart()
    }
  }

  const renderLineChart = () => {
    const points = props.data
      .map((item, index) => {
        const x = (index / (props.data.length - 1)) * 100
        const y = 100 - (item.value / maxValue) * 80
        return `${x},${y}`
      })
      .join(' ')

    return (
      <div class="h-64 relative">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* 网格线 */}
          <For each={[0, 25, 50, 75, 100]}>
            {(y) => <line x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" stroke-width="0.5" />}
          </For>
          {/* 数据线 */}
          <polyline points={points} fill="none" stroke="#3b82f6" stroke-width="2" />
          {/* 数据点 */}
          <For each={props.data}>
            {(item, index) => {
              const x = (index() / (props.data.length - 1)) * 100
              const y = 100 - (item.value / maxValue) * 80
              return <circle cx={x} cy={y} r="3" fill="#3b82f6" />
            }}
          </For>
        </svg>
        {/* X轴标签 */}
        <div class="flex justify-between mt-2 text-xs text-gray-500">
          <For each={props.data}>{(item) => <span>{item.label}</span>}</For>
        </div>
      </div>
    )
  }

  const renderBarChart = () => {
    const barWidth = 80 / props.data.length
    const barSpacing = 20 / props.data.length

    return (
      <div class="h-64 relative">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* 网格线 */}
          <For each={[0, 25, 50, 75, 100]}>
            {(y) => <line x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" stroke-width="0.5" />}
          </For>
          {/* 柱状图 */}
          <For each={props.data}>
            {(item, index) => {
              const x = index() * (barWidth + barSpacing) + barSpacing / 2
              const height = (item.value / maxValue) * 80
              const y = 100 - height
              return <rect x={x} y={y} width={barWidth} height={height} fill="#3b82f6" rx="2" />
            }}
          </For>
        </svg>
        {/* X轴标签 */}
        <div class="flex justify-between mt-2 text-xs text-gray-500">
          <For each={props.data}>{(item) => <span class="text-center flex-1">{item.label}</span>}</For>
        </div>
      </div>
    )
  }

  const renderPieChart = () => {
    const total = props.data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = 0

    const slices = props.data.map((item) => {
      const angle = (item.value / total) * 360
      const startAngle = currentAngle
      const endAngle = currentAngle + angle
      currentAngle += angle

      const x1 = 50 + 30 * Math.cos((startAngle * Math.PI) / 180)
      const y1 = 50 + 30 * Math.sin((startAngle * Math.PI) / 180)
      const x2 = 50 + 30 * Math.cos((endAngle * Math.PI) / 180)
      const y2 = 50 + 30 * Math.sin((endAngle * Math.PI) / 180)

      const largeArcFlag = angle > 180 ? 1 : 0

      return {
        path: `M 50 50 L ${x1} ${y1} A 30 30 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
        color: item.color || '#3b82f6',
        label: item.label,
        value: item.value,
        percentage: ((item.value / total) * 100).toFixed(1),
      }
    })

    return (
      <div class="flex items-center">
        <div class="flex-1">
          <svg class="w-48 h-48" viewBox="0 0 100 100">
            <For each={slices}>
              {(slice) => <path d={slice.path} fill={slice.color} stroke="white" stroke-width="2" />}
            </For>
          </svg>
        </div>
        <div class="flex-1 ml-6">
          <div class="space-y-2">
            <For each={slices}>
              {(slice) => (
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full mr-2" style={{ 'background-color': slice.color }} />
                  <div class="flex-1">
                    <div class="text-sm font-medium">{slice.label}</div>
                    <div class="text-xs text-gray-500">
                      {slice.percentage}% ({slice.value})
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  )
}
