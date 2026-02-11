# 悟空哆哆 H5 Design V2 · 组件规范

## 1. 组件分层
- Hero 级：页面头图、品牌叙事区。
- Feature 级：场景入口、优势说明、统计卡。
- Form 级：输入控件、分组容器、智能补全面板。
- Result 级：候选卡、职位卡、详情摘要。
- Action 级：主按钮、次按钮、底部操作栏。
- Feedback 级：加载骨架、空态、错误态、成功态、toast。

## 2. `CandidateCard` 规范

### 2.1 Props
```ts
interface CandidateCardProps {
  candidate: MatchCandidate
  variant?: 'default' | 'premium' | 'compact'
  density?: 'comfortable' | 'compact'
  motionPreset?: MotionPreset
}
```

### 2.2 信息层级
1. 第一行：姓名 + 匹配度。
2. 第二行：专业/角色 + 经验摘要。
3. 第三行：标签组。
4. 第四行：评分 + 价格。
5. 第五行：操作按钮。

### 2.3 状态
- Default：正常展示。
- Hover/Press：卡片抬升 2~4px，阴影加深。
- Loading：骨架卡片。
- Empty：无结果占位。
- Error：重试提示卡。

## 3. `DodoAssistantPanel` 规范

### 3.1 Props
```ts
interface DodoAssistantPanelProps {
  modelValue?: string
  placeholder?: string
  result?: ChatExtractResponse | null
  mode?: 'embedded' | 'floating' | 'sheet'
  state?: PageState
  contextHint?: string
}
```

### 3.2 交互
- 输入时显示“正在理解”轻状态。
- 点击“智能补全”后进入 loading，再展示结构化抽取结果。
- 有追问时高亮展示并提供快捷回填入口。

## 4. `PaymentSheet` 规范

### 4.1 Props
```ts
interface PaymentSheetProps {
  amount: number
  intent?: 'project' | 'tutor' | 'sparring' | 'job'
  statusTone?: 'neutral' | 'warning' | 'success' | 'error'
  successAnimation?: 'pulse' | 'burst' | 'none'
}
```

### 4.2 行为
- 选择支付渠道时应有明显选中态。
- 点击支付后按钮进入 pending，防止重复提交。
- 成功后展示结果动画 + 下一步建议。

## 5. 通用组件规范

### 5.1 `PageHeader`
- 可选 tone：`default`, `warm`, `cool`。
- 可选 stats：右上角可放统计 pill。

### 5.2 `SimpleField`
- 支持 `state: default|error|success`。
- 必须支持帮助文案与错误文案区。

### 5.3 `StatusState`
新增统一状态组件：
```ts
interface StatusStateProps {
  state: PageState
  title: string
  description?: string
  actionText?: string
}
```

