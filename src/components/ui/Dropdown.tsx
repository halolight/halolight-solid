import { JSX, createSignal, Show, For, splitProps, onCleanup, onMount } from 'solid-js'

export interface DropdownItem {
  key: string
  label: string
  icon?: JSX.Element
  disabled?: boolean
  danger?: boolean
  divider?: boolean
  onClick?: () => void
}

export interface DropdownProps {
  trigger: JSX.Element
  items: DropdownItem[]
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  class?: string
}

export function Dropdown(props: DropdownProps) {
  const [isOpen, setIsOpen] = createSignal(false)
  let containerRef: HTMLDivElement | undefined
  let menuRef: HTMLDivElement | undefined

  const placement = () => props.placement || 'bottom-end'

  const placementStyles = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
  })

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
  })

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && !item.divider) {
      item.onClick?.()
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} class={`relative inline-block ${props.class || ''}`}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen())}>{props.trigger}</div>

      {/* Menu */}
      <Show when={isOpen()}>
        <div
          ref={menuRef}
          class={`absolute z-50 min-w-[160px] rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${placementStyles[placement()]}`}
        >
          <div class="py-1" role="menu">
            <For each={props.items}>
              {(item) => (
                <Show
                  when={!item.divider}
                  fallback={<div class="my-1 border-t border-gray-200 dark:border-gray-700" />}
                >
                  <button
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => handleItemClick(item)}
                    class={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                      item.disabled
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : item.danger
                          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Show when={item.icon}>
                      <span class="mr-3 flex-shrink-0">{item.icon}</span>
                    </Show>
                    {item.label}
                  </button>
                </Show>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}

// 简化版的下拉按钮
export interface DropdownButtonProps {
  label: string
  items: DropdownItem[]
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

export function DropdownButton(props: DropdownButtonProps) {
  const variant = () => props.variant || 'secondary'
  const size = () => props.size || 'md'

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary:
      'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  return (
    <Dropdown
      items={props.items}
      class={props.class}
      trigger={
        <button
          type="button"
          class={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${variantStyles[variant()]} ${sizeStyles[size()]}`}
        >
          {props.label}
          <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      }
    />
  )
}

export default Dropdown
