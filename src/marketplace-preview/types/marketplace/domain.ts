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
}
