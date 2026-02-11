import type { ChatExtractResponse } from '@/types/dto'
import type { SceneType } from '@/types/domain'

const sceneKeywords: Record<SceneType, string[]> = {
  project: ['项目', '开发', '小程序', 'app', '技术栈'],
  tutor: ['家教', '辅导', '科目', '年级'],
  sparring: ['陪练', '网球', '训练', '发球'],
  job: ['兼职', '技能', '接单', '时薪'],
}

function detectIntent(text: string): SceneType {
  const lowerText = text.toLowerCase()
  const matchEntry = Object.entries(sceneKeywords).find(([, keywords]) =>
    keywords.some((keyword) => lowerText.includes(keyword.toLowerCase())),
  )

  return (matchEntry?.[0] as SceneType | undefined) ?? 'project'
}

function extractBudget(text: string): number | undefined {
  const match = text.match(/(\d{2,6})\s*(元|rmb|人民币)?/i)
  return match ? Number(match[1]) : undefined
}

function extractTimeHint(text: string): string | undefined {
  const hints = ['每周', '周一', '周二', '周三', '周四', '周五', '周六', '周日', '晚上', '下午']
  const found = hints.find((hint) => text.includes(hint))
  return found ? `${found}（由智能体解析）` : undefined
}

export function parseByRules(scene: SceneType, text: string): ChatExtractResponse {
  const inferredScene = scene === 'project' && text ? detectIntent(text) : scene
  const budget = extractBudget(text)
  const timeHint = extractTimeHint(text)

  const followUpQuestion = !budget
    ? '请补充预算范围（例如 3000-5000 元）以提升匹配精度。'
    : !timeHint
      ? '请补充你的时间安排（例如每周三次、周末下午）以便筛选。'
      : undefined

  return {
    scene: inferredScene,
    intent: `intent:${inferredScene}`,
    extracted: {
      budget,
      schedule: timeHint,
      description: text,
      intro: text,
      improvementGoals: text,
    },
    followUpQuestion,
    reportDraft: `已识别场景：${inferredScene}。已提取预算：${budget ?? '待补充'}；时间线索：${timeHint ?? '待补充'}。`,
  }
}

