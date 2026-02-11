import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import { ensureVerified } from '@/modules/auth/guards'
import { useAuthStore } from '@/stores/auth.store'

vi.mock('vant', () => ({
  showFailToast: vi.fn(),
}))

describe('ensureVerified', () => {
  it('returns true when user verified', () => {
    setActivePinia(createPinia())
    const authStore = useAuthStore()
    authStore.setVerified('Tester')
    expect(ensureVerified()).toBe(true)
  })

  it('redirects to auth when unverified', () => {
    setActivePinia(createPinia())
    const push = vi.fn()
    const result = ensureVerified({ push } as unknown as { push: (path: string) => Promise<void> })
    expect(result).toBe(false)
    expect(push).toHaveBeenCalledWith('/auth')
  })
})

