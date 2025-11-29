import { JSX, splitProps } from 'solid-js'

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  description?: string
  class?: string
  id?: string
}

const sizeStyles = {
  sm: {
    switch: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    switch: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    switch: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: 'translate-x-7',
  },
}

export function Switch(props: SwitchProps) {
  const [local, others] = splitProps(props, [
    'checked',
    'defaultChecked',
    'onChange',
    'disabled',
    'size',
    'label',
    'description',
    'class',
    'id',
  ])

  const size = () => local.size || 'md'
  const styles = () => sizeStyles[size()]

  const handleClick = () => {
    if (!local.disabled) {
      local.onChange?.(!local.checked)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const switchElement = (
    <button
      type="button"
      role="switch"
      aria-checked={local.checked}
      disabled={local.disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      class={`relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
        local.checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      } ${local.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${styles().switch}`}
    >
      <span
        class={`inline-block rounded-full bg-white transition-transform shadow-sm ${styles().thumb} ${
          local.checked ? styles().translate : 'translate-x-0.5'
        }`}
      />
    </button>
  )

  if (local.label || local.description) {
    return (
      <div class={`flex items-start ${local.class || ''}`}>
        <div class="flex-shrink-0 mt-0.5">{switchElement}</div>
        <div class="ml-3">
          {local.label && (
            <label
              for={local.id}
              class={`text-sm font-medium ${
                local.disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-white'
              }`}
            >
              {local.label}
            </label>
          )}
          {local.description && <p class="text-sm text-gray-500 dark:text-gray-400">{local.description}</p>}
        </div>
      </div>
    )
  }

  return <div class={local.class}>{switchElement}</div>
}

export default Switch
