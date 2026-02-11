import { describe, expect, it } from 'vitest'

import { canTransit, transitOrderStatus } from '@/modules/payment/stateMachine'

describe('payment state machine', () => {
  it('allows pending to paid', () => {
    expect(canTransit('pending', 'paid')).toBe(true)
    expect(transitOrderStatus('pending', 'paid')).toBe('paid')
  })

  it('rejects invalid transition', () => {
    expect(canTransit('paid', 'pending')).toBe(false)
    expect(() => transitOrderStatus('paid', 'pending')).toThrowError()
  })
})

