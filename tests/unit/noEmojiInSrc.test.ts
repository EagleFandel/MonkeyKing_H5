import { describe, expect, it } from 'vitest'

import home from '@/pages/home/HomePage.vue?raw'
import layout from '@/layouts/DefaultLayout.vue?raw'
import statusState from '@/components/common/StatusState.vue?raw'
import assistant from '@/components/chat/DodoAssistantPanel.vue?raw'

const emojiPattern = /[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u

describe('emoji cleanup', () => {
  it('keeps key files emoji-free', () => {
    const keyFiles = [home, layout, statusState, assistant]
    for (const content of keyFiles) {
      expect(emojiPattern.test(content)).toBe(false)
    }
  })
})

