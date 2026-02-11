import type { OrderStatus } from '@/types/domain'

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  created: ['pending'],
  pending: ['paid', 'failed'],
  paid: ['refunded'],
  failed: ['pending'],
  refunded: [],
}

export function canTransit(from: OrderStatus, to: OrderStatus): boolean {
  return validTransitions[from].includes(to)
}

export function transitOrderStatus(
  current: OrderStatus,
  next: OrderStatus,
): OrderStatus {
  if (!canTransit(current, next)) {
    throw new Error(`Invalid order transition: ${current} -> ${next}`)
  }

  return next
}

