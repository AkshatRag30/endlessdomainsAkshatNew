/**
 * Frontend-facing models for the "My Domains" dashboard revamp (pages/profile/domains).
 *
 * Mirrors the real API shapes non-destructively: `DomainSummaryResponse` /
 * the inline `DomainListing` (src/types/MyDomainsListedUnlisted.ts, fed by
 * useGetDomainSummaryByUserQuery) for the owned-domain list itself, and the
 * separate useGetDomainExpiryDateQuery response for per-domain expiry, which
 * the old page joins client-side by domainName — here it's flattened onto
 * the listing directly. Field naming follows the marketplace redesign
 * convention (src/types/marketplace/domain.ts): pricePerToken -> priceEth,
 * usdAmount -> priceUsd, so a future API adapter is a rename/reshape, not a
 * redesign.
 *
 * `status`, `estimatedValueEth/Usd`, `views`, and `savedCount` have no
 * precedent in the current API at all — they're read off the Figma reference
 * (node 50:6190) and have no backend endpoint yet. See the implementation
 * plan, section 03, for the confirmed gap.
 */
import { Chain } from '@/marketplace-preview/types/marketplace'

export type BlockchainStatus = 'Pending' | 'Success' | 'Failed'

/** Drives the category tabs above the table (Figma: "All domain / For sale / Not listed / Sold / Expiring soon / Expired"). */
export type DomainStatus = 'for-sale' | 'not-listed' | 'sold' | 'expiring-soon' | 'expired'

export type AppraisedTrend = 'high' | 'low' | 'neutral'

export interface MyDomainListing {
  id: string
  domainName: string
  extension: string
  lengthChars: number // Figma shows this under the name, e.g. "7 chars"
  chain: Chain
  status: DomainStatus
  blockchainStatus: BlockchainStatus
  isPremium?: boolean
  listingId?: string
  tokenId?: string
  priceEth?: number // present only when status is 'for-sale'
  priceUsd?: number // present only when status is 'for-sale'
  estimatedValueEth: number // "EST. value" column — appraisal, independent of an active listing
  estimatedValueUsd: number
  appraisedTrend: AppraisedTrend // drives the "High ↗ / Low ↘" indicator under EST. value — same concept as marketplace's AppraisedTrend
  views: number // "Interest" column, eye count
  savedCount: number // "Interest" column, heart count
  renewalTimestamp: number // ms epoch — "Renewal" column / countdown badge
}

/**
 * Backs the "List a domain / Edit listing" modal flow (implementation plan
 * §6) — looked up by domain id rather than folded into MyDomainListing,
 * since these fields only matter inside that flow, not the table. Deliberately
 * excludes a per-domain approval flag: see mockWalletHasMarketplaceApproval
 * in src/data/my-domains/domains.ts for why that's wallet-wide instead.
 */
export interface DomainListingInsights {
  endlessScore: number // 0–5, "Endless score"
  demand: 'low' | 'medium' | 'high'
  comparableSalesLowUsd: number
  comparableSalesHighUsd: number
  quickSaleUsd: number
  suggestedUsd: number
  ambitiousUsd: number
  gasTokenSymbol: string // "POL", "ETH", etc — per chain
  approvalFeeEstimate: string // "≈ 0.02 POL", pre-formatted mock string, not computed
  /** Wrong-network demo branch (implementation plan §12, Phase C) — when set, the form's mock wallet reports being on this chain instead of the domain's own. */
  walletOnWrongNetwork?: boolean
  /** Insufficient-funds demo branch (implementation plan §12, Phase D) — when set, signAndSubmit resolves { ok: false, reason: 'insufficient-funds' }. */
  insufficientFunds?: boolean
}

export interface MyDomainsPagination {
  page: number
  limit: number
  totalPages: number
  lastPage: number
  nextPage: number | null
  prevPage: number | null
}

/** Counts backing the category tab row, keyed by DomainStatus plus 'all'. */
export type MyDomainsStatusCounts = Record<DomainStatus | 'all', number>

export interface MyDomainsSummary {
  domains: MyDomainListing[]
  pagination: MyDomainsPagination
  statusCounts: MyDomainsStatusCounts
  totalDomains: number
  estimatedValueEth: number // top stat card: "Estimated value"
  estimatedValueUsd: number
  listedValueEth: number // top stat card: "Listed value" — ETH live on sale
  soldCount: number // top stat card: "Sold, all time"
  soldValueUsd: number
}
