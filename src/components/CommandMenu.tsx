import { For, Show, createSignal, onMount, onCleanup, createEffect } from 'solid-js'
import { useNavigate, useLocation } from '@solidjs/router'
import { Portal } from 'solid-js/web'
import { actions as authActions, authStore } from '~/stores/auth'
import { uiStore, uiActions } from '~/stores/ui'

export interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Command {
  id: string
  label: string
  description?: string
  icon?: string
  group: string
  action: () => void
  shortcut?: string
  disabled?: boolean
}

const iconSvg = (icon: string) => {
  const icons: Record<string, string> = {
    dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    analytics: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    documents: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    files: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    messages: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    notifications: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    moon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  }
  return icons[icon] || icons.dashboard
}

export function CommandMenu(props: CommandMenuProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = createSignal('')
  let inputRef: HTMLInputElement | undefined

  // Navigation commands
  const navigationCommands: Command[] = [
    {
      id: 'nav-dashboard',
      label: '仪表盘',
      group: '导航',
      icon: 'dashboard',
      action: () => {
        navigate('/dashboard')
        props.onOpenChange(false)
      },
    },
    {
      id: 'nav-users',
      label: '用户管理',
      group: '���航',
      icon: 'users',
      action: () => {
        navigate('/users')
        props.onOpenChange(false)
      },
    },
    {
      id: 'nav-analytics',
      label: '数据分析',
      group: '导航',
      icon: 'analytics',
      action: () => {
        navigate('/analytics')
        props.onOpenChange(false)
      },
    },
    {
      id: 'nav-documents',
      label: '文档管理',
      group: '导航',
      icon: 'documents',
      action: () => {
        navigate('/documents')
        props.onOpenChange(false)
      },
    },
    {
      id: 'nav-files',
      label: '文件存储',
      group: '导航',
      icon: 'files',
      action: () => {
        navigate('/files')
        props.onOpenChange(false)
      },
    },
    {
      id: 'nav-messages',
      label: '消息中心',
      group: '导航',
      icon: 'messages',
      action: () => {
        navigate('/messages')
        props.onOpenChange(false)
      },
    },
    {
      id: 'nav-calendar',
      label: '日程安排',
      group: '导航',
      icon: 'calendar',
      action: () => {
        navigate('/calendar')
        props.onOpenChange(false)
      },
    },
    {
      id: 'nav-accounts',
      label: '账号与权限',
      group: '导航',
      icon: 'shield',
      action: () => {
        navigate('/accounts')
        props.onOpenChange(false)
      },
    },
    {
      id: 'nav-settings',
      label: '系统设置',
      group: '导航',
      icon: 'settings',
      action: () => {
        navigate('/settings')
        props.onOpenChange(false)
      },
    },
  ]

  // Theme commands
  const themeCommands: Command[] = [
    {
      id: 'theme-light',
      label: '浅色模式',
      group: '主题',
      icon: 'sun',
      action: () => {
        uiActions.setTheme('light')
        props.onOpenChange(false)
      },
    },
    {
      id: 'theme-dark',
      label: '深色模式',
      group: '主题',
      icon: 'moon',
      action: () => {
        uiActions.setTheme('dark')
        props.onOpenChange(false)
      },
    },
  ]

  // Account commands
  const accountCommands = (): Command[] => {
    const accounts = authStore.accounts
    if (accounts.length === 0) {
      return [
        {
          id: 'no-accounts',
          label: '暂无可切换的账号',
          group: '账号',
          icon: 'user',
          action: () => {},
          disabled: true,
        },
      ]
    }
    return accounts.map((account) => ({
      id: `account-${account.id}`,
      label: `切换为 ${account.name || account.email}`,
      description: authStore.activeAccountId === account.id ? '当前账号' : undefined,
      group: '账号',
      icon: 'user',
      action: () => {
        if (account.id !== authStore.activeAccountId) {
          authActions.switchAccount(account.id)
        }
        props.onOpenChange(false)
      },
      disabled: authStore.activeAccountId === account.id,
    }))
  }

  // Action commands
  const actionCommands: Command[] = [
    {
      id: 'action-search',
      label: '全局搜索',
      group: '操作',
      icon: 'search',
      shortcut: '⌘F',
      action: () => {
        console.log('全局搜索')
        props.onOpenChange(false)
      },
    },
    {
      id: 'action-logout',
      label: '退出登录',
      group: '操作',
      icon: 'logout',
      shortcut: '⌘Q',
      action: () => {
        authActions.logout()
        navigate('/login')
        props.onOpenChange(false)
      },
    },
  ]

  const allCommands = (): Command[] => {
    return [...navigationCommands, ...themeCommands, ...accountCommands(), ...actionCommands]
  }

  const filteredCommands = () => {
    const query = searchQuery().toLowerCase()
    if (!query) return allCommands()
    return allCommands().filter(
      (cmd) => cmd.label.toLowerCase().includes(query) || cmd.description?.toLowerCase().includes(query)
    )
  }

  const groupedCommands = () => {
    const groups: Record<string, Command[]> = {}
    filteredCommands().forEach((cmd) => {
      if (!groups[cmd.group]) {
        groups[cmd.group] = []
      }
      groups[cmd.group].push(cmd)
    })
    return groups
  }

  // Keyboard shortcuts
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        props.onOpenChange(!props.open)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown)
    })
  })

  // Focus input when opened
  createEffect(() => {
    if (props.open && inputRef) {
      setTimeout(() => inputRef?.focus(), 50)
    } else {
      setSearchQuery('')
    }
  })

  // Close on Escape
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      props.onOpenChange(false)
    }
  }

  const handleOverlayClick = () => {
    props.onOpenChange(false)
  }

  return (
    <Show when={props.open}>
      <Portal>
        <div class="fixed inset-0 z-50 flex items-start justify-center pt-20" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div class="fixed inset-0 bg-black/50 transition-opacity" onClick={handleOverlayClick} />

          {/* Command palette */}
          <div
            class="relative bg-background rounded-lg shadow-xl w-full max-w-2xl transform transition-all"
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div class="flex items-center border-b border-border px-4">
              <svg class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d={iconSvg('search')}
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                class="flex-1 bg-transparent border-none outline-none px-3 py-4 text-sm placeholder:text-muted-foreground"
                placeholder="输入命令或搜���..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
              />
              <kbd class="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Command list */}
            <div class="max-h-[400px] overflow-y-auto p-2">
              <Show
                when={Object.keys(groupedCommands()).length > 0}
                fallback={
                  <div class="py-6 text-center text-sm text-muted-foreground">未找到结果</div>
                }
              >
                <For each={Object.entries(groupedCommands())}>
                  {([group, commands]) => (
                    <div class="mb-2">
                      <div class="px-2 py-1.5 text-xs font-medium text-muted-foreground">{group}</div>
                      <For each={commands}>
                        {(command) => (
                          <button
                            type="button"
                            class={`w-full flex items-center gap-3 px-2 py-2 text-sm rounded-md transition-colors ${
                              command.disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-accent cursor-pointer'
                            }`}
                            onClick={() => !command.disabled && command.action()}
                            disabled={command.disabled}
                          >
                            <Show when={command.icon}>
                              <svg
                                class="h-4 w-4 text-muted-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d={iconSvg(command.icon!)}
                                />
                              </svg>
                            </Show>
                            <div class="flex-1 text-left">
                              <div>{command.label}</div>
                              <Show when={command.description}>
                                <div class="text-xs text-muted-foreground">{command.description}</div>
                              </Show>
                            </div>
                            <Show when={command.shortcut}>
                              <kbd class="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {command.shortcut}
                              </kbd>
                            </Show>
                          </button>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </Show>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  )
}

export default CommandMenu
