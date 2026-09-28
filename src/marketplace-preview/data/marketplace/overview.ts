import type {
  ComparableSale,
  DomainActivityEvent,
  DomainInterest,
  DomainNameFacts,
  DomainOverview,
  DomainPriceHistory,
  MarketplaceListing,
  PricePoint,
  SellerSummary,
  TradePoint,
} from '@/marketplace-preview/types/marketplace'
import { ARBITRUM, BSC, ETHEREUM, POLYGON, mockListings, mockMarketplaceBuyInsights } from './domains'
import { seededRandom } from './seededRandom'
import { getMockSale } from './orders'

/**
 * STATIC MOCK DATA — the domain overview page's per-domain data (plan §6.3).
 * Only the hooks in src/hooks/marketplace/domain-overview/ read this file;
 * composites get everything by props.
 */

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Exact Figma 5:3570 numbers for the banking.ud fixture, layered over the
 * generated values so the page can be compared with the frame directly.
 */
const OVERVIEW_FIXTURES: Record<string, { interest?: DomainInterest; seller?: Partial<SellerSummary> }> = {
  'banking.ud': {
    // Figma draws both at 1248 / "▲ 9.7%", views in the negative colours
    // (red bar, sad face, red delta). Views is a -9.7% change here so the
    // page still reads like the frame while arrow and colour agree with the
    // sign (plan §2.7 Q3/Q4).
    interest: { views7d: { value: 1248, changePct: -9.7 }, watchers: { value: 1248, changePct: 9.7 }, saved: 156 },
    seller: { memberSince: '2024-05-01T00:00:00.000Z', activeListings: 37, completedSales: 31 },
  },
}

/** A label plus a dotted extension, e.g. "banking.ud". Anything else is the not found state. */
const DOMAIN_PATTERN = /^([a-z0-9-]+)(\.[a-z0-9]+)$/i

const buildFacts = (label: string, extension: string, listing: MarketplaceListing | null): DomainNameFacts => {
  const rng = seededRandom(`facts:${label}${extension}`)
  return {
    fullName: `${label}${extension}`,
    label,
    extension,
    // A name with no listing has no chain in the mock data, so one is picked
    // from the marketplace's own four; a real adapter reads it from the
    // resolved naming provider instead.
    chain: listing?.chain ?? rng.pick([POLYGON, ETHEREUM, ARBITRUM, BSC]),
    characterCount: label.length,
    // Every mock listing is .ud, a one-time-purchase naming service.
    renewal: (listing?.isOneTimePurchase ?? extension === '.ud') ? 'one-time' : 'annual',
    // Same figure the buying flow's "Model estimate" row shows for a listing.
    modelEstimateUsd: listing ? mockMarketplaceBuyInsights[listing.id]?.modelEstimateUsd ?? null : rng.int(900, 24000),
  }
}

const buildInterest = (fullName: string): DomainInterest => {
  const rng = seededRandom(`interest:${fullName}`)
  const views = rng.int(120, 2400)
  return {
    views7d: { value: views, changePct: rng.float(-18, 24) },
    watchers: { value: rng.int(Math.round(views * 0.2), views), changePct: rng.float(-18, 24) },
    saved: rng.int(4, 220),
  }
}

const buildSeller = (listing: MarketplaceListing): SellerSummary => {
  const rng = seededRandom(`seller:${listing.sellerAddress}`)
  return {
    address: listing.sellerAddress,
    displayAddress: listing.sellerAddress,
    memberSince: new Date(Date.now() - rng.int(60, 900) * DAY_MS).toISOString(),
    activeListings: rng.int(1, 60),
    completedSales: rng.int(0, 45),
    portfolioSlug: null,
  }
}

/**
 * Turns a URL's domain name into the page's view model. A listed name gets
 * its listing and seller; a well-formed name with no listing (e.g. one
 * reached from a comparable sale) still gets a page in the not listed state;
 * a malformed name returns null, the not found state.
 */
export function resolveDomainOverview(fullName: string): DomainOverview | null {
  const match = DOMAIN_PATTERN.exec(fullName.trim())
  if (!match) return null
  const label = match[1].toLowerCase()
  const extension = match[2].toLowerCase()
  const normalized = `${label}${extension}`

  const listing = mockListings.find((item) => `${item.domainName}${item.extension}`.toLowerCase() === normalized) ?? null
  const fixture = OVERVIEW_FIXTURES[normalized]
  const seller = listing ? { ...buildSeller(listing), ...fixture?.seller } : null
  // Bought this session through the buy flow (plan §6.5, §7 item 4).
  const sale = listing ? getMockSale(listing.id) : null

  return {
    facts: buildFacts(label, extension, listing),
    listing,
    status: sale ? 'sold' : listing ? 'listed' : 'not-listed',
    soldAt: sale?.soldAt ?? null,
    viewerOrderId: sale?.orderId ?? null,
    seller,
    interest: fixture?.interest ?? buildInterest(normalized),
    expiresAt: sale ? null : listing?.expiresAt ?? null,
  }
}

const HEX = '0123456789abcdef'

/** A truncated wallet address in the mock's display form, e.g. "0x41bE…9f02". */
const fakeAddress = (rng: ReturnType<typeof seededRandom>): string => {
  const hex = (length: number) => Array.from({ length }, () => rng.pick(HEX.split(''))).join('')
  return `0x${hex(4)}…${hex(4)}`
}

/**
 * The Activity card's events, newest first (plan §6.6). A listed name starts
 * with its current listing; before that the generator walks back through
 * earlier owners (listed → maybe repriced → sold on to the next owner), so
 * the history reads as one consistent chain. Returns null for a malformed
 * name, the same as the overview.
 */
export function buildDomainActivity(fullName: string): DomainActivityEvent[] | null {
  const overview = resolveDomainOverview(fullName)
  if (!overview) return null
  const { facts, listing } = overview
  const rng = seededRandom(`activity:${facts.fullName}`)
  const events: DomainActivityEvent[] = []
  const basePrice = listing?.priceUsd ?? facts.modelEstimateUsd ?? 5000
  let owner = listing?.sellerAddress ?? fakeAddress(rng)
  let cursor = listing ? new Date(listing.listedAt).getTime() : Date.now() - rng.int(1, 20) * DAY_MS
  const push = (event: Omit<DomainActivityEvent, 'id'>) => events.push({ ...event, id: `${facts.fullName}-${events.length}` })

  if (listing) {
    push({ kind: 'listed', actorAddress: owner, priceUsd: listing.priceUsd, occurredAt: new Date(cursor).toISOString() })
  } else {
    // Not for sale now: the most recent thing that happened was a delisting.
    push({ kind: 'delisted', actorAddress: owner, occurredAt: new Date(cursor).toISOString() })
  }

  const cycles = rng.int(2, 3)
  for (let i = 0; i < cycles; i += 1) {
    const seller = fakeAddress(rng)
    const soldFor = Math.round(basePrice * rng.float(0.55, 0.95, 2))
    cursor -= rng.int(2, 30) * DAY_MS
    // `owner` bought it from `seller`.
    push({ kind: 'sold', actorAddress: owner, counterpartyAddress: seller, priceUsd: soldFor, occurredAt: new Date(cursor).toISOString() })
    if (rng.next() < 0.5) {
      cursor -= rng.int(1, 10) * DAY_MS
      push({ kind: 'price-changed', actorAddress: seller, priceUsd: soldFor, occurredAt: new Date(cursor).toISOString() })
    }
    cursor -= rng.int(1, 14) * DAY_MS
    push({ kind: 'listed', actorAddress: seller, priceUsd: Math.round(soldFor * rng.float(1.05, 1.3, 2)), occurredAt: new Date(cursor).toISOString() })
    owner = seller
  }

  return events
}

const BUCKET_MS = 12 * 60 * 60 * 1000
// 30 days of 12 hour buckets, end inclusive — the same 61 volume columns
// Figma draws under the chart (5:4880).
const PRICE_HISTORY_BUCKETS = 61

/**
 * Edge fixture (plan §6.3 item 4): a name with no sales history, for the
 * empty chart and empty comparable sales states. qi.ud is one of the short
 * mock listings.
 */
const NO_SALES_HISTORY = new Set(['qi.ud'])

const round1 = (value: number) => Math.round(value * 10) / 10

/**
 * The Price history tab's 30 day series (plan §6.6): an average price random
 * walk around the listing price (or the model estimate), volume and sales
 * per bucket, individual trades scattered around each bucket's average, and
 * the four headline stats. Buckets are aligned to 12 hour boundaries so a
 * reload renders the same chart. Returns null for a malformed name.
 */
export function buildDomainPriceHistory(fullName: string): DomainPriceHistory | null {
  const overview = resolveDomainOverview(fullName)
  if (!overview) return null
  const { facts, listing } = overview
  const refreshedAt = new Date().toISOString()

  if (NO_SALES_HISTORY.has(facts.fullName)) {
    const flat = { value: 0, changePct: 0 }
    return { rangeDays: 30, points: [], trades: [], stats: { avgPrice: flat, volume: flat, sales: flat, views: { value: overview.interest.views7d.value, changePct: 0 } }, refreshedAt }
  }

  const rng = seededRandom(`history:${facts.fullName}`)
  const base = listing?.priceUsd ?? facts.modelEstimateUsd ?? 5000
  const end = Math.floor(Date.now() / BUCKET_MS) * BUCKET_MS
  const points: PricePoint[] = []
  const trades: TradePoint[] = []
  // A gentle walk that drifts toward the current price, so the month reads
  // as plausible market movement rather than a runaway line.
  let price = base * rng.float(0.88, 1.02, 3)

  for (let i = 0; i < PRICE_HISTORY_BUCKETS; i += 1) {
    const at = end - (PRICE_HISTORY_BUCKETS - 1 - i) * BUCKET_MS
    const pull = (base - price) * 0.06
    price = Math.min(base * 1.3, Math.max(base * 0.6, price + pull + price * rng.float(-0.035, 0.035, 3)))
    const sales = rng.int(0, 4)
    points.push({
      date: new Date(at).toISOString(),
      avgPriceUsd: Math.round(price),
      // Never zero, so every column shows, as in Figma.
      volumeUsd: Math.round(Math.max(sales, 1) * price * rng.float(0.6, 1.1, 2)),
      sales,
    })
    for (let k = 0; k < sales; k += 1) {
      trades.push({
        date: new Date(at + rng.int(-5, 5) * 60 * 60 * 1000).toISOString(),
        priceUsd: Math.round(price * rng.float(0.8, 1.28, 3)),
      })
    }
  }

  const first = points[0].avgPriceUsd
  const last = points[points.length - 1].avgPriceUsd
  const mean = points.reduce((sum, point) => sum + point.avgPriceUsd, 0) / points.length

  return {
    rangeDays: 30,
    points,
    trades,
    stats: {
      avgPrice: { value: Math.round(mean), changePct: round1(((last - first) / first) * 100) },
      volume: { value: points.reduce((sum, point) => sum + point.volumeUsd, 0), changePct: rng.float(-15, 28) },
      sales: { value: points.reduce((sum, point) => sum + point.sales, 0), changePct: rng.float(-15, 28) },
      views: { value: rng.int(400, 6000), changePct: rng.float(-15, 28) },
    },
    refreshedAt,
  }
}

const COMPARABLE_SALES_COUNT = 11 // the number of rows Figma draws (5:6148)

/**
 * The Comparable sales tab (plan §6.6): other names on the same extension,
 * each sold within the last ~4 months at a price near this domain's, newest
 * first. Names come from the marketplace's own listings, so every row opens
 * a real overview page. Returns null for a malformed name.
 */
export function buildComparableSales(fullName: string): ComparableSale[] | null {
  const overview = resolveDomainOverview(fullName)
  if (!overview) return null
  const { facts, listing } = overview
  if (NO_SALES_HISTORY.has(facts.fullName)) return []

  const rng = seededRandom(`comparables:${facts.fullName}`)
  const base = listing?.priceUsd ?? facts.modelEstimateUsd ?? 5000
  const pool = mockListings.filter((item) => `${item.domainName}${item.extension}` !== facts.fullName)
  // Seeded Fisher–Yates, so the same domain always lists the same names.
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i)
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool
    .slice(0, COMPARABLE_SALES_COUNT)
    .map((item) => ({
      id: `${facts.fullName}-comp-${item.id}`,
      fullName: `${item.domainName}${item.extension}`,
      extension: item.extension,
      priceUsd: Math.round(base * rng.float(0.7, 1.3, 3)),
      soldAt: new Date(Date.now() - rng.int(1, 120) * DAY_MS).toISOString(),
    }))
    .sort((a, b) => new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime())
}
