export type UserRole = 'entrepreneur' | 'parent' | 'student' | 'coach'

export type SceneType = 'project' | 'tutor' | 'sparring' | 'job'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  traceId: string
}

export interface ProjectRequirement {
  projectType: string
  techStack: string[]
  budgetMin: number
  budgetMax: number
  startDate: string
  endDate: string
  personalityTraits: string[]
  description: string
}

export interface TutorRequirement {
  grade: string
  subjects: string[]
  schedule: string
  mode: 'online' | 'offline'
  location: string
  budget?: number
  customNeeds?: string
}

export interface SparringRequirement {
  sportType: string
  timeSlots: string
  location: string
  needGuidance: boolean
  currentLevel?: 'beginner' | 'intermediate' | 'advanced'
  improvementGoals?: string
  budget?: number
}

export interface TalentProfile {
  skills: Array<{
    name: string
    level: 'beginner' | 'intermediate' | 'advanced'
  }>
  availableTime: string
  expectedPay: string
  interests: string[]
  intro?: string
  personalityTags?: string[]
  workStyle?: string
}

export interface MatchCandidate {
  id: string
  scene: SceneType
  name: string
  major: string
  tags: string[]
  experience: string
  rating: number
  matchScore: number
  price: string
  highlights?: string[]
}

export type OrderStatus = 'created' | 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  scene: SceneType
  targetId: string
  amount: number
  status: OrderStatus
  channel: 'wechat' | 'alipay'
  createdAt: string
}

export interface MessageItem {
  id: string
  type: 'system' | 'interactive' | 'referral'
  title: string
  content: string
  createdAt: string
  read: boolean
}

export interface ComplaintRecord {
  id: string
  scene: SceneType
  againstId: string
  reason: string
  evidence: string
  status: 'submitted' | 'processing' | 'resolved'
  createdAt: string
}

export interface ReferralLedger {
  totalBonus: number
  pendingBonus: number
  withdrawableBonus: number
  records: Array<{
    id: string
    invitee: string
    tradeType: string
    bonus: number
    createdAt: string
  }>
}

