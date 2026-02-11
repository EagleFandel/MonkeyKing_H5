import axios from 'axios'

import type { ApiResponse } from '@/types/domain'

const client = axios.create({
  baseURL: '/api',
  timeout: 15_000,
})

export async function request<T>(
  method: 'GET' | 'POST',
  url: string,
  payload?: unknown,
): Promise<T> {
  const response = await client.request<ApiResponse<T>>({
    method,
    url,
    data: payload,
  })

  if (response.data.code !== 0) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export default client

