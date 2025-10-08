// ============================================
// API Client - Base configuration
// ============================================

import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import type { ApiError } from '@types/index'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
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

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Server responded with error
      const apiError: ApiError = {
        message: error.response.data?.message || 'An error occurred',
        statusCode: error.response.status,
        details: error.response.data?.details,
      }

      // Handle 401 - Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }

      return Promise.reject(apiError)
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: 'No response from server',
        statusCode: 0,
      })
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'Unknown error',
        statusCode: 0,
      })
    }
  }
)

// Generic request function
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
