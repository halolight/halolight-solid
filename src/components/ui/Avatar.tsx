import { JSX, splitProps, Show } from 'solid-js'

export interface AvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  rounded?: boolean
}

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
}

const statusStyles = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
}

const statusSizeStyles = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
}

export function Avatar(props: AvatarProps) {
  const [local, others] = splitProps(props, ['src', 'alt', 'name', 'size', 'status', 'rounded', 'class'])

  const size = () => local.size || 'md'

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getFallbackUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff`
  }

  return (
    <div
      class={`relative inline-flex items-center justify-center ${
        local.rounded === false ? 'rounded-md' : 'rounded-full'
      } ${sizeStyles[size()]} ${local.class || ''}`}
      {...others}
    >
      <Show
        when={local.src}
        fallback={
          <Show
            when={local.name}
            fallback={
              <div
                class={`bg-gray-300 dark:bg-gray-600 ${local.rounded === false ? 'rounded-md' : 'rounded-full'} w-full h-full flex items-center justify-center`}
              >
                <svg class="w-1/2 h-1/2 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            }
          >
            <img
              class={`w-full h-full object-cover ${local.rounded === false ? 'rounded-md' : 'rounded-full'}`}
              src={getFallbackUrl(local.name!)}
              alt={local.alt || local.name}
            />
          </Show>
        }
      >
        <img
          class={`w-full h-full object-cover ${local.rounded === false ? 'rounded-md' : 'rounded-full'}`}
          src={local.src}
          alt={local.alt || local.name || 'Avatar'}
          onerror={(e) => {
            if (local.name) {
              ;(e.target as HTMLImageElement).src = getFallbackUrl(local.name)
            }
          }}
        />
      </Show>

      {/* 状态指示器 */}
      <Show when={local.status}>
        <span
          class={`absolute bottom-0 right-0 ${statusStyles[local.status!]} ${statusSizeStyles[size()]} rounded-full ring-2 ring-white dark:ring-gray-900`}
        />
      </Show>
    </div>
  )
}

export interface AvatarGroupProps {
  children: JSX.Element
  max?: number
  size?: AvatarProps['size']
}

export function AvatarGroup(props: AvatarGroupProps) {
  return <div class="flex -space-x-2">{props.children}</div>
}

export default Avatar
