import { useState, useCallback } from 'react'
import { handleApiError, logError, type ErrorHandlerResult } from '@utils/errorHandler'

interface UseErrorHandlerReturn {
  error: ErrorHandlerResult | null
  setError: (error: any, context?: string) => void
  clearError: () => void
  hasError: boolean
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setErrorState] = useState<ErrorHandlerResult | null>(null)

  const setError = useCallback((error: any, context?: string) => {
    logError(error, context)
    
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
