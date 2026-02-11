import type { MotionPreset, PageState } from '@/types/ui'

export type ComponentVariant = 'default' | 'premium' | 'compact'

export type SurfaceStyle = 'solid' | 'glass' | 'gradient' | 'ghost'

export type FeedbackStyle = 'neutral' | 'success' | 'warning' | 'error'

export interface InteractionStateMap {
  idle: PageState
  busy: PageState
  done: PageState
  failed: PageState
  motionPreset?: MotionPreset
}

