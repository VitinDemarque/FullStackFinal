// ============================================
// AUTH SERVICE - Controller layer
// Handles authentication API calls
// ============================================

import { apiRequest } from './api'
import type { LoginCredentials, SignupData, AuthResponse, User } from '@types/index'

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('POST', '/auth/login', credentials)
    
    // Save tokens
    localStorage.setItem('accessToken', response.tokens.accessToken)
    localStorage.setItem('refreshToken', response.tokens.refreshToken)
    
    return response
  },

  /**
   * Signup new user
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('POST', '/auth/signup', data)
    
    // Save tokens
    localStorage.setItem('accessToken', response.tokens.accessToken)
    localStorage.setItem('refreshToken', response.tokens.refreshToken)
    
    return response
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken')
  },

  /**
   * Get current user from token
   */
  async getCurrentUser(): Promise<User> {
    return apiRequest<User>('GET', '/users/me')
  },
}
