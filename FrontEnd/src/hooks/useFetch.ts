import { useState, useEffect, useCallback, useRef } from 'react'

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseFetchOptions {
  immediate?: boolean
  dependencies?: any[]
}

/**
 * Hook customizado para requisições HTTP com proteção contra race conditions
 * 
 * @example
 * const { data, loading, error, refetch } = useFetch(() => api.get('/users'))
 * const { data } = useFetch(() => api.get(`/users/${id}`), { dependencies: [id] })
 * const { execute } = useFetch(() => api.post('/users', data), { immediate: false })
 */
export function useFetch<T>(
  fetchFunction: () => Promise<T>,
  options: UseFetchOptions = {}
) {
  const { immediate = true, dependencies = [] } = options

  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  const isMountedRef = useRef(true)
  const requestIdRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const execute = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }))

    try {
      const result = await fetchFunction()

      if (isMountedRef.current && currentRequestId === requestIdRef.current) {
        setState({
          data: result,
          loading: false,
          error: null,
        })
      }

      return result
    } catch (err) {
      if (isMountedRef.current && currentRequestId === requestIdRef.current) {
        setState({
          data: null,
          loading: false,
          error: err as Error,
        })
      }
      throw err
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFunction, ...dependencies])

  useEffect(() => {
    if (immediate) {
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute])

  return {
    ...state,
    execute,
    refetch: execute,
    reset: () => setState({ data: null, loading: false, error: null }),
  }
}

