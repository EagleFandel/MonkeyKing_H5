import { showFailToast } from 'vant'

import { useAuthStore } from '@/stores/auth.store'

type Redirector = {
  push: (path: string) => unknown
}

export function ensureVerified(router?: Redirector): boolean {
  const authStore = useAuthStore()
  if (authStore.verified) {
    return true
  }

  showFailToast('请先完成实名认证后再继续')
  if (router) {
    void router.push('/auth')
  }
  return false
}

