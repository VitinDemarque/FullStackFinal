import { useState, useEffect, useCallback, useRef } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Hook para gerenciar operações assíncronas com proteção contra race conditions
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  // Ref para rastrear se o componente ainda está montado
  const isMountedRef = useRef(true)
  
  // Ref para rastrear a última requisição
  const lastRequestRef = useRef(0)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const execute = useCallback(async () => {
    // Incrementar contador de requisições
    const requestId = ++lastRequestRef.current

    setState((prev) => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await asyncFunction()
      
      // Só atualizar se for a requisição mais recente e o componente ainda está montado
      if (isMountedRef.current && requestId === lastRequestRef.current) {
        setState({ data: response, loading: false, error: null })
      }
      
      return response
    } catch (error) {
      // Só atualizar se for a requisição mais recente e o componente ainda está montado
      if (isMountedRef.current && requestId === lastRequestRef.current) {
        setState({ data: null, loading: false, error: error as Error })
      }
      throw error
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { ...state, execute }
}
