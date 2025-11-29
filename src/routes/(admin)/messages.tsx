import { createSignal, createEffect, For, Show } from 'solid-js'
import { Title } from '@solidjs/meta'
import { uiStore, actions as uiActions } from '~/stores/ui'
import { Button, Card, CardContent, Input } from '~/components/ui'
import type { Conversation, Message } from '~/types/message'

// 模拟会话数据
const mockConversations: Conversation[] = [
  {
    id: '1',
    type: 'private',
    name: '张三',
    avatar: 'https://ui-avatars.com/api/?name=张三&background=3B82F6&color=fff',
    lastMessage: '好的，我稍后处理一下',
    lastMessageTime: '2024-11-30T10:30:00Z',
    unreadCount: 2,
    online: true,
    members: [{ id: '1', name: '张三', avatar: 'https://ui-avatars.com/api/?name=张三' }],
  },
  {
    id: '2',
    type: 'group',
    name: '产品讨论组',
    avatar: 'https://ui-avatars.com/api/?name=产品&background=10B981&color=fff',
    lastMessage: '李四: 新版本已经发布了',
    lastMessageTime: '2024-11-30T09:45:00Z',
    unreadCount: 5,
    online: false,
    members: [
      { id: '1', name: '张三', avatar: 'https://ui-avatars.com/api/?name=张三' },
      { id: '2', name: '李四', avatar: 'https://ui-avatars.com/api/?name=李四' },
      { id: '3', name: '王五', avatar: 'https://ui-avatars.com/api/?name=王五' },
    ],
  },
  {
    id: '3',
    type: 'private',
    name: '李四',
    avatar: 'https://ui-avatars.com/api/?name=李四&background=F59E0B&color=fff',
    lastMessage: '收到，谢谢！',
    lastMessageTime: '2024-11-29T18:20:00Z',
    unreadCount: 0,
    online: false,
    members: [{ id: '2', name: '李四', avatar: 'https://ui-avatars.com/api/?name=李四' }],
  },
  {
    id: '4',
    type: 'group',
    name: '技术团队',
    avatar: 'https://ui-avatars.com/api/?name=技术&background=8B5CF6&color=fff',
    lastMessage: '王五: 代码已经提交了',
    lastMessageTime: '2024-11-29T16:10:00Z',
    unreadCount: 0,
    online: false,
    members: [
      { id: '1', name: '张三', avatar: 'https://ui-avatars.com/api/?name=张三' },
      { id: '3', name: '王五', avatar: 'https://ui-avatars.com/api/?name=王五' },
    ],
  },
]

// 模拟消息数据
const mockMessages: Message[] = [
  {
    id: '1',
    sender: { id: '1', name: '张三', avatar: 'https://ui-avatars.com/api/?name=张三' },
    content: '你好，有空吗？',
    createdAt: '2024-11-30T10:00:00Z',
    read: true,
  },
  {
    id: '2',
    sender: { id: 'me', name: '我', avatar: 'https://ui-avatars.com/api/?name=Me' },
    content: '在的，什么事？',
    createdAt: '2024-11-30T10:05:00Z',
    read: true,
  },
  {
    id: '3',
    sender: { id: '1', name: '张三', avatar: 'https://ui-avatars.com/api/?name=张三' },
    content: '项目文档需要你审核一下',
    createdAt: '2024-11-30T10:10:00Z',
    read: true,
  },
  {
    id: '4',
    sender: { id: 'me', name: '我', avatar: 'https://ui-avatars.com/api/?name=Me' },
    content: '好的，我看一下',
    createdAt: '2024-11-30T10:15:00Z',
    read: true,
  },
  {
    id: '5',
    sender: { id: '1', name: '张三', avatar: 'https://ui-avatars.com/api/?name=张三' },
    content: '好的，我稍后处理一下',
    createdAt: '2024-11-30T10:30:00Z',
    read: false,
  },
]

export default function MessagesPage() {
  const [conversations, setConversations] = createSignal<Conversation[]>(mockConversations)
  const [messages, setMessages] = createSignal<Message[]>(mockMessages)
  const [selectedConversation, setSelectedConversation] = createSignal<Conversation | null>(mockConversations[0])
  const [loading, setLoading] = createSignal(true)
  const [newMessage, setNewMessage] = createSignal('')
  const [searchTerm, setSearchTerm] = createSignal('')

  createEffect(() => {
    uiActions.setPageTitle('消息中心')
    uiActions.setBreadcrumbs([{ label: '消息中心', href: '/messages' }])
  })

  createEffect(() => {
    setTimeout(() => setLoading(false), 500)
  })

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return '昨天'
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }
  }

  const handleSendMessage = () => {
    if (!newMessage().trim()) return

    const msg: Message = {
      id: String(Date.now()),
      sender: { id: 'me', name: '我', avatar: 'https://ui-avatars.com/api/?name=Me' },
      content: newMessage(),
      createdAt: new Date().toISOString(),
      read: true,
    }

    setMessages([...messages(), msg])
    setNewMessage('')
  }

  const filteredConversations = () => {
    const term = searchTerm().toLowerCase()
    if (!term) return conversations()
    return conversations().filter((c) => c.name.toLowerCase().includes(term))
  }

  const totalUnread = () => conversations().reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <>
      <Title>消息中心 - HaloLight</Title>

      <div class="h-[calc(100vh-200px)] flex">
        <Show
          when={!loading()}
          fallback={
            <div class="flex-1 flex items-center justify-center">
              <div class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          }
        >
          {/* 会话列表 */}
          <div class="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
            {/* 搜索框 */}
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between mb-3">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">消息</h2>
                <Show when={totalUnread() > 0}>
                  <span class="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                    {totalUnread()}
                  </span>
                </Show>
              </div>
              <Input
                placeholder="搜索会话..."
                value={searchTerm()}
                onInput={(e) => setSearchTerm(e.currentTarget.value)}
              />
            </div>

            {/* 会话列表 */}
            <div class="flex-1 overflow-y-auto">
              <For each={filteredConversations()}>
                {(conversation) => (
                  <div
                    class={`p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedConversation()?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div class="flex items-start">
                      <div class="relative">
                        <img class="w-12 h-12 rounded-full" src={conversation.avatar} alt={conversation.name} />
                        <Show when={conversation.online}>
                          <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                        </Show>
                      </div>
                      <div class="ml-3 flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                          <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {conversation.name}
                          </h3>
                          <span class="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <div class="flex items-center justify-between mt-1">
                          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {typeof conversation.lastMessage === 'string'
                              ? conversation.lastMessage
                              : conversation.lastMessage.content}
                          </p>
                          <Show when={conversation.unreadCount > 0}>
                            <span class="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
                              {conversation.unreadCount}
                            </span>
                          </Show>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* 聊天区域 */}
          <div class="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
            <Show
              when={selectedConversation()}
              fallback={
                <div class="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  选择一个会话开始聊天
                </div>
              }
            >
              {/* 聊天头部 */}
              <div class="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <img
                      class="w-10 h-10 rounded-full"
                      src={selectedConversation()!.avatar}
                      alt={selectedConversation()!.name}
                    />
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">{selectedConversation()!.name}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {selectedConversation()!.online ? '在线' : '离线'}
                        {selectedConversation()!.type === 'group' && ` · ${selectedConversation()!.members.length} 人`}
                      </p>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>

              {/* 消息列表 */}
              <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <For each={messages()}>
                  {(message) => (
                    <div class={`flex ${message.sender.id === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div class={`flex items-end max-w-[70%] ${message.sender.id === 'me' ? 'flex-row-reverse' : ''}`}>
                        <img
                          class="w-8 h-8 rounded-full flex-shrink-0"
                          src={message.sender.avatar}
                          alt={message.sender.name}
                        />
                        <div class={`mx-2 ${message.sender.id === 'me' ? 'text-right' : ''}`}>
                          <div
                            class={`px-4 py-2 rounded-2xl ${
                              message.sender.id === 'me'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p class="text-sm">{message.content}</p>
                          </div>
                          <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>

              {/* 输入框 */}
              <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-2">
                  <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="输入消息..."
                    value={newMessage()}
                    onInput={(e) => setNewMessage(e.currentTarget.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button variant="primary" onClick={handleSendMessage}>
                    发送
                  </Button>
                </div>
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </>
  )
}
