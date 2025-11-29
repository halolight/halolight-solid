import { createSignal, createEffect, For, Show } from 'solid-js'
import { splitProps } from 'solid-js'

interface PermissionOption {
  value: string
  label: string
}

interface PermissionSelectorProps {
  name: string
  label: string
  value: string[]
  options: PermissionOption[]
  onChange: (value: string[]) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

export function PermissionSelector(props: PermissionSelectorProps) {
  const [local, others] = splitProps(props, [
    'name',
    'label',
    'value',
    'options',
    'onChange',
    'error',
    'required',
    'disabled',
  ])

  const [selectedPermissions, setSelectedPermissions] = createSignal<string[]>(local.value || [])

  createEffect(() => {
    setSelectedPermissions(local.value || [])
  })

  const handlePermissionChange = (permissionValue: string, checked: boolean) => {
    let newPermissions: string[]

    if (permissionValue === '*') {
      // 如果选择所有权限，则只保留 '*'
      newPermissions = checked ? ['*'] : []
    } else {
      const current = selectedPermissions()
      if (checked) {
        // 如果当前有 '*'，则移除 '*' 并添加新权限
        newPermissions = current.includes('*') ? [permissionValue] : [...current, permissionValue]
      } else {
        newPermissions = current.filter((p) => p !== permissionValue)
      }
    }

    setSelectedPermissions(newPermissions)
    local.onChange(newPermissions)
  }

  const isPermissionSelected = (permissionValue: string): boolean => {
    const current = selectedPermissions()
    return current.includes('*') || current.includes(permissionValue)
  }

  return (
    <div {...others}>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {local.label}
        <Show when={local.required}>
          <span class="text-red-500 ml-1">*</span>
        </Show>
      </label>

      <div class="space-y-2 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-3">
        <For each={local.options}>
          {(option) => (
            <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded">
              <input
                type="checkbox"
                name={`${local.name}-${option.value}`}
                checked={isPermissionSelected(option.value)}
                onChange={(e) => handlePermissionChange(option.value, e.currentTarget.checked)}
                disabled={local.disabled}
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="text-sm text-gray-900 dark:text-white">{option.label}</span>
            </label>
          )}
        </For>
      </div>

      <Show when={local.error}>
        <p class="mt-1 text-sm text-red-600 dark:text-red-400">{local.error}</p>
      </Show>

      <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
        已选择 {selectedPermissions().includes('*') ? '所有权限' : `${selectedPermissions().length} 个权限`}
      </div>
    </div>
  )
}
