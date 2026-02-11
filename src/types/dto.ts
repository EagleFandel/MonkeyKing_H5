import type {
  ProjectRequirement,
  SceneType,
  SparringRequirement,
  TalentProfile,
  TutorRequirement,
  UserRole,
} from './domain'

export interface VerifyRequest {
  role: UserRole
  realName: string
  idNumber: string
  selfieToken: string
}

export interface VerifyResponse {
  verified: boolean
  reason?: string
}

export interface ChatExtractRequest {
  scene: SceneType
  text: string
}

export interface ChatExtractResponse {
  scene: SceneType
  intent: string
  extracted: Partial<
    ProjectRequirement & TutorRequirement & SparringRequirement & TalentProfile
  >
  followUpQuestion?: string
  reportDraft: string
}

export interface GenerateReportRequest {
  scene: SceneType
  payload: Record<string, unknown>
}

export interface GenerateReportResponse {
  reportId: string
  reportContent: string
  downloadUrl: string
}

export interface SearchMatchRequest {
  scene: SceneType
  payload: Record<string, unknown>
}

export interface CreateOrderRequest {
  scene: SceneType
  targetId: string
  amount: number
  channel: 'wechat' | 'alipay'
}

export interface PayOrderRequest {
  orderId: string
  status: 'paid' | 'failed'
}

export interface ApplyJobRequest {
  candidateId: string
  profile: TalentProfile
  note?: string
}

export interface ComplaintRequest {
  scene: SceneType
  againstId: string
  reason: string
  evidence: string
}

export interface ReadMessagesRequest {
  ids: string[]
}

export interface WithdrawReferralRequest {
  amount: number
  accountType: 'wechat' | 'alipay'
  accountNo: string
}

