import { platformApi } from '@/services/adapters/platformApi'

export async function fetchProfileDetail(id: string) {
  return platformApi.fetchProfile(id)
}

