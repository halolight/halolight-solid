import { JSX, splitProps } from 'solid-js'

export interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton(props: SkeletonProps) {
  const [local, others] = splitProps(props, ['variant', 'width', 'height', 'animation', 'class'])

  const variant = () => local.variant || 'text'
  const animation = () => local.animation || 'pulse'

  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-md',
  }

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  const getStyle = () => {
    const style: JSX.CSSProperties = {}

    if (local.width) {
      style.width = typeof local.width === 'number' ? `${local.width}px` : local.width
    }

    if (local.height) {
      style.height = typeof local.height === 'number' ? `${local.height}px` : local.height
    } else if (variant() === 'text') {
      style.height = '1em'
    } else if (variant() === 'circular') {
      style.height = local.width ? (typeof local.width === 'number' ? `${local.width}px` : local.width) : '40px'
      style.width = style.height
    }

    return style
  }

  return (
    <div
      class={`bg-gray-200 dark:bg-gray-700 ${variantStyles[variant()]} ${animationStyles[animation()]} ${local.class || ''}`}
      style={getStyle()}
      {...others}
    />
  )
}

// 预设骨架屏组件
export function SkeletonText(props: { lines?: number; class?: string }) {
  const lines = () => props.lines || 3

  return (
    <div class={`space-y-2 ${props.class || ''}`}>
      {Array.from({ length: lines() }).map((_, i) => (
        <Skeleton variant="text" width={i === lines() - 1 ? '60%' : '100%'} />
      ))}
    </div>
  )
}

export function SkeletonCard(props: { class?: string }) {
  return (
    <div class={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${props.class || ''}`}>
      <div class="flex items-center space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div class="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      <div class="mt-4 space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  )
}

export function SkeletonTable(props: { rows?: number; cols?: number; class?: string }) {
  const rows = () => props.rows || 5
  const cols = () => props.cols || 4

  return (
    <div class={`overflow-hidden ${props.class || ''}`}>
      {/* Header */}
      <div class="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-800">
        {Array.from({ length: cols() }).map(() => (
          <Skeleton variant="text" width="100px" class="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows() }).map(() => (
        <div class="flex space-x-4 p-4 border-t border-gray-200 dark:border-gray-700">
          {Array.from({ length: cols() }).map(() => (
            <Skeleton variant="text" class="flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Skeleton
