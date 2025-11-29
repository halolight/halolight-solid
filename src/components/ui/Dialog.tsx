import { JSX, createSignal, Show, onCleanup, onMount, createEffect } from 'solid-js'
import { Portal } from 'solid-js/web'

export interface DialogProps {
  open: boolean
  onClose: () => void
  children: JSX.Element
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  class?: string
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
}

export function Dialog(props: DialogProps) {
  const size = () => props.size || 'md'
  const closeOnOverlay = () => props.closeOnOverlay !== false
  const closeOnEscape = () => props.closeOnEscape !== false
  const showCloseButton = () => props.showCloseButton !== false

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape()) {
      props.onClose()
    }
  }

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlay()) {
      props.onClose()
    }
  }

  createEffect(() => {
    if (props.open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  })

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  })

  return (
    <Show when={props.open}>
      <Portal>
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* 背景遮罩 */}
          <div class="fixed inset-0 bg-black/50 transition-opacity" onClick={handleOverlayClick} />

          {/* 对话框内容 */}
          <div
            class={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizeStyles[size()]} transform transition-all ${props.class || ''}`}
          >
            {/* 关闭按钮 */}
            <Show when={showCloseButton()}>
              <button
                type="button"
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                onClick={props.onClose}
              >
                <span class="sr-only">关闭</span>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Show>

            {/* 标题和描述 */}
            <Show when={props.title || props.description}>
              <div class="px-6 pt-6 pb-4">
                <Show when={props.title}>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{props.title}</h3>
                </Show>
                <Show when={props.description}>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{props.description}</p>
                </Show>
              </div>
            </Show>

            {/* 内容 */}
            <div class={props.title || props.description ? '' : 'pt-6'}>{props.children}</div>
          </div>
        </div>
      </Portal>
    </Show>
  )
}

// 对话框内容区域
export interface DialogContentProps {
  children: JSX.Element
  class?: string
}

export function DialogContent(props: DialogContentProps) {
  return <div class={`px-6 py-4 ${props.class || ''}`}>{props.children}</div>
}

// 对话框底部操作区
export interface DialogFooterProps {
  children: JSX.Element
  class?: string
}

export function DialogFooter(props: DialogFooterProps) {
  return (
    <div
      class={`px-6 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg flex items-center justify-end gap-3 ${props.class || ''}`}
    >
      {props.children}
    </div>
  )
}

// 确认对话框
export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const variant = () => props.variant || 'danger'
  const confirmText = () => props.confirmText || '确认'
  const cancelText = () => props.cancelText || '取消'

  const variantStyles = {
    danger: {
      icon: 'text-red-600 bg-red-100 dark:bg-red-900/30',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
      icon: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    },
    info: {
      icon: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
  }

  const styles = () => variantStyles[variant()]

  return (
    <Dialog open={props.open} onClose={props.onClose} size="sm" showCloseButton={false}>
      <div class="p-6">
        <div class="flex items-start">
          <div class={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${styles().icon}`}>
            <Show when={variant() === 'danger'}>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </Show>
            <Show when={variant() === 'warning'}>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Show>
            <Show when={variant() === 'info'}>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Show>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{props.title}</h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{props.message}</p>
          </div>
        </div>
      </div>
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg flex justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={props.onClose}
          disabled={props.loading}
        >
          {cancelText()}
        </button>
        <button
          type="button"
          class={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${styles().button}`}
          onClick={props.onConfirm}
          disabled={props.loading}
        >
          <Show when={props.loading}>
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </Show>
          {confirmText()}
        </button>
      </div>
    </Dialog>
  )
}

export default Dialog
