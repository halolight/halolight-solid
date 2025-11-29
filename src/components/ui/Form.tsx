import { JSX, splitProps, createSignal, For, Show } from 'solid-js'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea'
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  validation?: {
    required?: string
    pattern?: { value: RegExp; message: string }
    minLength?: { value: number; message: string }
    maxLength?: { value: number; message: string }
    min?: { value: number; message: string }
    max?: { value: number; message: string }
  }
}

export interface FormProps extends JSX.FormHTMLAttributes<HTMLFormElement> {
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  submitText?: string
  cancelText?: string
  onCancel?: () => void
  loading?: boolean
  errors?: Record<string, string>
}

export function Form(props: FormProps) {
  const [local, others] = splitProps(props, [
    'fields',
    'onSubmit',
    'submitText',
    'cancelText',
    'onCancel',
    'loading',
    'errors',
    'class',
  ])

  const [formData, setFormData] = createSignal<Record<string, any>>({})
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = createSignal(false)

  const submitText = () => local.submitText || '提交'
  const cancelText = () => local.cancelText || '取消'

  const validateField = (field: FormField, value: any): string | null => {
    if (!field.validation) return null

    const validation = field.validation

    if (validation.required && (!value || value.toString().trim() === '')) {
      return validation.required
    }

    if (validation.pattern && !validation.pattern.value.test(value)) {
      return validation.pattern.message
    }

    if (validation.minLength && value.length < validation.minLength.value) {
      return validation.minLength.message
    }

    if (validation.maxLength && value.length > validation.maxLength.value) {
      return validation.maxLength.message
    }

    if (validation.min && Number(value) < validation.min.value) {
      return validation.min.message
    }

    if (validation.max && Number(value) > validation.max.value) {
      return validation.max.message
    }

    return null
  }

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))

    // 清除该字段的错误信息
    setFieldErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    if (isSubmitting() || local.loading) return

    // 验证所有字段
    const errors: Record<string, string> = {}
    let isValid = true

    for (const field of local.fields) {
      const value = formData()[field.name] || ''
      const error = validateField(field, value)
      if (error) {
        errors[field.name] = error
        isValid = false
      }
    }

    if (!isValid) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      await local.onSubmit(formData())
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const value = () => formData()[field.name] || ''
    const error = () => fieldErrors()[field.name] || local.errors?.[field.name]

    switch (field.type) {
      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={value()}
            onChange={(e) => handleInputChange(field.name, e.currentTarget.value)}
            class={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              error() ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
            }`}
            required={field.required}
          >
            <Show when={field.placeholder}>
              <option value="" disabled>
                {field.placeholder}
              </option>
            </Show>
            <For each={field.options}>{(option) => <option value={option.value}>{option.label}</option>}</For>
          </select>
        )

      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={value()}
            onInput={(e) => handleInputChange(field.name, e.currentTarget.value)}
            placeholder={field.placeholder}
            class={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              error() ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
            }`}
            required={field.required}
            rows={4}
          />
        )

      default:
        return (
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            value={value()}
            onInput={(e) => handleInputChange(field.name, e.currentTarget.value)}
            placeholder={field.placeholder}
            class={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              error() ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
            }`}
            required={field.required}
          />
        )
    }
  }

  return (
    <form {...others} onSubmit={handleSubmit} class={`space-y-6 ${local.class || ''}`}>
      <For each={local.fields}>
        {(field) => (
          <div>
            <label for={field.name} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
              <Show when={field.required}>
                <span class="text-red-500 ml-1">*</span>
              </Show>
            </label>
            {renderField(field)}
            <Show when={fieldErrors()[field.name] || local.errors?.[field.name]}>
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors()[field.name] || local.errors?.[field.name]}
              </p>
            </Show>
          </div>
        )}
      </For>

      <div class="flex justify-end space-x-3">
        <Show when={local.onCancel}>
          <button
            type="button"
            onClick={local.onCancel}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            disabled={isSubmitting() || local.loading}
          >
            {cancelText()}
          </button>
        </Show>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting() || local.loading}
        >
          <Show when={isSubmitting() || local.loading}>
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 inline"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </Show>
          {submitText()}
        </button>
      </div>
    </form>
  )
}
