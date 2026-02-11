import { describe, expect, it } from 'vitest'

import type { ColorToken, MotionPreset, PageState } from '@/types/ui'

describe('UI design contracts', () => {
  it('supports key color tokens', () => {
    const token: ColorToken = 'brand.orange.600'
    expect(token).toBe('brand.orange.600')
  })

  it('supports page state set', () => {
    const state: PageState = 'loading'
    expect(state).toBe('loading')
  })

  it('supports motion presets', () => {
    const preset: MotionPreset = 'fade-slide'
    expect(preset).toBe('fade-slide')
  })
})

