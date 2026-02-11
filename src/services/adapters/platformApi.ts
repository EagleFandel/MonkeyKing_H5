import { endpoints } from '@/services/endpoints'
import { request } from '@/services/apiClient'
import type {
  ComplaintRecord,
  MatchCandidate,
  MessageItem,
  Order,
  ReferralLedger,
} from '@/types/domain'
import type {
  ApplyJobRequest,
  ChatExtractRequest,
  ChatExtractResponse,
  ComplaintRequest,
  CreateOrderRequest,
  GenerateReportRequest,
  GenerateReportResponse,
  PayOrderRequest,
  ReadMessagesRequest,
  SearchMatchRequest,
  VerifyRequest,
  VerifyResponse,
  WithdrawReferralRequest,
} from '@/types/dto'

export const platformApi = {
  verify(payload: VerifyRequest) {
    return request<VerifyResponse>('POST', endpoints.authVerify, payload)
  },
  chatExtract(payload: ChatExtractRequest) {
    return request<ChatExtractResponse>('POST', endpoints.chatExtract, payload)
  },
  generateReport(payload: GenerateReportRequest) {
    return request<GenerateReportResponse>('POST', endpoints.reportGenerate, payload)
  },
  searchMatches(payload: SearchMatchRequest) {
    return request<MatchCandidate[]>('POST', endpoints.matchSearch, payload)
  },
  fetchProfile(id: string) {
    return request<MatchCandidate>('GET', endpoints.profileDetail(id))
  },
  createOrder(payload: CreateOrderRequest) {
    return request<Order>('POST', endpoints.orderCreate, payload)
  },
  payOrder(payload: PayOrderRequest) {
    return request<Order>('POST', endpoints.orderPay, payload)
  },
  queryOrderStatus(orderId: string) {
    return request<Order>('GET', endpoints.orderStatus(orderId))
  },
  applyJob(payload: ApplyJobRequest) {
    return request<{ accepted: boolean; reason?: string }>(
      'POST',
      endpoints.applications,
      payload,
    )
  },
  submitComplaint(payload: ComplaintRequest) {
    return request<ComplaintRecord>('POST', endpoints.complaints, payload)
  },
  getMessages() {
    return request<MessageItem[]>('GET', endpoints.messages)
  },
  readMessages(payload: ReadMessagesRequest) {
    return request<{ success: boolean }>('POST', endpoints.messagesRead, payload)
  },
  getReferralSummary() {
    return request<ReferralLedger>('GET', endpoints.referralSummary)
  },
  withdrawReferral(payload: WithdrawReferralRequest) {
    return request<{ success: boolean; remain: number }>(
      'POST',
      endpoints.referralWithdraw,
      payload,
    )
  },
}

