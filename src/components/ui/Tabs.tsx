import { JSX, createSignal, createContext, useContext, For, Show, splitProps } from 'solid-js'

export interface TabsProps {
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  children: JSX.Element
  class?: string
}

export interface TabsListProps {
  children: JSX.Element
  class?: string
}

export interface TabsTriggerProps {
  value: string
  disabled?: boolean
  children: JSX.Element
  class?: string
}

export interface TabsContentProps {
  value: string
  children: JSX.Element
  class?: string
}

interface TabsContextValue {
  value: () => string
  setValue: (value: string) => void
}

const TabsContext = createContext<TabsContextValue>()

export function Tabs(props: TabsProps) {
  const [local, others] = splitProps(props, ['defaultValue', 'value', 'onChange', 'children', 'class'])

  const [internalValue, setInternalValue] = createSignal(local.defaultValue || '')

  const value = () => (local.value !== undefined ? local.value : internalValue())

  const setValue = (newValue: string) => {
    if (local.value === undefined) {
      setInternalValue(newValue)
    }
    local.onChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div class={local.class} {...others}>
        {local.children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList(props: TabsListProps) {
  return (
    <div
      class={`inline-flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1 ${props.class || ''}`}
      role="tablist"
    >
      {props.children}
    </div>
  )
}

export function TabsTrigger(props: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const isActive = () => context.value() === props.value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive()}
      disabled={props.disabled}
      onClick={() => context.setValue(props.value)}
      class={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive()
          ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
      } ${props.class || ''}`}
    >
      {props.children}
    </button>
  )
}

export function TabsContent(props: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  return (
    <Show when={context.value() === props.value}>
      <div
        role="tabpanel"
        class={`mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${props.class || ''}`}
      >
        {props.children}
      </div>
    </Show>
  )
}

export default Tabs
