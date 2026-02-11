import type { ReferralLedger } from '@/types/domain'

export const referralFixture: ReferralLedger = {
  totalBonus: 328,
  pendingBonus: 56,
  withdrawableBonus: 272,
  records: [
    {
      id: 'ref-1',
      invitee: '张同学',
      tradeType: '家教联系方式付费',
      bonus: 28,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ref-2',
      invitee: '李家长',
      tradeType: '陪练预约支付',
      bonus: 44,
      createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
    },
  ],
}

