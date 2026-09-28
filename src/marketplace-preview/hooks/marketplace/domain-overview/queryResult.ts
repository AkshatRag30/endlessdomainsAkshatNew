import { useCallback, useEffect, useState } from 'react'

/**
 * The RTK Query result subset the domain overview hooks return (plan §6.6),
 * so swapping a mock body for a real `useXQuery` changes nothing for callers.
 */
export interface QueryResult<T> {
  data?: T
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

/** Simulated network latency, long enough that loading states are visible in review. */
const MOCK_LATENCY_MS = 350

/**
 * Shared mock body: resolves `load(key)` after a short delay. A null key
 * (e.g. the router isn't ready yet) or `skip` keeps it idle, mirroring RTK's
 * `skipToken` / `skip`. `load` returning null surfaces as data: undefined
 * with no error, which callers treat as not found.
 */
export function useMockQuery<T>(key: string | null, load: (key: string) => T | null, options: { skip?: boolean } = {}): QueryResult<T> {
  const { skip = false } = options
  const [state, setState] = useState<{ key: string | null; data?: T; isLoading: boolean; isError: boolean }>({
    key: null,
    isLoading: true,
    isError: false,
  })
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (key === null || skip) return
    let cancelled = false
    setState((prev) => ({ key, data: prev.key === key ? prev.data : undefined, isLoading: true, isError: false }))
    const timer = setTimeout(() => {
      if (cancelled) return
      try {
        setState({ key, data: load(key) ?? undefined, isLoading: false, isError: false })
      } catch {
        setState({ key, data: undefined, isLoading: false, isError: true })
      }
    }, MOCK_LATENCY_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // `load` is a stable module function at every call site; the key and nonce drive refetches.
  }, [key, skip, nonce, load])

  const refetch = useCallback(() => setNonce((prev) => prev + 1), [])

  // Moving to another key (e.g. clicking a comparable sale on the same route)
  // renders once before the effect above resets state; never hand that
  // render the previous key's data, so a page can't show the old domain
  // under the new URL.
  if (state.key !== key) return { data: undefined, isLoading: !skip, isError: false, refetch }

  return { data: state.data, isLoading: state.isLoading, isError: state.isError, refetch }
}
