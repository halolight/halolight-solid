import { JSX, splitProps } from 'solid-js'

export interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  children: JSX.Element
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  secondary: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-sm',
}

export function Badge(props: BadgeProps) {
  const [local, others] = splitProps(props, ['variant', 'size', 'rounded', 'children', 'class'])

  const variant = () => local.variant || 'default'
  const size = () => local.size || 'md'

  return (
    <span
      class={`inline-flex items-center font-medium ${
        local.rounded ? 'rounded-full' : 'rounded'
      } ${variantStyles[variant()]} ${sizeStyles[size()]} ${local.class || ''}`}
      {...others}
    >
      {local.children}
    </span>
  )
}

export default Badge
