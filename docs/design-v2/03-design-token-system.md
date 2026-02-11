# 悟空哆哆 H5 Design V2 · Token 系统

## 1. Color Tokens
```ts
type ColorToken =
  | 'brand.orange.700' | 'brand.orange.600' | 'brand.orange.500' | 'brand.orange.100'
  | 'brand.blue.700' | 'brand.blue.600' | 'brand.blue.500' | 'brand.blue.100'
  | 'neutral.900' | 'neutral.700' | 'neutral.500' | 'neutral.300' | 'neutral.100' | 'neutral.0'
  | 'feedback.success' | 'feedback.warning' | 'feedback.error' | 'feedback.info'
```

## 2. Spacing Tokens
```ts
type SpacingToken = '4' | '8' | '12' | '16' | '20' | '24' | '32'
```

| Token | 值 |
|---|---|
| `space-4` | `4px` |
| `space-8` | `8px` |
| `space-12` | `12px` |
| `space-16` | `16px` |
| `space-20` | `20px` |
| `space-24` | `24px` |
| `space-32` | `32px` |

## 3. Radius Tokens
- `radius-card`: `10px`
- `radius-input`: `8px`
- `radius-button`: `12px`
- `radius-pill`: `999px`

## 4. Elevation Tokens
```ts
type ElevationToken = 'surface.1' | 'surface.2' | 'surface.3' | 'surface.hero'
```

| Token | 阴影 |
|---|---|
| `surface.1` | `0 6px 16px rgba(17,24,39,0.06)` |
| `surface.2` | `0 10px 24px rgba(17,24,39,0.1)` |
| `surface.3` | `0 16px 36px rgba(17,24,39,0.14)` |
| `surface.hero` | `0 20px 48px rgba(255,122,0,0.2)` |

## 5. Typography Tokens
- `font-h1`: `28px/1.35/700`
- `font-h2`: `22px/1.4/700`
- `font-h3`: `18px/1.45/700`
- `font-body`: `14px/1.7/400`
- `font-caption`: `12px/1.6/400`

## 6. Motion Tokens
```ts
type MotionDuration = 'fast' | 'normal' | 'slow' | 'hero'
type MotionCurve = 'standard' | 'decelerate' | 'accelerate' | 'emphasized'
type MotionPreset = 'none' | 'lift' | 'fade-slide' | 'scale-pop' | 'success-burst'
```

| Token | 时长 |
|---|---|
| `motion-fast` | `120ms` |
| `motion-normal` | `180ms` |
| `motion-slow` | `320ms` |
| `motion-hero` | `480ms` |

| Curve | cubic-bezier |
|---|---|
| `standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `decelerate` | `cubic-bezier(0, 0, 0.2, 1)` |
| `accelerate` | `cubic-bezier(0.4, 0, 1, 1)` |
| `emphasized` | `cubic-bezier(0.2, 0, 0, 1.15)` |

## 7. Layout Tokens
- `content-max-width`: `480px`
- `top-nav-height`: `64px`
- `bottom-nav-height`: `78px`
- `safe-tap-target`: `44px`

## 8. State Tokens
```ts
type PageState = 'default' | 'loading' | 'empty' | 'error' | 'success'
```

每个状态必须具备：
- 视觉组件（icon/插画/骨架）
- 一句说明文案
- 一个主要行动按钮

