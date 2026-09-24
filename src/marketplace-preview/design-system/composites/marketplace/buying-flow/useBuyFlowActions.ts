import { useCallback } from 'react'
import type { MarketplaceListing } from '@/marketplace-preview/types/marketplace'
import {
  mockMarketplaceBuyInsights,
  mockWalletUsdtAllowance,
  mockWalletUsdtBalance,
  setMockWalletUsdtAllowance,
  setMockWalletUsdtBalance,
} from '@/marketplace-preview/data/marketplace/domains'

export interface BuyFlowActions {
  checkNetwork: () => Promise<{ ok: boolean; walletChainName?: string; requiredChainName?: string }>
  switchNetwork: () => Promise<void>
  /** Amount-scoped, unlike the listing flow's wallet-wide needsApproval() — true whenever the current allowance can't cover this exact price (plan §6.2). */
  needsUsdtApproval: (priceUsd: number) => boolean
  /** Sets the allowance to exactly priceUsd ("Approving exactly X USDT, not your whole balance"), never to an unlimited amount. */
  approveUsdt: (priceUsd: number) => Promise<void>
  hasSufficientBalance: (priceUsd: number) => boolean
  /** The connected wallet's USDT balance — the "Pay with" card's "Balance {X} USDT" and "Your balance after". Not in the plan's §7 sketch, but the review screen needs the number itself, not just the comparison. */
  getUsdtBalance: () => number
  /** Resolves once the wallet has signed and the transaction is submitted — the "Confirming" phase. 'rejected' = declined in the wallet. Nothing is charged yet. */
  confirmPurchase: (order: { listingId: string; priceUsd: number }) => Promise<{ ok: true; txHash: string } | { ok: false; reason: 'rejected' }>
  /**
   * The "Settling" phase. Only a successful settlement moves money: it
   * consumes the allowance and debits the balance. 'failed' = reverted on
   * chain (Figma's Reject screen); 'already-sold' = another wallet bought it
   * first ("No longer available", 1:1478). Either way nothing is charged.
   */
  awaitSettlement: (txHash: string) => Promise<{ ok: true } | { ok: false; reason: 'failed' | 'already-sold' }>
}

const MOCK_DELAY_MS = 1100

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Orders submitted but not yet settled, by tx hash — module-level (not a
// ref) because settlement can outlive the drawer that started it: closing
// during "Settling" must not drop the order (plan §11).
const pendingOrders = new Map<string, { priceUsd: number }>()

function fakeTxHash(): string {
  let hex = ''
  for (let i = 0; i < 64; i += 1) hex += Math.floor(Math.random() * 16).toString(16)
  return `0x${hex}`
}

/**
 * Mock implementation of the buying flow's wallet/contract boundary
 * (buying-flow plan §7), the direct sibling of useListingFlowActions. Every
 * "wallet round-trip" is a fake delay; network/sold branches come from the
 * listing's own MarketplaceBuyInsights fixture flags, while approval and
 * balance read the shared wallet-level numbers in data/marketplace/domains.ts
 * (live ESM bindings, so each call sees the latest value). This whole hook
 * is the seam plan §8 replaces with real wagmi/ethers calls later — nothing
 * outside this file should know it's mocked.
 */
export function useBuyFlowActions(listing: MarketplaceListing): BuyFlowActions {
  const insights = mockMarketplaceBuyInsights[listing.id]

  const checkNetwork = useCallback(async () => {
    await delay(MOCK_DELAY_MS)
    if (insights?.walletOnWrongNetwork) {
      return { ok: false, walletChainName: 'Ethereum', requiredChainName: listing.chain.label }
    }
    return { ok: true }
  }, [insights, listing.chain.label])

  const switchNetwork = useCallback(async () => {
    await delay(MOCK_DELAY_MS)
  }, [])

  const needsUsdtApproval = useCallback((priceUsd: number) => mockWalletUsdtAllowance < priceUsd, [])

  const approveUsdt = useCallback(async (priceUsd: number) => {
    await delay(MOCK_DELAY_MS * 1.3)
    setMockWalletUsdtAllowance(priceUsd)
  }, [])

  const hasSufficientBalance = useCallback((priceUsd: number) => mockWalletUsdtBalance >= priceUsd, [])

  const getUsdtBalance = useCallback(() => mockWalletUsdtBalance, [])

  const confirmPurchase = useCallback(async (order: { listingId: string; priceUsd: number }) => {
    await delay(MOCK_DELAY_MS * 1.3)
    const txHash = fakeTxHash()
    pendingOrders.set(txHash, { priceUsd: order.priceUsd })
    return { ok: true as const, txHash }
  }, [])

  const awaitSettlement = useCallback(
    async (txHash: string) => {
      await delay(MOCK_DELAY_MS * 2.5)
      const order = pendingOrders.get(txHash)
      pendingOrders.delete(txHash)
      if (insights?.alreadySold) return { ok: false as const, reason: 'already-sold' as const }
      if (insights?.transactionFails || !order) return { ok: false as const, reason: 'failed' as const }
      // Spending consumes the allowance (so a second, differently-priced buy
      // this session needs a fresh approval, plan §6.2/§11) and debits the
      // balance the "Pay with" card and "Your balance after" row read.
      setMockWalletUsdtAllowance(Math.max(0, mockWalletUsdtAllowance - order.priceUsd))
      setMockWalletUsdtBalance(Math.max(0, mockWalletUsdtBalance - order.priceUsd))
      return { ok: true as const }
    },
    [insights]
  )

  return { checkNetwork, switchNetwork, needsUsdtApproval, approveUsdt, hasSufficientBalance, getUsdtBalance, confirmPurchase, awaitSettlement }
}

export default useBuyFlowActions
