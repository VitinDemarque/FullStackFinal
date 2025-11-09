import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types/index'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const data: any = error.response.data ?? {}
      const message =
        data?.error?.message ||
        data?.message ||
        data?.mensagem ||
        (error as any)?.message ||
        'An error occurred'

      const details = data?.error?.details ?? data?.details

      const apiError: ApiError = {
        message,
        statusCode: error.response.status,
        details,
      }

      if (error.response.status === 401) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        
        window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          setTimeout(() => {
            if (!localStorage.getItem('accessToken')) {
              window.location.href = '/login'
            }
          }, 100)
        }
      }

      return Promise.reject(apiError)
    } else if (error.request) {
      return Promise.reject({
        message: 'No response from server',
        statusCode: 0,
      })
    } else {
      return Promise.reject({
        message: error.message || 'Unknown error',
        statusCode: 0,
      })
    }
  }
)

export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.request<T>({
    method,
    url,
    data,
    ...config,
  })
  return response.data
}

// Resolve relative, absolute and data/blob URLs to absolute URLs based on API origin.
export function resolvePublicUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const trimmed = String(url).trim()
  if (!trimmed) return null

  // Preserve data URLs and blob URLs as-is
  if (/^(data:|blob:)/i.test(trimmed)) return trimmed

  // If already absolute (http/https), keep it
  try {
    const parsed = new URL(trimmed)
    return parsed.href
  } catch {}

  // Derive API origin (without trailing slashes)
  let origin = ''
  try {
    origin = new URL(API_URL).origin
  } catch {
    origin = API_URL
  }
  origin = origin.replace(/\/+$/, '')

  // Handle paths starting with '/'
  if (trimmed.startsWith('/')) {
    return `${origin}${trimmed}`
  }

  // Fallback: join origin and relative path
  return `${origin}/${trimmed.replace(/^\/+/, '')}`
}
