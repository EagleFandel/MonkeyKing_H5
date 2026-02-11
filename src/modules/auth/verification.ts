import { verifySchema } from '@/utils/validators/schemas'

export function canSubmitVerification(payload: unknown): boolean {
  return verifySchema.safeParse(payload).success
}

