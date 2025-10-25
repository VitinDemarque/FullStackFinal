import { useState, useEffect, useCallback, useRef } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  const isMountedRef = useRef(true)
  const lastRequestRef = useRef(0)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const execute = useCallback(async () => {
    const requestId = ++lastRequestRef.current

    setState((prev) => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await asyncFunction()
      
      if (isMountedRef.current && requestId === lastRequestRef.current) {
        setState({ data: response, loading: false, error: null })
      }
      
      return response
    } catch (error) {
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
