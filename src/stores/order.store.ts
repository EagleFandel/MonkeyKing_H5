import { defineStore } from 'pinia'

import type { Order } from '@/types/domain'

interface OrderState {
  current: Order | null
  history: Order[]
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    current: null,
    history: [],
  }),
  actions: {
    setCurrent(order: Order) {
      this.current = order
      const index = this.history.findIndex((item) => item.id === order.id)
      if (index >= 0) {
        this.history[index] = order
        return
      }

      this.history.unshift(order)
    },
  },
})

