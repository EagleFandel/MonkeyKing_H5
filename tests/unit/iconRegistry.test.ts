import { describe, expect, it } from 'vitest'

import { iconRegistry } from '@/components/icons/icons'
import type { IconName } from '@/components/icons/types'

describe('iconRegistry', () => {
  it('contains all icon names', () => {
    const required: IconName[] = [
      'brand-monkey',
      'bell',
      'home',
      'discover',
      'project',
      'tutor',
      'profile',
      'sparring',
      'assistant',
      'shield',
      'bonus',
      'match',
      'status-default',
      'status-loading',
      'status-empty',
      'status-error',
      'status-success',
    ]

    for (const name of required) {
      expect(iconRegistry[name]).toBeTruthy()
      expect(iconRegistry[name].strokes.length).toBeGreaterThan(0)
    }
  })

  it('has no duplicated keys by type inference', () => {
    const keys = Object.keys(iconRegistry)
    const unique = new Set(keys)
    expect(unique.size).toBe(keys.length)
  })
})

