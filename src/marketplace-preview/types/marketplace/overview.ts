import type { Chain, MarketplaceListing } from './domain'

/**
 * View models for the domain overview page (domain-overview plan §6.1).
 * Components only ever see these shapes — mock data and, later, the real
 * API adapters (plan §8.3) both map into them.
 */

export type DomainOverviewTab = 'overview' | 'price-history' | 'comparable-sales' | 'offers'

/** changePct is signed: +9.7 / -3.1. */
export interface TrendValue {
  value: number
  changePct: number
}

export interface DomainNameFacts {
  fullName: string // 'banking.ud'
  label: string // 'banking'
  extension: string // '.ud'
  chain: Chain
  /** Computed from the label, never typed in (plan §2.7 Q2). */
  characterCount: number
  renewal: 'one-time' | 'annual'
  modelEstimateUsd: number | null
}

export interface SellerSummary {
  /** Full address for links and copy. The mock only carries the truncated display form, so both fields hold it there. */
  address: string
  displayAddress: string // '0x8A7F…3c9D'
  memberSince: string // ISO
  activeListings: number
  completedSales: number
  /** The seller portfolio route's user_hash. Listings don't carry it today (plan O5). */
  portfolioSlug: string | null
}

export interface DomainInterest {
  views7d: TrendValue
  watchers: TrendValue
  /** Hearts from other wallets, shown in the summary tile. The current viewer's own heart is added on top at render time. */
  saved: number
}

export type DomainActivityKind = 'listed' | 'sold' | 'price-changed' | 'delisted' | 'transferred'

export interface DomainActivityEvent {
  id: string
  kind: DomainActivityKind
  actorAddress: string
  counterpartyAddress?: string
  priceUsd?: number
  occurredAt: string // ISO
}

export type DomainOverviewStatus = 'listed' | 'not-listed' | 'sold'

export interface DomainOverview {
  facts: DomainNameFacts
  /** null = not currently for sale. */
  listing: MarketplaceListing | null
  status: DomainOverviewStatus
  /** ISO, set only when status is 'sold' (plan §7 item 4). */
  soldAt: string | null
  /** The current viewer's own order for this name, when they're the one who bought it — the hero links to its receipt. */
  viewerOrderId: string | null
  seller: SellerSummary | null
  interest: DomainInterest
  expiresAt: string | null
}

export interface PricePoint {
  date: string
  avgPriceUsd: number
  volumeUsd: number
  sales: number
}

export interface TradePoint {
  date: string
  priceUsd: number
}

export interface DomainPriceHistory {
  rangeDays: 30
  points: PricePoint[]
  trades: TradePoint[]
  stats: { avgPrice: TrendValue; volume: TrendValue; sales: TrendValue; views: TrendValue }
  refreshedAt: string
}

export interface ComparableSale {
  id: string
  fullName: string
  extension: string
  priceUsd: number
  soldAt: string
}
