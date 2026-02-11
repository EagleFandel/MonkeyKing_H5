export const endpoints = {
  authVerify: '/auth/verify',
  chatExtract: '/chat/extract',
  reportGenerate: '/reports/generate',
  matchSearch: '/matching/search',
  profileDetail: (id: string) => `/profiles/${id}`,
  orderCreate: '/orders/create',
  orderPay: '/orders/pay',
  orderStatus: (id: string) => `/orders/${id}/status`,
  applications: '/applications',
  complaints: '/complaints',
  messages: '/messages',
  messagesRead: '/messages/read',
  referralSummary: '/referral/summary',
  referralWithdraw: '/referral/withdraw',
}

