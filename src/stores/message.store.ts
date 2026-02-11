import { defineStore } from 'pinia'

import type { MessageItem } from '@/types/domain'

interface MessageState {
  list: MessageItem[]
}

export const useMessageStore = defineStore('message', {
  state: (): MessageState => ({
    list: [],
  }),
  getters: {
    unreadCount(state) {
      return state.list.filter((item) => !item.read).length
    },
  },
  actions: {
    setMessages(messages: MessageItem[]) {
      this.list = messages
    },
    markRead(ids: string[]) {
      this.list = this.list.map((item) =>
        ids.includes(item.id) ? { ...item, read: true } : item,
      )
    },
  },
})

