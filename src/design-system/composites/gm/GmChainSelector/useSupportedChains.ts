import { useEffect, useState } from 'react'
import { SUPPORTED_CHAINS_ENDPOINT, SupportedChain } from './GmChainSelector.data'

export interface UseSupportedChainsResult {
  chains: SupportedChain[]
  loading: boolean
  error: boolean
}

// TODO(senior-dev): swap the inline fetch for the shared API client once it lands on this branch.
export function useSupportedChains(): UseSupportedChainsResult {
  const [chains, setChains] = useState<SupportedChain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadChains() {
      setLoading(true)
      setError(false)
      try {
        const res = await fetch(SUPPORTED_CHAINS_ENDPOINT)
        if (!res.ok) throw new Error(`Request failed with ${res.status}`)
        const data = await res.json()
        if (!cancelled) setChains(data.chains ?? [])
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadChains()
    return () => {
      cancelled = true
    }
  }, [])

  return { chains, loading, error }
}

export default useSupportedChains
