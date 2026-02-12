# 悟空哆哆 Demo H5

悟空哆哆是一个“发现大学生”的多场景撮合平台。本仓库提供 H5 前端实现（Vue3 + Vite + TS）以及完整 Mock API 演示链路。

## 技术栈
- Vue 3 + TypeScript + Vite
- Vue Router + Pinia
- Vant（移动端组件）
- Axios + MSW（Mock API）
- Vitest + Playwright（测试）

## 快速开始
```bash
npm install
npm run dev
```

## 常用命令
```bash
# 类型检查
npm run typecheck

# 构建
npm run build

# 单元测试
npm run test:unit

# 覆盖率
npm run test

# E2E（需先执行 playwright install）
npm run test:e2e
```

## 核心目录
- `src/pages/`：四大场景页 + 通用页
- `src/components/`：复用组件（卡片、表单、智能体、支付）
- `src/mocks/`：MSW handlers 与 fixtures
- `src/services/`：接口适配层与端点定义
- `docs/`：业务文档、PRD、Design、测试与开发计划

## 文档入口
- `docs/01-business-overview.md`
- `docs/02-requirements-catalog.md`
- `docs/PRD.md`
- `docs/design/design-system.md`
- `docs/design/high-fidelity-spec.md`
- `docs/design/wireflow.md`
- `docs/design-v2/00-design-principles.md`
- `docs/design-v2/audit/00-audit-scorecard.md`
- `docs/api-contract.md`
- `docs/dev-plan.md`
- `docs/test-cases.md`

## Deployment Mode
- Static demo deployment should use mock mode.
- Use `VITE_API_MODE=mock` to enable MSW in both development and production.
- `VITE_API_BASE_URL` defaults to `/api` and can be changed when a real backend is available.
- To connect a real backend later, set `VITE_API_MODE=real` and configure `VITE_API_BASE_URL` explicitly.
