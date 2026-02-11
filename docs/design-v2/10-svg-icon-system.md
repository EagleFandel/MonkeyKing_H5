# 悟空哆哆 H5 Design V2 · SVG 图标系统规范

## 1. 目标
- 用统一线性双色 SVG 替换全站 emoji 表达。
- 保证图标在 `16~32px` 范围内可读、统一、可维护。
- 让图标直接承载品牌语言（橙蓝双轴），并支持可访问性。

## 2. 设计基线
- 风格：线性双色（主描边 + 局部填充点缀）。
- 线宽：`1.75px`。
- 端点/拐角：`round`。
- 画板：`24 x 24`。

## 3. 尺寸与色彩
- 尺寸档位：`sm=16`、`md=20`、`lg=24`、`xl=32`。
- Tone 档位：`blue`、`orange`、`mixed`、`neutral`、`success`、`warning`、`error`。
- 默认映射：
  - 导航：`mixed`
  - 状态：按状态语义映射（success/warning/error）
  - 业务入口：`mixed`

## 4. 工程结构
- `src/components/icons/types.ts`：图标类型与定义。
- `src/components/icons/primitives.ts`：基础几何路径工具。
- `src/components/icons/icons.ts`：icon registry。
- `src/components/icons/SvgIcon.vue`：统一渲染组件。

## 5. 可访问性要求
- 装饰性图标：`decorative=true`，隐藏语义。
- 信息性图标：`decorative=false` + `title`。
- 图标按钮必须配套 `aria-label`。

## 6. 动效约束
- 仅允许轻量动效：`opacity/transform`。
- 禁止持续旋转、闪烁和高频脉冲。

## 7. 质量门槛
- 全站 emoji 残留数：`0`。
- 图标风格一致性：`100%`。
- `IconName` 与 registry 一致率：`100%`。

