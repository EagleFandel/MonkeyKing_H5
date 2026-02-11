import type { MessageItem } from '@/types/domain'

export const messageFixtures: MessageItem[] = [
  {
    id: 'msg-1',
    type: 'system',
    title: '实名认证审核通过',
    content: '你已通过实名认证，可使用全部核心功能。',
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: 'msg-2',
    type: 'interactive',
    title: '兼职申请已反馈',
    content: '海报设计兼职已通过，请尽快联系负责人。',
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'msg-3',
    type: 'referral',
    title: '推荐返利到账',
    content: '好友首单完成，返利 28 元已入账。',
    createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    read: true,
  },
]

