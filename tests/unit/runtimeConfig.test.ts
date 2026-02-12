import { describe, expect, it } from 'vitest'

import { resolveRuntimeConfig } from '@/config/runtime'

function createEnv(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    DEV: false,
    ...overrides,
  }
}

describe('runtime config', () => {
  it('defaults to mock mode and /api base URL when env is missing', () => {
    const config = resolveRuntimeConfig(createEnv())
    expect(config.apiMode).toBe('mock')
    expect(config.apiBaseURL).toBe('/api')
    expect(config.isDev).toBe(false)
  })

  it('falls back to mock mode when VITE_API_MODE is invalid', () => {
    const config = resolveRuntimeConfig(
      createEnv({
        DEV: true,
        VITE_API_MODE: 'invalid-value',
      }),
    )

    expect(config.apiMode).toBe('mock')
    expect(config.isDev).toBe(true)
  })

  it('uses explicit real mode and custom base URL', () => {
    const config = resolveRuntimeConfig(
      createEnv({
        VITE_API_MODE: 'real',
        VITE_API_BASE_URL: 'https://api.example.com/v1',
      }),
    )

    expect(config.apiMode).toBe('real')
    expect(config.apiBaseURL).toBe('https://api.example.com/v1')
  })
})
