import { JSX, splitProps, Show } from 'solid-js'

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: JSX.Element
}

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ['variant', 'size', 'loading', 'children', 'class', 'disabled'])

  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = () => {
    switch (local.variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white focus:ring-gray-500'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500'
      case 'outline':
        return 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
    }
  }

  const sizeClasses = () => {
    switch (local.size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2 text-sm'
    }
  }

  const classes = () => {
    return `${baseClasses} ${variantClasses()} ${sizeClasses()} ${local.class || ''}`
  }

  return (
    <button {...others} class={classes()} disabled={local.disabled || local.loading}>
      <Show when={local.loading}>
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </Show>
      {local.children}
    </button>
  )
}
