import { JSX, For, Show, createSignal } from 'solid-js'

// 表格列定义
export interface TableColumn<T = any> {
  key: string
  title: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  render?: (value: any, record: T, index: number) => JSX.Element
}

// 表格属性
export interface TableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  rowKey?: string | ((record: T) => string)
  loading?: boolean
  emptyText?: string
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
  class?: string
  onRowClick?: (record: T, index: number) => void
  // 排序
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string, order: 'asc' | 'desc') => void
  // 选择
  selectable?: boolean
  selectedKeys?: string[]
  onSelect?: (keys: string[], records: T[]) => void
}

export function Table<T extends Record<string, any>>(props: TableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof props.rowKey === 'function') {
      return props.rowKey(record)
    }
    if (props.rowKey) {
      return String(record[props.rowKey])
    }
    return String(index)
  }

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || !props.onSort) return

    const newOrder = props.sortKey === column.key && props.sortOrder === 'asc' ? 'desc' : 'asc'
    props.onSort(column.key, newOrder)
  }

  const isAllSelected = () => {
    if (!props.selectable || !props.selectedKeys || props.data.length === 0) return false
    return props.data.every((record, index) => props.selectedKeys!.includes(getRowKey(record, index)))
  }

  const isSomeSelected = () => {
    if (!props.selectable || !props.selectedKeys || props.data.length === 0) return false
    const selectedCount = props.data.filter((record, index) =>
      props.selectedKeys!.includes(getRowKey(record, index))
    ).length
    return selectedCount > 0 && selectedCount < props.data.length
  }

  const handleSelectAll = () => {
    if (!props.onSelect) return

    if (isAllSelected()) {
      props.onSelect([], [])
    } else {
      const keys = props.data.map((record, index) => getRowKey(record, index))
      props.onSelect(keys, [...props.data])
    }
  }

  const handleSelectRow = (record: T, index: number) => {
    if (!props.onSelect || !props.selectedKeys) return

    const key = getRowKey(record, index)
    const isSelected = props.selectedKeys.includes(key)

    if (isSelected) {
      const newKeys = props.selectedKeys.filter((k) => k !== key)
      const newRecords = props.data.filter((r, i) => newKeys.includes(getRowKey(r, i)))
      props.onSelect(newKeys, newRecords)
    } else {
      const newKeys = [...props.selectedKeys, key]
      const newRecords = props.data.filter((r, i) => newKeys.includes(getRowKey(r, i)))
      props.onSelect(newKeys, newRecords)
    }
  }

  const tableClass = () => {
    const classes = ['min-w-full divide-y divide-gray-200 dark:divide-gray-700']
    if (props.bordered) classes.push('border border-gray-200 dark:border-gray-700')
    return classes.join(' ')
  }

  const rowClass = (index: number) => {
    const classes: string[] = []
    if (props.striped && index % 2 === 1) {
      classes.push('bg-gray-50 dark:bg-gray-800/50')
    }
    if (props.hoverable) {
      classes.push('hover:bg-gray-100 dark:hover:bg-gray-700/50')
    }
    if (props.onRowClick) {
      classes.push('cursor-pointer')
    }
    return classes.join(' ')
  }

  const cellClass = (column: TableColumn<T>) => {
    const classes = [props.compact ? 'px-4 py-2' : 'px-6 py-4', 'whitespace-nowrap text-sm']
    if (column.align === 'center') classes.push('text-center')
    else if (column.align === 'right') classes.push('text-right')
    else classes.push('text-left')
    return classes.join(' ')
  }

  const headerCellClass = (column: TableColumn<T>) => {
    const classes = [
      props.compact ? 'px-4 py-2' : 'px-6 py-3',
      'text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
    ]
    if (column.align === 'center') classes.push('text-center')
    else if (column.align === 'right') classes.push('text-right')
    else classes.push('text-left')
    if (column.sortable) classes.push('cursor-pointer hover:text-gray-700 dark:hover:text-gray-200')
    return classes.join(' ')
  }

  return (
    <div class={`overflow-x-auto ${props.class || ''}`}>
      <table class={tableClass()}>
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            {/* 选择列 */}
            <Show when={props.selectable}>
              <th class={`${props.compact ? 'px-4 py-2' : 'px-6 py-3'} w-12`}>
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={isAllSelected()}
                  ref={(el) => {
                    el.indeterminate = isSomeSelected()
                  }}
                  onChange={handleSelectAll}
                />
              </th>
            </Show>

            {/* 数据列 */}
            <For each={props.columns}>
              {(column) => (
                <th
                  class={headerCellClass(column)}
                  style={{
                    width: column.width
                      ? typeof column.width === 'number'
                        ? `${column.width}px`
                        : column.width
                      : undefined,
                  }}
                  onClick={() => handleSort(column)}
                >
                  <div class="flex items-center gap-1">
                    <span>{column.title}</span>
                    <Show when={column.sortable}>
                      <span class="flex flex-col">
                        <svg
                          class={`h-3 w-3 ${props.sortKey === column.key && props.sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5 12l5-5 5 5H5z" />
                        </svg>
                        <svg
                          class={`h-3 w-3 -mt-1 ${props.sortKey === column.key && props.sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5 8l5 5 5-5H5z" />
                        </svg>
                      </span>
                    </Show>
                  </div>
                </th>
              )}
            </For>
          </tr>
        </thead>

        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {/* 加载状态 */}
          <Show when={props.loading}>
            <tr>
              <td colspan={props.columns.length + (props.selectable ? 1 : 0)} class="px-6 py-12 text-center">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span class="ml-2 text-gray-500 dark:text-gray-400">加载中...</span>
                </div>
              </td>
            </tr>
          </Show>

          {/* 空数据状态 */}
          <Show when={!props.loading && props.data.length === 0}>
            <tr>
              <td
                colspan={props.columns.length + (props.selectable ? 1 : 0)}
                class="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
              >
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p class="mt-2">{props.emptyText || '暂无数据'}</p>
              </td>
            </tr>
          </Show>

          {/* 数据行 */}
          <Show when={!props.loading && props.data.length > 0}>
            <For each={props.data}>
              {(record, index) => (
                <tr class={rowClass(index())} onClick={() => props.onRowClick?.(record, index())}>
                  {/* 选择框 */}
                  <Show when={props.selectable}>
                    <td class={`${props.compact ? 'px-4 py-2' : 'px-6 py-4'} w-12`}>
                      <input
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={props.selectedKeys?.includes(getRowKey(record, index()))}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleSelectRow(record, index())
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  </Show>

                  {/* 数据单元格 */}
                  <For each={props.columns}>
                    {(column) => (
                      <td class={cellClass(column)}>
                        <Show
                          when={column.render}
                          fallback={<span class="text-gray-900 dark:text-white">{record[column.key]}</span>}
                        >
                          {column.render?.(record[column.key], record, index())}
                        </Show>
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </Show>
        </tbody>
      </table>
    </div>
  )
}

// 分页组件
export interface PaginationProps {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  showSizeChanger?: boolean
  showTotal?: boolean
  class?: string
}

export function Pagination(props: PaginationProps) {
  const totalPages = () => Math.ceil(props.total / props.pageSize)
  const pageSizeOptions = () => props.pageSizeOptions || [10, 20, 50, 100]

  const pageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const total = totalPages()
    const current = props.current

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      if (current > 3) pages.push('ellipsis')
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i)
      }
      if (current < total - 2) pages.push('ellipsis')
      pages.push(total)
    }

    return pages
  }

  return (
    <div class={`flex items-center justify-between ${props.class || ''}`}>
      {/* 总数显示 */}
      <Show when={props.showTotal}>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          共 <span class="font-medium">{props.total}</span> 条
        </div>
      </Show>

      <div class="flex items-center gap-4">
        {/* 每页条数选择 */}
        <Show when={props.showSizeChanger}>
          <select
            class="text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500"
            value={props.pageSize}
            onChange={(e) => props.onPageSizeChange?.(Number(e.target.value))}
          >
            <For each={pageSizeOptions()}>{(size) => <option value={size}>{size} 条/页</option>}</For>
          </select>
        </Show>

        {/* 分页按钮 */}
        <nav class="flex items-center gap-1">
          {/* 上一页 */}
          <button
            type="button"
            class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={props.current <= 1}
            onClick={() => props.onChange(props.current - 1)}
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 页码 */}
          <For each={pageNumbers()}>
            {(page) => (
              <Show
                when={page !== 'ellipsis'}
                fallback={<span class="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>}
              >
                <button
                  type="button"
                  class={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    page === props.current
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => props.onChange(page as number)}
                >
                  {page}
                </button>
              </Show>
            )}
          </For>

          {/* 下一页 */}
          <button
            type="button"
            class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={props.current >= totalPages()}
            onClick={() => props.onChange(props.current + 1)}
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default Table
