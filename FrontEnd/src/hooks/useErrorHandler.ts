// ============================================
// USE ERROR HANDLER HOOK
// Hook para facilitar tratamento de erros em componentes
// ============================================

import { useState, useCallback } from 'react'
import { handleApiError, logError, type ErrorHandlerResult } from '@utils/errorHandler'

interface UseErrorHandlerReturn {
  error: ErrorHandlerResult | null
  setError: (error: any, context?: string) => void
  clearError: () => void
  hasError: boolean
}

/**
 * Hook para tratamento consistente de erros
 * 
 * @example
 * const { error, setError, clearError } = useErrorHandler()
 * 
 * try {
 *   await someApiCall()
 * } catch (err) {
 *   setError(err, 'Login')
 * }
 */
export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setErrorState] = useState<ErrorHandlerResult | null>(null)

  const setError = useCallback((error: any, context?: string) => {
    // Log o erro
    logError(error, context)
    
    // Processa e armazena o erro
    const handledError = handleApiError(error)
    setErrorState(handledError)
  }, [])

  const clearError = useCallback(() => {
    setErrorState(null)
  }, [])

  return {
    error,
    setError,
    clearError,
    hasError: error !== null,
  }
}

