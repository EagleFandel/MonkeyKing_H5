import type { IconName } from '@/components/icons/types'

export interface NavItem {
  title: string
  path: string
  icon: IconName
}

export interface ScenarioQuickEntry {
  title: string
  subtitle: string
  path: string
  icon: IconName
}

export interface AdvantageItem {
  title: string
  description: string
  icon: IconName
}

export type ThemeMode = 'light' | 'dark' | 'system'

export type ColorToken =
  | 'brand.orange.700'
  | 'brand.orange.600'
  | 'brand.orange.500'
  | 'brand.orange.100'
  | 'brand.blue.700'
  | 'brand.blue.600'
  | 'brand.blue.500'
  | 'brand.blue.100'
  | 'neutral.900'
  | 'neutral.700'
  | 'neutral.500'
  | 'neutral.300'
  | 'neutral.100'
  | 'neutral.0'
  | 'feedback.success'
  | 'feedback.warning'
  | 'feedback.error'
  | 'feedback.info'

export type SpacingToken = '4' | '8' | '12' | '16' | '20' | '24' | '32'

export type ElevationToken =
  | 'surface.1'
  | 'surface.2'
  | 'surface.3'
  | 'surface.hero'

export type MotionPreset =
  | 'none'
  | 'lift'
  | 'fade-slide'
  | 'scale-pop'
  | 'success-burst'

export type MotionDuration = 'fast' | 'normal' | 'slow' | 'hero'

export type MotionCurve =
  | 'standard'
  | 'decelerate'
  | 'accelerate'
  | 'emphasized'

export type PageState = 'default' | 'loading' | 'empty' | 'error' | 'success'
