/**
 * No market-wide activity feed exists in the backend today (confirmed during
 * planning — only per-user history via useGetUserHistoryQuery). This shape is
 * modeled purely off the Figma design and isolated behind its own hook
 * (useMarketActivity) so it can be swapped for a real endpoint later without
 * touching any rendering component. See the implementation plan, section 9/11.
 */

export type ActivityAction = 'bought' | 'listed' | 'dropped'
export type ActivityFilter = 'all' | 'sale' | 'listing' | 'drop'

export interface ActivityFeedItem {
  id: string
  actorAddress: string // shortened form, e.g. '0xdead...beef'
  action: ActivityAction
  itemLabel: string // e.g. '101.nft'
  priceUsd: number
  occurredAt: string // ISO timestamp — UI derives the relative "now" / "2m ago" label
}

/**
 * Figma node 34:2031 (mobile-only "Trading signal" ticker) — a domain's
 * latest price movement, not a full actor/action sentence like
 * ActivityFeedItem above, so it gets its own shape rather than stretching
 * that one to fit. `action` reuses ActivityAction so the ticker's All/Sale/
 * Listing/Drop dropdown can filter with the exact same semantics as
 * LiveActivityPanel's own tabs (see FILTER_TO_ACTION there).
 */
export interface TickerItem {
  id: string
  domain: string // e.g. 'zero.eth'
  priceUsd: number
  changePercent: number // signed
  action: ActivityAction
  occurredAt: string // ISO timestamp — UI derives the relative "6m ago" label
}
