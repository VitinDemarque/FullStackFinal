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

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (error?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as any

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

      if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
        // Não tenta refresh se a requisição é para o endpoint de refresh
        if (originalRequest.url?.includes('/auth/refresh')) {
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
          return Promise.reject(apiError)
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return api.request(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          isRefreshing = false
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
          return Promise.reject(apiError)
        }

        try {
          const { authService } = await import('./auth.service')
          const response = await authService.refreshToken()
          const newToken = response.tokens.accessToken

          localStorage.setItem('accessToken', newToken)
          localStorage.setItem('refreshToken', response.tokens.refreshToken)

          originalRequest.headers.Authorization = `Bearer ${newToken}`
          processQueue(null, newToken)
          isRefreshing = false

          return api.request(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          isRefreshing = false
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
          return Promise.reject(apiError)
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

  // Derive base origin. When API_URL is relative (e.g. '/api'), use window.location.origin.
  let baseOrigin = ''
  try {
    baseOrigin = new URL(API_URL).origin
  } catch {
    // API_URL is likely a relative path like '/api' in production.
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      baseOrigin = window.location.origin
    } else {
      baseOrigin = ''
    }
  }
  baseOrigin = baseOrigin.replace(/\/+$/, '')

  // If we have a leading slash path, join with base origin
  if (trimmed.startsWith('/')) {
    // Ensure we do not accidentally prepend '/api' when API_URL is relative
    return baseOrigin ? `${baseOrigin}${trimmed}` : trimmed
  }

  // Otherwise, treat as relative path from origin
  return baseOrigin ? `${baseOrigin}/${trimmed.replace(/^\/+/, '')}` : `/${trimmed.replace(/^\/+/, '')}`
}
