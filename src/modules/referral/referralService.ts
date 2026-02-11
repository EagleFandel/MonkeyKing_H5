import { platformApi } from '@/services/adapters/platformApi'

export async function fetchReferralSummary() {
  return platformApi.getReferralSummary()
}

export async function withdrawReferralBonus(amount: number, accountNo: string) {
  return platformApi.withdrawReferral({
    amount,
    accountType: 'wechat',
    accountNo,
  })
}

