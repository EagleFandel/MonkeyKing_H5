import { describe, expect, it } from 'vitest'

import { unwrapApiEnvelope } from '@/services/apiClient'

describe('apiClient envelope parser', () => {
  it('returns data when envelope and HTTP status are valid', () => {
    const data = unwrapApiEnvelope<{ verified: boolean }>(
      'POST',
      '/auth/verify',
      200,
      { 'content-type': 'application/json' },
      {
        code: 0,
        message: 'ok',
        data: { verified: true },
        traceId: 'trace-1',
      },
    )

    expect(data).toEqual({ verified: true })
  })

  it('throws readable error for HTML responses', () => {
    expect(() =>
      unwrapApiEnvelope(
        'GET',
        '/messages',
        200,
        { 'content-type': 'text/html; charset=utf-8' },
        '<!doctype html><html><body>fallback</body></html>',
      ),
    ).toThrowError(
      '[API] GET /messages returned an unexpected response (status 200, content-type text/html; charset=utf-8). The API endpoint is not mocked or routed to a backend. Check VITE_API_MODE and VITE_API_BASE_URL.',
    )
  })

  it('keeps HTTP error status in thrown message for tracing', () => {
    expect(() =>
      unwrapApiEnvelope(
        'POST',
        '/auth/verify',
        405,
        { 'content-type': 'application/json' },
        {
          code: 405,
          message: 'Method Not Allowed',
          data: null,
          traceId: 'trace-2',
        },
      ),
    ).toThrowError('[API] POST /auth/verify failed with status 405. Method Not Allowed')
  })
})
