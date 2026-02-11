import { describe, expect, it } from 'vitest'

import { parseByRules } from '@/modules/chat-agent/ruleEngine'

describe('ruleEngine.parseByRules', () => {
  it('detects project intent and extracts budget', () => {
    const result = parseByRules('project', '我需要做电商小程序，预算5000元，周期2个月')
    expect(result.scene).toBe('project')
    expect(result.intent).toContain('project')
    expect(result.extracted.budget).toBe(5000)
  })

  it('returns follow up question when budget missing', () => {
    const result = parseByRules('tutor', '孩子初二，想补数学，每周三次')
    expect(result.followUpQuestion).toBeTruthy()
  })
})

