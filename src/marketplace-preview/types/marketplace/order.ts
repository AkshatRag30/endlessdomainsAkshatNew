import type { DomainNameFacts } from './overview'

/** Receipt page view models (domain-overview plan §6.2). */

export type OrderStatus = 'pending' | 'completed' | 'failed'

export type OrderTimelineStep = 'signed' | 'payment-sent' | 'transferred' | 'indexed'

export interface OrderTimelineEntry {
  step: OrderTimelineStep
  /** ISO. null = still to come, shown with `note` instead of a timestamp. */
  at: string | null
  note?: string
}

export interface MarketplaceOrder {
  /** 'ED-2026-0918-00123' — the route param, no leading '#'. */
  id: string
  status: OrderStatus
  placedAt: string // ISO
  /** Snapshot of the name at purchase time. */
  domain: DomainNameFacts
  pricePaidUsd: number
  networkFeeUsd: number
  /** Both from computeFeeBreakdown, never typed in (plan §2.7 Q9). */
  sellerReceivedUsd: number
  marketplaceFeeUsd: number
  txHash: string
  timeline: OrderTimelineEntry[]
}
