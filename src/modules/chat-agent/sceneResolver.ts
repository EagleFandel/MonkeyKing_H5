import type { SceneType } from '@/types/domain'

const scenePatterns: Array<{ scene: SceneType; patterns: RegExp[] }> = [
  {
    scene: 'tutor',
    patterns: [/家教/, /补课/, /科目/, /数学/i, /英语/i, /孩子/, /辅导/],
  },
  {
    scene: 'sparring',
    patterns: [/陪练/, /训练/, /网球/, /羽毛球/, /篮球/, /足球/, /运动/],
  },
  {
    scene: 'job',
    patterns: [/兼职/, /实习/, /岗位/, /接单/, /薪资/, /简历/, /求职/],
  },
  {
    scene: 'project',
    patterns: [/项目/, /开发/, /小程序/, /网站/, /\bapp\b/i, /外包/, /产品/],
  },
]

export function resolveSceneFromText(text: string): SceneType {
  const normalizedText = text.trim()
  if (!normalizedText) {
    return 'project'
  }

  for (const item of scenePatterns) {
    if (item.patterns.some((pattern) => pattern.test(normalizedText))) {
      return item.scene
    }
  }

  return 'project'
}
