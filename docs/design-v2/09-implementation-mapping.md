# 悟空哆哆 H5 Design V2 · 设计到实现映射

## 1. 类型与契约映射
- `src/types/ui.ts` 增补：`ThemeMode`、`ColorToken`、`SpacingToken`、`ElevationToken`、`MotionPreset`、`MotionDuration`、`MotionCurve`、`PageState`。
- 新增 `src/types/design.ts`：`ComponentVariant`、`SurfaceStyle`、`FeedbackStyle`、`InteractionStateMap`。

## 2. 路由元信息映射
- 在 `src/app/router.ts` 的每个页面路由增加：
  - `meta.pageTone`: `warm | cool | neutral`
  - `meta.motionProfile`: `immersive | gentle | snappy`

## 3. 全局样式映射
- `src/style.css`：建立 token 变量、统一阴影、边框、动效 keyframes。
- `DefaultLayout.vue`：根据 `meta.pageTone` 注入主题类，根据 `meta.motionProfile` 控制转场 class。

## 4. 组件升级映射
- `CandidateCard.vue`：支持 `variant / density / motionPreset`。
- `DodoAssistantPanel.vue`：支持 `mode / state / contextHint`。
- `PaymentSheet.vue`：支持 `intent / statusTone / successAnimation`。
- 新增 `StatusState.vue`：统一 5 态展示。

## 5. 页面改造映射
- `HomePage.vue`：Hero + 分流卡 + 动态信息。
- 四场景页面：统一五段式结构与底部 CTA。
- `PaymentPage.vue`：状态时间线 + 成功态动效容器。
- `MessagesPage.vue`、`ProfilePage.vue`：增强信息层级与反馈。

## 6. 测试映射
- 单测新增：token 映射函数、交互状态机、页面状态切换。
- E2E 增强：四场景主流程 + 至少 1 条错误恢复路径。
- 回归项：认证拦截、支付状态转换、消息已读、投诉提交。

## 7. 交付标准
- 代码与 `docs/design-v2/` 一致。
- 审计 P0 清零，P1 不超过 3 项。
- 综合审计评分达到 >= 90。

