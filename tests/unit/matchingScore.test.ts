import { describe, expect, it } from 'vitest'

import { calculateMatchingScore } from '@/utils/scoring/matchingScore'

describe('calculateMatchingScore', () => {
  it('calculates weighted score correctly', () => {
    const score = calculateMatchingScore({
      skill: 90,
      time: 80,
      budget: 70,
      performance: 85,
    })
    expect(score).toBe(83)
  })
})
