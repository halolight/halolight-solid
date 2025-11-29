import { For, Show, createSignal, onCleanup, onMount, createEffect } from 'solid-js'
import { useNavigate, useLocation } from '@solidjs/router'
import { tabsActions, tabsStore } from '~/stores/tabs'
import { uiStore } from '~/stores/ui'

// Path to title mapping
const pathTitles: Record<string, string> = {
  '/dashboard': '仪表盘',
  '/users': '用户管理',
  '/accounts': '账号与权限',
  '/analytics': '数据分析',
  '/settings': '系统设置',
  '/documents': '文档管理',
  '/files': '文件管理',
  '/messages': '消息中心',
  '/calendar': '日程管理',
  '/notifications': '通知中心',
  '/profile': '个人资料',
}

const resolveTitle = (path: string) => {
  const match = Object.entries(pathTitles).find(([key]) => path === key || path.startsWith(`${key}/`))
  return match ? match[1] : path.split('/').pop() || '新页面'
}

export default function TabBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [canScrollLeft, setCanScrollLeft] = createSignal(false)
  const [canScrollRight, setCanScrollRight] = createSignal(false)
  const [contextMenuTab, setContextMenuTab] = createSignal<string | null>(null)
  const [contextMenuPos, setContextMenuPos] = createSignal({ x: 0, y: 0 })
  let containerRef: HTMLDivElement | undefined

  const checkScroll = () => {
    if (!containerRef) return
    setCanScrollLeft(containerRef.scrollLeft > 0)
    setCanScrollRight(containerRef.scrollLeft < containerRef.scrollWidth - containerRef.clientWidth)
  }

  const scroll = (dir: 'left' | 'right') => {
    if (!containerRef) return
    containerRef.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  const scrollToActiveTab = () => {
    if (!containerRef) return
    const activeTab = containerRef.querySelector(`[data-tab-id="${tabsStore.activeTabId}"]`)
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  // Monitor route changes and auto-add tabs
  createEffect(() => {
    const pathname = location.pathname
    if (pathname) {
      const existingTab = tabsActions.getTabByPath(pathname)
      const title = resolveTitle(pathname)
      if (existingTab) {
        tabsActions.setActiveTab(existingTab.id)
        if (existingTab.title !== title) {
          tabsActions.updateTab(existingTab.id, { title })
        }
      } else {
        tabsActions.addTab({ title, path: pathname })
      }
    }
  })

  // Monitor tab changes and scroll to active tab
  createEffect(() => {
    const _ = tabsStore.tabs.length
    const __ = tabsStore.activeTabId
    checkScroll()
    scrollToActiveTab()
  })

  onMount(() => {
    const observer = new ResizeObserver(checkScroll)
    if (containerRef) observer.observe(containerRef)
    containerRef?.addEventListener('scroll', checkScroll)

    // Close context menu on click outside
    const handleClick = () => setContextMenuTab(null)
    document.addEventListener('click', handleClick)

    onCleanup(() => {
      observer.disconnect()
      containerRef?.removeEventListener('scroll', checkScroll)
      document.removeEventListener('click', handleClick)
    })
  })

  const handleTabClick = (path: string, id: string) => {
    if (tabsStore.activeTabId !== id) {
      tabsActions.setActiveTab(id)
    }
    if (location.pathname !== path) navigate(path)
  }

  const handleCloseTab = (e: MouseEvent, id: string) => {
    e.stopPropagation()
    const tab = tabsStore.tabs.find((t) => t.id === id)
    if (!tab || tab.closable === false) return

    const currentIndex = tabsStore.tabs.findIndex((t) => t.id === id)
    tabsActions.removeTab(id)

    // Navigate if closing active tab
    if (id === tabsStore.activeTabId) {
      const nextTab = tabsStore.tabs[currentIndex + 1] || tabsStore.tabs[currentIndex - 1]
      if (nextTab) {
        navigate(nextTab.path)
      }
    }
  }

  const handleContextMenu = (e: MouseEvent, tabId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenuTab(tabId)
    setContextMenuPos({ x: e.clientX, y: e.clientY })
  }

  const handleCloseOthers = (tabId: string) => {
    const tab = tabsStore.tabs.find((t) => t.id === tabId)
    if (!tab) return

    const otherTabs = tabsStore.tabs.filter((t) => t.id !== tabId && t.closable !== false)
    otherTabs.forEach((t) => tabsActions.removeTab(t.id))

    tabsActions.setActiveTab(tabId)
    if (location.pathname !== tab.path) {
      navigate(tab.path)
    }
    setContextMenuTab(null)
  }

  const handleCloseRight = (tabId: string) => {
    const tabIndex = tabsStore.tabs.findIndex((t) => t.id === tabId)
    const rightTabs = tabsStore.tabs.slice(tabIndex + 1).filter((t) => t.closable !== false)
    rightTabs.forEach((t) => tabsActions.removeTab(t.id))
    setContextMenuTab(null)
  }

  const handleCloseAll = () => {
    tabsActions.clearTabs()
    navigate('/dashboard')
    setContextMenuTab(null)
  }

  if (!uiStore.showTabBar) return null
  if (tabsStore.tabs.length <= 1) return null

  return (
    <div class="relative flex h-12 items-center border-b border-border bg-background/95 backdrop-blur">
      <Show when={canScrollLeft()}>
        <button
          class="h-8 w-8 flex items-center justify-center hover:bg-accent/50 transition-colors"
          onClick={() => scroll('left')}
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </Show>

      <div ref={containerRef} class="flex-1 flex items-center overflow-x-auto gap-px scrollbar-hide">
        <For each={tabsStore.tabs}>
          {(tab) => (
            <div
              data-tab-id={tab.id}
              class={`group relative flex items-center gap-1 px-3 py-2 cursor-pointer border-r border-border transition-colors min-w-[100px] max-w-[200px] ${
                tab.id === tabsStore.activeTabId
                  ? 'bg-background text-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              onClick={() => handleTabClick(tab.path, tab.id)}
              onContextMenu={(e) => handleContextMenu(e, tab.id)}
            >
              {/* Active indicator */}
              <Show when={tab.id === tabsStore.activeTabId}>
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              </Show>

              <span class="truncate text-sm">{tab.title}</span>

              {/* Close button */}
              <Show when={tab.closable !== false}>
                <button
                  class={`h-4 w-4 p-0 transition-opacity rounded-sm hover:bg-muted-foreground/20 ${
                    tab.id === tabsStore.activeTabId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  onClick={(e) => handleCloseTab(e, tab.id)}
                >
                  <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Show>
            </div>
          )}
        </For>
      </div>

      <Show when={canScrollRight()}>
        <button
          class="h-8 w-8 flex items-center justify-center hover:bg-accent/50 transition-colors"
          onClick={() => scroll('right')}
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Show>

      {/* Context Menu */}
      <Show when={contextMenuTab()}>
        <div
          class="fixed z-50 min-w-[160px] rounded-md border bg-popover p-1 shadow-md"
          style={{
            left: `${contextMenuPos().x}px`,
            top: `${contextMenuPos().y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Show when={tabsStore.tabs.find((t) => t.id === contextMenuTab())?.closable !== false}>
            <button
              class="w-full px-2 py-1.5 text-sm text-left rounded-sm hover:bg-accent transition-colors"
              onClick={() => {
                if (contextMenuTab()) {
                  const tab = tabsStore.tabs.find((t) => t.id === contextMenuTab())
                  if (tab) {
                    const e = new MouseEvent('click')
                    handleCloseTab(e, tab.id)
                  }
                }
                setContextMenuTab(null)
              }}
            >
              关闭标签
            </button>
          </Show>
          <button
            class="w-full px-2 py-1.5 text-sm text-left rounded-sm hover:bg-accent transition-colors"
            onClick={() => contextMenuTab() && handleCloseOthers(contextMenuTab()!)}
          >
            关闭其他
          </button>
          <button
            class="w-full px-2 py-1.5 text-sm text-left rounded-sm hover:bg-accent transition-colors"
            onClick={() => contextMenuTab() && handleCloseRight(contextMenuTab()!)}
          >
            关闭右侧
          </button>
          <div class="my-1 h-px bg-border" />
          <button
            class="w-full px-2 py-1.5 text-sm text-left rounded-sm hover:bg-accent transition-colors"
            onClick={handleCloseAll}
          >
            关闭所有
          </button>
        </div>
      </Show>
    </div>
  )
}
