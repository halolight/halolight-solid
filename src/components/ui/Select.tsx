import { JSX, splitProps, For, Show } from 'solid-js'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helpText?: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
}

export function Select(props: SelectProps) {
  const [local, others] = splitProps(props, [
    'label',
    'error',
    'helpText',
    'options',
    'placeholder',
    'required',
    'class',
    'children',
  ])

  const selectId = () => others.id || `select-${Math.random().toString(36).substr(2, 9)}`

  const selectClasses = () => {
    const baseClasses =
      'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'
    const errorClasses = local.error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
    const disabledClasses = others.disabled
      ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50'
      : 'bg-white dark:bg-gray-800'

    return `${baseClasses} ${errorClasses} ${disabledClasses} ${local.class || ''}`
  }

  return (
    <div class="space-y-1">
      <Show when={local.label}>
        <label for={selectId()} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {local.label}
          <Show when={local.required}>
            <span class="text-red-500 ml-1">*</span>
          </Show>
        </label>
      </Show>
      <select {...others} id={selectId()} class={selectClasses()}>
        <Show when={local.placeholder}>
          <option value="" disabled selected>
            {local.placeholder}
          </option>
        </Show>
        <For each={local.options}>
          {(option) => (
            <option value={option.value} disabled={option.disabled} selected={others.value === option.value}>
              {option.label}
            </option>
          )}
        </For>
        {local.children}
      </select>
      <Show when={local.error}>
        <p class="text-sm text-red-600 dark:text-red-400">{local.error}</p>
      </Show>
      <Show when={local.helpText && !local.error}>
        <p class="text-sm text-gray-500 dark:text-gray-400">{local.helpText}</p>
      </Show>
    </div>
  )
}
