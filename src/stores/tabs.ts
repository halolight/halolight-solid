import { createStore } from 'solid-js/store'

export interface TabItem {
  id: string
  title: string
  path: string
  closable?: boolean
}

interface TabsState {
  tabs: TabItem[]
  activeTabId: string | null
}

const homeTab: TabItem = { id: 'home', title: '首页', path: '/dashboard', closable: false }

const [tabsStore, setTabsStore] = createStore<TabsState>({
  tabs: [homeTab],
  activeTabId: homeTab.id,
})

export const tabsActions = {
  addTab(tab: Omit<TabItem, 'id'>) {
    const existing = tabsStore.tabs.find((t) => t.path === tab.path)
    if (existing) {
      setTabsStore('activeTabId', existing.id)
      return existing.id
    }
    const id = `tab-${Date.now()}`
    const next: TabItem = { ...tab, id, closable: tab.closable !== false }
    setTabsStore({
      tabs: [...tabsStore.tabs, next],
      activeTabId: id,
    })
    return id
  },

  setActiveTab(id: string) {
    if (tabsStore.tabs.some((t) => t.id === id)) {
      setTabsStore('activeTabId', id)
    }
  },

  removeTab(id: string) {
    const current = tabsStore.tabs.find((t) => t.id === id)
    if (!current || current.closable === false) return

    const remaining = tabsStore.tabs.filter((t) => t.id !== id)
    const nextActive = tabsStore.activeTabId === id ? remaining.at(-1)?.id ?? homeTab.id : tabsStore.activeTabId

    setTabsStore({
      tabs: remaining.length ? remaining : [homeTab],
      activeTabId: nextActive ?? homeTab.id,
    })
  },

  updateTab(id: string, updates: Partial<Omit<TabItem, 'id'>>) {
    const tabIndex = tabsStore.tabs.findIndex((t) => t.id === id)
    if (tabIndex === -1) return

    setTabsStore('tabs', tabIndex, (tab) => ({
      ...tab,
      ...updates,
    }))
  },

  getTabByPath(path: string) {
    return tabsStore.tabs.find((t) => t.path === path)
  },

  clearTabs() {
    setTabsStore({ tabs: [homeTab], activeTabId: homeTab.id })
  },
}

export { tabsStore }
