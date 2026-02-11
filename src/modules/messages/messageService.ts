import { platformApi } from '@/services/adapters/platformApi'

export async function fetchMessages() {
  return platformApi.getMessages()
}

export async function markMessagesRead(ids: string[]) {
  return platformApi.readMessages({ ids })
}

