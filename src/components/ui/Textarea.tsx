import { JSX, splitProps, Show } from 'solid-js'

export interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helpText?: string
  required?: boolean
}

export function Textarea(props: TextareaProps) {
  const [local, others] = splitProps(props, ['label', 'error', 'helpText', 'required', 'class'])

  const textareaId = () => others.id || `textarea-${Math.random().toString(36).substr(2, 9)}`

  const textareaClasses = () => {
    const baseClasses =
      'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors resize-vertical'
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
        <label for={textareaId()} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {local.label}
          <Show when={local.required}>
            <span class="text-red-500 ml-1">*</span>
          </Show>
        </label>
      </Show>
      <textarea {...others} id={textareaId()} class={textareaClasses()} />
      <Show when={local.error}>
        <p class="text-sm text-red-600 dark:text-red-400">{local.error}</p>
      </Show>
      <Show when={local.helpText && !local.error}>
        <p class="text-sm text-gray-500 dark:text-gray-400">{local.helpText}</p>
      </Show>
    </div>
  )
}
