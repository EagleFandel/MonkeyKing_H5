import { defineStore } from 'pinia'

import type { UserRole } from '@/types/domain'

interface AuthState {
  role: UserRole
  verified: boolean
  realName: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    role: 'student',
    verified: false,
    realName: '',
  }),
  actions: {
    setRole(role: UserRole) {
      this.role = role
    },
    setVerified(realName: string) {
      this.verified = true
      this.realName = realName
    },
  },
})

