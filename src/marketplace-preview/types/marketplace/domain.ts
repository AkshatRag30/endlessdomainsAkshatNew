/**
 * Frontend-facing domain/listing models for the marketplace redesign.
 *
 * These deliberately mirror the real `DomainListing` (src/types/DomainList.ts)
 * and `TrendingDomain` (src/types/Domain.ts) fields where they overlap
 * (domainName, chain/assetContract, pricePerToken -> priceEth, usdAmount ->
 * priceUsd), so a future API adapter is a rename/reshape, not a redesign.
 * See the implementation plan, section 9/11.
 */

export interface Chain {
  id: string // e.g. 'polygon' — derived from PROVIDER_NETWORKS (src/utils/constants.ts)
  label: string // 'Polygon'
  iconSrc: string
}

export type AppraisedTrend = 'high' | 'low' | 'neutral'

export interface MarketplaceListing {
  id: string
  domainName: string
  extension: string // '.ud', '.eth'
  isPremium?: boolean
  chain: Chain
  priceEth: number
  priceUsd: number
  appraisedValueEth: number
  appraisedTrend: AppraisedTrend
  isPromoted?: boolean
  isFavorited?: boolean
  /** ISO timestamp — feeds the Listed filter (Today / This week / This month). */
  listedAt: string
  /** Truncated display form, e.g. "0x8A7F…3c9D" — the buying flow's "After you buy · Seller" row. No full address is needed by the mock. */
  sellerAddress: string
  /** ISO timestamp — the buying flow's "This listing expires {date}" line. Same convention as listedAt. */
  expiresAt: string
  /**
   * Drives the buying flow review header's "· one time · no renewal" meta
   * segments. True for one-time-purchase naming services (.ud-style), false
   * for renewable ones (.eth-style). Every mock listing is .ud today, so the
   * fixture sets it from the extension; a real adapter should derive it from
   * the resolved naming provider the same way DomainAvatar does.
   */
  isOneTimePurchase: boolean
}

/**
 * Buy-flow-only data per listing, looked up by listing id (buying-flow plan
 * §6.1) rather than bloating MarketplaceListing — same pattern as the
 * listing flow's DomainListingInsights.
 */
export interface MarketplaceBuyInsights {
  /** "Network fee, estimated ≈ X USDT" and the approval screen's "Purchase network fee". */
  networkFeeEstimateUsd: number
  /** The approval explainer's "Approval network fee ≈ X USDT" (Figma 1:848). Not in the plan's §6.1 sketch — the frame shows a separate, smaller fee for the approve() call itself. */
  approvalFeeEstimateUsd: number
  /** "Model estimate" row on the No-longer-available screen (Figma 1:1505). */
  modelEstimateUsd: number
  /** Demo branch fixtures (Phases C/E) — same convention as DomainListingInsights's own flags. No insufficientFunds flag: "no fund" is a real numeric comparison against the wallet balance (plan §6.2). */
  walletOnWrongNetwork?: boolean
  alreadySold?: boolean
  /** The purchase goes through the wallet but fails on chain while settling — Figma's "Reject" / "Transaction fail" branch (1:1043). */
  transactionFails?: boolean
}
