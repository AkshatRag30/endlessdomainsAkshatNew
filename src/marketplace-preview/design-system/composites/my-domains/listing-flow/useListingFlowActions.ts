import { useCallback } from 'react'
import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'
import {
  mockDomainListingInsights,
  mockWalletHasMarketplaceApproval,
  setMockWalletHasMarketplaceApproval,
} from '@/marketplace-preview/data/my-domains/domains'

export interface ListingFlowActions {
  checkNetwork: () => Promise<{ ok: boolean; walletChainName?: string; requiredChainName?: string }>
  switchNetwork: () => Promise<void>
  /** Wallet-wide, not per-domain (implementation plan §6) — the domain argument to useListingFlowActions only picks which fixture flags (wrong network / insufficient funds) apply, it never changes this answer. */
  needsApproval: () => boolean
  approve: () => Promise<void>
  signAndSubmit: (order: { priceUsd: number; durationDays: number }) => Promise<{ ok: true } | { ok: false; reason: 'insufficient-funds' | 'rejected' }>
}

const MOCK_DELAY_MS = 1100

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mock implementation of the listing flow's wallet/contract boundary
 * (implementation plan §7). Every "wallet round-trip" is a fake delay;
 * branch selection (wrong network / insufficient funds / plain success) is
 * driven by fixture flags on the mock domain's own DomainListingInsights,
 * while approval is driven by the shared wallet-level flag. This whole hook
 * is the seam plan §8 replaces with real wagmi/ethers calls later — nothing
 * outside this file should know it's mocked.
 */
export function useListingFlowActions(domain: MyDomainListing): ListingFlowActions {
  const insights = mockDomainListingInsights[domain.id]

  const checkNetwork = useCallback(async () => {
    await delay(MOCK_DELAY_MS)
    if (insights?.walletOnWrongNetwork) {
      return { ok: false, walletChainName: 'Ethereum', requiredChainName: 'Polygon' }
    }
    return { ok: true }
  }, [insights])

  const switchNetwork = useCallback(async () => {
    await delay(MOCK_DELAY_MS)
  }, [])

  const needsApproval = useCallback(() => !mockWalletHasMarketplaceApproval, [])

  const approve = useCallback(async () => {
    await delay(MOCK_DELAY_MS * 1.3)
    setMockWalletHasMarketplaceApproval(true)
  }, [])

  const signAndSubmit = useCallback(
    // The mock never varies its result by price/duration, only by the
    // domain's own insights fixture — the order argument exists purely to
    // match the real signAndSubmit's future shape (plan §7).
    async (order: { priceUsd: number; durationDays: number }) => {
      void order
      await delay(MOCK_DELAY_MS)
      if (insights?.insufficientFunds) {
        return { ok: false as const, reason: 'insufficient-funds' as const }
      }
      return { ok: true as const }
    },
    [insights]
  )

  return { checkNetwork, switchNetwork, needsApproval, approve, signAndSubmit }
}

export default useListingFlowActions
