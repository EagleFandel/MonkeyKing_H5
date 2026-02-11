import { http, HttpResponse } from 'msw'

import type { ComplaintRecord, MatchCandidate, MessageItem, Order } from '@/types/domain'
import { parseByRules } from '@/modules/chat-agent/ruleEngine'
import { candidateFixtures } from '@/mocks/fixtures/candidates'
import { messageFixtures } from '@/mocks/fixtures/messages'
import { referralFixture } from '@/mocks/fixtures/referral'

const traceId = () => `trace-${Math.random().toString(36).slice(2, 10)}`

let orderMemory: Order[] = []
let messageMemory: MessageItem[] = [...messageFixtures]
let complaintMemory: ComplaintRecord[] = []

function ok<T>(data: T) {
  return HttpResponse.json({ code: 0, message: 'ok', data, traceId: traceId() })
}

export const handlers = [
  http.post('/api/auth/verify', async ({ request }) => {
    const body = (await request.json()) as {
      role?: string
      realName?: string
      idNumber?: string
      selfieToken?: string
    }
    if (
      !body.realName ||
      !body.idNumber ||
      !body.selfieToken ||
      body.idNumber.length < 8
    ) {
      return HttpResponse.json(
        {
          code: 400,
          message: '实名认证信息不完整',
          data: { verified: false, reason: 'invalid_payload' },
          traceId: traceId(),
        },
        { status: 400 },
      )
    }

    return ok({ verified: true })
  }),

  http.post('/api/chat/extract', async ({ request }) => {
    const body = (await request.json()) as {
      scene: 'project' | 'tutor' | 'sparring' | 'job'
      text: string
    }
    return ok(parseByRules(body.scene, body.text))
  }),

  http.post('/api/reports/generate', async ({ request }) => {
    const body = (await request.json()) as { scene: string; payload: Record<string, unknown> }
    return ok({
      reportId: `report-${Date.now()}`,
      reportContent: `【${body.scene}】报告已生成，核心字段：${Object.keys(body.payload ?? {}).join('、')}`,
      downloadUrl: '/mock-assets/sample-report.pdf',
    })
  }),

  http.post('/api/matching/search', async ({ request }) => {
    const body = (await request.json()) as { scene: MatchCandidate['scene'] }
    const list = candidateFixtures.filter((item) => item.scene === body.scene)
    return ok(list)
  }),

  http.get('/api/profiles/:id', ({ params }) => {
    const detail = candidateFixtures.find((item) => item.id === params.id)
    if (!detail) {
      return HttpResponse.json(
        {
          code: 404,
          message: '未找到候选人',
          data: null,
          traceId: traceId(),
        },
        { status: 404 },
      )
    }

    return ok(detail)
  }),

  http.post('/api/orders/create', async ({ request }) => {
    const body = (await request.json()) as {
      scene: Order['scene']
      targetId: string
      amount: number
      channel: Order['channel']
    }
    if (!Number.isFinite(body.amount) || body.amount <= 0 || body.amount > 100_000) {
      return HttpResponse.json(
        {
          code: 400,
          message: '订单金额不合法',
          data: null,
          traceId: traceId(),
        },
        { status: 400 },
      )
    }

    const order: Order = {
      id: `order-${Date.now()}`,
      scene: body.scene,
      targetId: body.targetId,
      amount: body.amount,
      channel: body.channel,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    orderMemory = [order, ...orderMemory]
    return ok(order)
  }),

  http.post('/api/orders/pay', async ({ request }) => {
    const body = (await request.json()) as { orderId: string; status: 'paid' | 'failed' }
    const found = orderMemory.find((item) => item.id === body.orderId)
    if (!found) {
      return HttpResponse.json(
        {
          code: 404,
          message: '订单不存在',
          data: null,
          traceId: traceId(),
        },
        { status: 404 },
      )
    }

    if (found.status !== 'pending') {
      return HttpResponse.json(
        {
          code: 409,
          message: '当前订单状态不可支付或取消',
          data: found,
          traceId: traceId(),
        },
        { status: 409 },
      )
    }

    found.status = body.status
    return ok(found)
  }),

  http.get('/api/orders/:id/status', ({ params }) => {
    const found = orderMemory.find((item) => item.id === params.id)
    if (!found) {
      return HttpResponse.json(
        {
          code: 404,
          message: '订单不存在',
          data: null,
          traceId: traceId(),
        },
        { status: 404 },
      )
    }

    return ok(found)
  }),

  http.post('/api/applications', async () => {
    return ok({ accepted: true })
  }),

  http.post('/api/complaints', async ({ request }) => {
    const body = (await request.json()) as {
      scene: ComplaintRecord['scene']
      againstId: string
      reason: string
      evidence: string
    }
    const record: ComplaintRecord = {
      id: `complaint-${Date.now()}`,
      scene: body.scene,
      againstId: body.againstId,
      reason: body.reason,
      evidence: body.evidence,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    }
    complaintMemory = [record, ...complaintMemory]
    return ok(record)
  }),

  http.get('/api/messages', () => {
    return ok(messageMemory)
  }),

  http.post('/api/messages/read', async ({ request }) => {
    const body = (await request.json()) as { ids: string[] }
    messageMemory = messageMemory.map((item) =>
      body.ids.includes(item.id) ? { ...item, read: true } : item,
    )
    return ok({ success: true })
  }),

  http.get('/api/referral/summary', () => {
    return ok(referralFixture)
  }),

  http.post('/api/referral/withdraw', async ({ request }) => {
    const body = (await request.json()) as { amount: number }
    if (!Number.isFinite(body.amount) || body.amount <= 0) {
      return HttpResponse.json(
        {
          code: 400,
          message: '提现金额不合法',
          data: null,
          traceId: traceId(),
        },
        { status: 400 },
      )
    }

    if (body.amount > referralFixture.withdrawableBonus) {
      return HttpResponse.json(
        {
          code: 400,
          message: '可提现余额不足',
          data: null,
          traceId: traceId(),
        },
        { status: 400 },
      )
    }

    const remain = referralFixture.withdrawableBonus - body.amount
    referralFixture.withdrawableBonus = remain
    return ok({ success: true, remain })
  }),
]

