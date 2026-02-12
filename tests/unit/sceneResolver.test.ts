import { describe, expect, it } from 'vitest'

import { resolveSceneFromText } from '@/modules/chat-agent/sceneResolver'

describe('resolveSceneFromText', () => {
  it('matches tutor keywords', () => {
    expect(resolveSceneFromText('想找数学家教，孩子初二')).toBe('tutor')
  })

  it('matches sparring keywords', () => {
    expect(resolveSceneFromText('周末网球陪练，偏训练提升')).toBe('sparring')
  })

  it('matches job keywords', () => {
    expect(resolveSceneFromText('想找一份兼职实习，看看岗位推荐')).toBe('job')
  })

  it('matches project keywords', () => {
    expect(resolveSceneFromText('需要做一个电商网站开发项目')).toBe('project')
  })

  it('falls back to project when empty or unknown', () => {
    expect(resolveSceneFromText('')).toBe('project')
    expect(resolveSceneFromText('今天心情不错')).toBe('project')
  })
})
