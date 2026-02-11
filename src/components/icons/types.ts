export type IconName =
  | 'brand-monkey'
  | 'bell'
  | 'home'
  | 'discover'
  | 'project'
  | 'tutor'
  | 'profile'
  | 'sparring'
  | 'assistant'
  | 'shield'
  | 'bonus'
  | 'match'
  | 'status-default'
  | 'status-loading'
  | 'status-empty'
  | 'status-error'
  | 'status-success'

export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | number

export type IconTone =
  | 'blue'
  | 'orange'
  | 'mixed'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'

export interface IconFillPath {
  d: string
  tone?: 'soft' | 'accent'
}

export interface IconDefinition {
  viewBox?: string
  strokes: string[]
  fills?: IconFillPath[]
  defaultTone?: IconTone
}

