# 悟空哆哆 H5 Design V2 · Emoji 到 SVG 替换映射

## 1. 全局映射
- `🐒` → `brand-monkey`
- `🔔` → `bell`
- `🏠` → `home`
- `🧭` → `discover`
- `🧑‍💻` → `project`
- `📚` → `tutor`
- `👤` → `profile`
- `🎾` → `sparring`
- `🤖` → `assistant`
- `🛡️` → `shield`
- `💰` → `bonus`
- `✨` → `status-default`
- `⏳` → `status-loading`
- `📭` → `status-empty`
- `⚠️` → `status-error`
- `✅` → `status-success`

## 2. 替换位置
- `src/layouts/DefaultLayout.vue`
  - logo/bell/bottom nav icon 全量替换。
- `src/pages/home/HomePage.vue`
  - 场景入口、优势区图标替换。
- `src/components/chat/DodoAssistantPanel.vue`
  - 助手头像替换。
- `src/components/common/StatusState.vue`
  - 状态图标替换。

## 3. 验收
- 扫描 `src/` 不允许残留 emoji 字符。
- 导航、首页、状态、助手四大区块必须全部使用 `SvgIcon`。

