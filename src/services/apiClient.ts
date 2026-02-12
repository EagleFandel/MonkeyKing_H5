import axios from 'axios'

import { runtime } from '@/config/runtime'
import type { ApiResponse } from '@/types/domain'

const client = axios.create({
  baseURL: runtime.apiBaseURL,
  timeout: 15_000,
})

function readHeaderValue(headers: unknown, key: string): string {
  if (!headers || typeof headers !== 'object') {
    return 'unknown'
  }

  const headerSource = headers as {
    get?: (name: string) => string | null | undefined
    [prop: string]: unknown
  }

  if (typeof headerSource.get === 'function') {
    const value = headerSource.get(key)
    if (value) {
      return value
    }
  }

  const candidate = headerSource[key] ?? headerSource[key.toLowerCase()] ?? headerSource[key.toUpperCase()]
  if (Array.isArray(candidate)) {
    return candidate.length > 0 ? String(candidate[0]) : 'unknown'
  }

  return typeof candidate === 'string' ? candidate : 'unknown'
}

function isApiEnvelope<T>(payload: unknown): payload is ApiResponse<T> {
  if (!payload || typeof payload !== 'object') {
    return false
  }

  const value = payload as Record<string, unknown>
  return (
    typeof value.code === 'number' &&
    typeof value.message === 'string' &&
    Object.prototype.hasOwnProperty.call(value, 'data')
  )
}

function looksLikeHtmlResponse(contentType: string, payload: unknown): boolean {
  if (contentType.toLowerCase().includes('text/html')) {
    return true
  }

  if (typeof payload !== 'string') {
    return false
  }

  const normalized = payload.trim().toLowerCase()
  return normalized.startsWith('<!doctype html') || normalized.startsWith('<html')
}

export function unwrapApiEnvelope<T>(
  method: 'GET' | 'POST',
  url: string,
  status: number,
  headers: unknown,
  payload: unknown,
): T {
  const contentType = readHeaderValue(headers, 'content-type')
  if (!isApiEnvelope<T>(payload)) {
    const hint = looksLikeHtmlResponse(contentType, payload)
      ? 'The API endpoint is not mocked or routed to a backend. Check VITE_API_MODE and VITE_API_BASE_URL.'
      : 'Expected JSON envelope: { code, message, data }.'
    throw new Error(
      `[API] ${method} ${url} returned an unexpected response (status ${status}, content-type ${contentType}). ${hint}`,
    )
  }

  if (status >= 400) {
    throw new Error(`[API] ${method} ${url} failed with status ${status}. ${payload.message}`)
  }

  if (payload.code !== 0) {
    throw new Error(
      `[API] ${method} ${url} was rejected with code ${payload.code}. ${payload.message}`,
    )
  }

  return payload.data
}

export async function request<T>(
  method: 'GET' | 'POST',
  url: string,
  payload?: unknown,
): Promise<T> {
  try {
    const response = await client.request<unknown>({
      method,
      url,
      data: payload,
      validateStatus: () => true,
    })

    return unwrapApiEnvelope<T>(method, url, response.status, response.headers, response.data)
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('[API]')) {
      throw error
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 'network'
      const contentType = readHeaderValue(error.response?.headers, 'content-type')
      throw new Error(
        `[API] ${method} ${url} request failed (${status}, content-type ${contentType}). ${error.message}`,
      )
    }

    throw error
  }
}

export default client
