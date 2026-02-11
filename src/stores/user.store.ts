import { defineStore } from 'pinia'

import type { TalentProfile } from '@/types/domain'

interface UserState {
  talentProfile: TalentProfile | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    talentProfile: null,
  }),
  actions: {
    setTalentProfile(profile: TalentProfile) {
      this.talentProfile = profile
    },
  },
})

