export type ApiMode = 'mock' | 'real'

export interface RuntimeConfig {
  apiMode: ApiMode
  apiBaseURL: string
  isDev: boolean
}

const DEFAULT_API_MODE: ApiMode = 'mock'
const DEFAULT_API_BASE_URL = '/api'

function normalizeApiMode(rawMode: unknown): ApiMode {
  if (typeof rawMode !== 'string') {
    return DEFAULT_API_MODE
  }

  const mode = rawMode.trim().toLowerCase()
  return mode === 'real' ? 'real' : 'mock'
}

function normalizeApiBaseURL(rawBaseURL: unknown): string {
  if (typeof rawBaseURL !== 'string') {
    return DEFAULT_API_BASE_URL
  }

  const value = rawBaseURL.trim()
  return value.length > 0 ? value : DEFAULT_API_BASE_URL
}

export function resolveRuntimeConfig(env: Record<string, unknown> = import.meta.env): RuntimeConfig {
  return {
    apiMode: normalizeApiMode(env.VITE_API_MODE),
    apiBaseURL: normalizeApiBaseURL(env.VITE_API_BASE_URL),
    isDev: Boolean(env.DEV),
  }
}

export const runtime = resolveRuntimeConfig()
