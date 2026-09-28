import type { DomainNameFacts, MarketplaceListing, MarketplaceOrder } from '@/marketplace-preview/types/marketplace'
import { computeFeeBreakdown } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import { BSC } from './domains'

/**
 * STATIC MOCK DATA — completed purchases (domain-overview plan §6.3 item 5,
 * §6.5). Module level, so an order recorded when the buy flow settles is
 * still there when "View receipt" opens its page, and the bought name's
 * overview flips to Sold. A hard reload clears everything except the seeded
 * Figma order, fine for a preview. Real version: `GET /marketplace/orders/:id`
 * and `POST /marketplace/buy-domain` returning the new order id (plan §8.2).
 */

// Figma 5:7438's own order, so the receipt can be compared with the frame.
// The hash keeps Figma's visible ends ("0x7f3a…456e8", the buy flow's 6 + 5
// truncation). Placed 18 Sep 2026 14:22 local time.
const FIGMA_PLACED_AT = new Date(2026, 8, 18, 14, 22).toISOString()
const FIGMA_FACTS: DomainNameFacts = {
  fullName: 'banking.ud',
  label: 'banking',
  extension: '.ud',
  chain: BSC,
  characterCount: 7,
  renewal: 'one-time',
  modelEstimateUsd: 8460,
}

const INDEXED_NOTE = 'within 10 to 15 minutes'

const buildOrder = (id: string, facts: DomainNameFacts, priceUsd: number, networkFeeUsd: number, txHash: string, placedAt: string): MarketplaceOrder => {
  const { feeAmount, youReceive } = computeFeeBreakdown(priceUsd)
  return {
    id,
    status: 'completed',
    placedAt,
    domain: facts,
    pricePaidUsd: priceUsd,
    networkFeeUsd,
    sellerReceivedUsd: youReceive,
    marketplaceFeeUsd: feeAmount,
    txHash,
    // Signing, payment and transfer land in the one transaction, so they
    // share its timestamp; indexing follows within minutes (Figma 5:7593).
    timeline: [
      { step: 'signed', at: placedAt },
      { step: 'payment-sent', at: placedAt },
      { step: 'transferred', at: placedAt },
      { step: 'indexed', at: null, note: INDEXED_NOTE },
    ],
  }
}

const mockOrders = new Map<string, MarketplaceOrder>([
  [
    'ED-2026-0918-00123',
    buildOrder(
      'ED-2026-0918-00123',
      FIGMA_FACTS,
      8460,
      0.42,
      '0x7f3a9e2d1c7b8aaf4c1e0b9d27f6a3c58e1d0b4f7a2c9e6d3b8f1a0c5e7456e8',
      FIGMA_PLACED_AT
    ),
  ],
])

/** Listing ids bought in this session, with when and by which order. */
const soldListings = new Map<string, { soldAt: string; orderId: string }>()

let orderSequence = 123

/** ED-YYYY-MMDD-NNNNN, the format Figma's order number uses. */
const nextOrderId = (at: Date): string => {
  orderSequence += 1
  const pad = (value: number, length: number) => String(value).padStart(length, '0')
  return `ED-${at.getFullYear()}-${pad(at.getMonth() + 1, 2)}${pad(at.getDate(), 2)}-${pad(orderSequence, 5)}`
}

export function getMockOrder(orderId: string): MarketplaceOrder | null {
  return mockOrders.get(orderId) ?? null
}

/** Called by the buy flow when a purchase settles (plan §6.5). Returns the new order id. */
export function recordMockOrder(input: { listing: MarketplaceListing; facts: DomainNameFacts; networkFeeUsd: number; txHash: string }): string {
  const now = new Date()
  const id = nextOrderId(now)
  mockOrders.set(id, buildOrder(id, input.facts, input.listing.priceUsd, input.networkFeeUsd, input.txHash, now.toISOString()))
  soldListings.set(input.listing.id, { soldAt: now.toISOString(), orderId: id })
  return id
}

/** Whether (and when) a listing was bought this session — the overview's Sold state. */
export function getMockSale(listingId: string): { soldAt: string; orderId: string } | null {
  return soldListings.get(listingId) ?? null
}
