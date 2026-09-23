import { POLYGON, ETHEREUM, ARBITRUM, BSC } from '@/marketplace-preview/data/marketplace/domains'
import { DomainListingInsights, DomainStatus, MyDomainListing, MyDomainsSummary } from '@/marketplace-preview/types/my-domains'

/**
 * STATIC MOCK DATA for the "My Domains" dashboard revamp — not live. Feeds
 * the future useMyDomains hook boundary the same way mockListings feeds
 * useMarketplaceListings (see src/data/marketplace/domains.ts) — swap the
 * hook's body for useGetDomainSummaryByUserQuery + a response mapper later,
 * every component downstream stays untouched.
 *
 * The Figma file's own placeholder numbers don't agree with each other (the
 * "Domains" stat card says 24, the category tabs sum to 45, the sidebar's
 * "My domains" badge says 80) — see the implementation plan, section 12.
 * This fixture picks one internally consistent total (24) rather than
 * reproducing the mismatch.
 */

const NAME_STEMS = [
  'cryptowave', 'pixelforge', 'nebulax', 'voidrunner', 'aetherlink',
  'quantumleap', 'driftpoint', 'novacore',
  'thisisanextremelylongdomainnamefortestingpurposes', // layout fixture — same purpose as the marketplace list's long-name entry
  'echobyte', 'lunarforge', 'zenithcode', 'ironvault', 'solaris',
  'mythicnode', 'glasswave', 'obsidian', 'stellarhash', 'cinderwolf',
  'prismatic', 'rovergrid', 'emberlink', 'frostbyte',
]

const DAY_MS = 24 * 60 * 60 * 1000

// Roughly matches the shape of the Figma category tabs (for-sale/not-listed
// biggest, sold/expiring-soon/expired small), scaled down to a 24-domain total.
const STATUS_BY_INDEX: DomainStatus[] = [
  'for-sale', 'for-sale', 'for-sale', 'for-sale', 'for-sale', 'for-sale', 'for-sale', 'for-sale', 'for-sale', 'for-sale', 'for-sale',
  'not-listed', 'not-listed', 'not-listed', 'not-listed', 'not-listed', 'not-listed', 'not-listed', 'not-listed',
  'sold', 'sold', 'sold',
  'expiring-soon',
  'expired',
]

function buildDomains(): MyDomainListing[] {
  const chains = [POLYGON, ETHEREUM, ARBITRUM, BSC]

  return NAME_STEMS.map((stem, index) => {
    const status = STATUS_BY_INDEX[index]
    const isForSale = status === 'for-sale'
    const priceEth = Number((6 + (index % 9) * 1.6).toFixed(2))
    const estimatedValueEth = Number((priceEth * (1.1 + (index % 4) * 0.15)).toFixed(2))

    let blockchainStatus: MyDomainListing['blockchainStatus'] = 'Success'
    if (index === 4) blockchainStatus = 'Pending' // fixture: the disabled "In Progress" action state
    if (index === 15) blockchainStatus = 'Failed'

    let renewalTimestamp = Date.now() + (30 + index * 14) * DAY_MS
    if (status === 'expiring-soon') renewalTimestamp = Date.now() + 21 * DAY_MS // matches "Renews in 21 days" in the Needs Attention panel
    if (status === 'expired') renewalTimestamp = Date.now() - DAY_MS // fixture: drives the "EXPIRED" countdown state

    const appraisedTrend: MyDomainListing['appraisedTrend'] = index % 5 === 0 ? 'low' : index % 7 === 0 ? 'neutral' : 'high'

    return {
      id: `my-domain-${index + 1}`,
      domainName: stem,
      extension: '.ud',
      lengthChars: stem.length,
      chain: chains[index % chains.length],
      status,
      blockchainStatus,
      isPremium: isForSale && index % 4 === 0,
      isPromoted: isForSale && index % 6 === 0, // overlaps with isPremium at index 0/12 so at least one fixture shows both markers together
      listingId: isForSale ? `listing-${index + 1}` : undefined,
      tokenId: `${1000 + index}`,
      priceEth: isForSale ? priceEth : undefined,
      priceUsd: isForSale ? Math.round(priceEth * 2820) : undefined,
      estimatedValueEth,
      estimatedValueUsd: Math.round(estimatedValueEth * 2820),
      appraisedTrend,
      views: 40 + ((index * 37) % 600), // "Interest" column
      savedCount: 3 + ((index * 11) % 95),
      renewalTimestamp,
    }
  })
}

export const mockMyDomains: MyDomainListing[] = buildDomains()

function countByStatus(status: DomainStatus): number {
  return mockMyDomains.filter((d) => d.status === status).length
}

export const mockMyDomainsSummary: MyDomainsSummary = {
  domains: mockMyDomains,
  pagination: {
    page: 1,
    limit: 30,
    totalPages: 1,
    lastPage: 1,
    nextPage: null,
    prevPage: null,
  },
  statusCounts: {
    all: mockMyDomains.length,
    'for-sale': countByStatus('for-sale'),
    'not-listed': countByStatus('not-listed'),
    sold: countByStatus('sold'),
    'expiring-soon': countByStatus('expiring-soon'),
    expired: countByStatus('expired'),
  },
  totalDomains: mockMyDomains.length,
  estimatedValueEth: Number(mockMyDomains.reduce((sum, d) => sum + d.estimatedValueEth, 0).toFixed(2)),
  estimatedValueUsd: mockMyDomains.reduce((sum, d) => sum + d.estimatedValueUsd, 0),
  listedValueEth: Number(
    mockMyDomains.filter((d) => d.status === 'for-sale').reduce((sum, d) => sum + (d.priceEth ?? 0), 0).toFixed(2)
  ),
  soldCount: countByStatus('sold'),
  soldValueUsd: 5922, // matches the Figma reference card's "$5,922" — no sale-history endpoint exists to derive this from
}

/**
 * "Needs attention" and "Getting the most views" (Figma nodes 50:6264 and
 * 50:6355) are both just filtered/sorted views over the same domain list —
 * not separate data shapes. See useMyDomainsRightRail in the plan, section 09.
 */
export const mockNeedsAttention: MyDomainListing[] = mockMyDomains
  .filter((d) => d.status === 'expiring-soon' || d.status === 'expired')
  .slice(0, 5)

export const mockMostViewed: MyDomainListing[] = [...mockMyDomains]
  .sort((a, b) => b.views - a.views)
  .slice(0, 5)

/**
 * STATIC MOCK DATA for the "List a domain / Edit listing" modal flow
 * (implementation plan §6/§12) — keyed by domain id, looked up when the
 * flow opens for a given domain. `walletOnWrongNetwork`/`insufficientFunds`
 * are fixtures for the later wrong-network/insufficient-funds phases
 * (Phase C/D) — picking one of those flagged domains is how the demo
 * reaches those branches, no dev-only toggle UI needed (plan §7/§9).
 */
export const mockDomainListingInsights: Record<string, DomainListingInsights> = Object.fromEntries(
  mockMyDomains.map((domain, index) => {
    const base = domain.estimatedValueUsd || domain.priceUsd || 5000
    const suggestedUsd = Math.round(base / 50) * 50
    const insights: DomainListingInsights = {
      endlessScore: Number((3.4 + (index % 5) * 0.3).toFixed(1)),
      demand: index % 3 === 0 ? 'high' : index % 3 === 1 ? 'medium' : 'low',
      comparableSalesLowUsd: Math.round((suggestedUsd * 0.75) / 50) * 50,
      comparableSalesHighUsd: Math.round((suggestedUsd * 1.25) / 50) * 50,
      quickSaleUsd: Math.round((suggestedUsd * 0.9) / 50) * 50,
      suggestedUsd,
      ambitiousUsd: Math.round((suggestedUsd * 1.15) / 50) * 50,
      gasTokenSymbol: 'POL',
      approvalFeeEstimate: '≈ 0.02 POL',
      walletOnWrongNetwork: index === 2, // fixture for Phase C
      insufficientFunds: index === 3, // fixture for Phase D
    }
    return [domain.id, insights]
  })
)

/**
 * STATIC MOCK DATA — stands in for an on-chain isApprovedForAll(wallet,
 * seaportOperator) read. Wallet-wide by design (plan §6), not keyed by
 * domain id: approving once on any domain must make every other domain in
 * this mock data set skip straight to the free "Sign to list" step for the
 * rest of the session, matching the flow's own "once ever" copy. Starts
 * false so a fresh demo naturally takes the first-listing path. A `let`
 * export, not `const` — the mock hook mutates it directly rather than
 * routing through Redux/state for something this deliberately throwaway;
 * swapped for a real isApprovedForAll read once the plan's §8 real wiring
 * happens.
 */
export let mockWalletHasMarketplaceApproval = false

/**
 * TypeScript/ESM treats a named import as a read-only binding, so another
 * module can read mockWalletHasMarketplaceApproval directly but can't
 * reassign it in place — this setter is the mutation path the mock
 * `approve()` action (see useListingFlowActions) calls instead, keeping the
 * flag itself a plain `let` rather than wrapping it in an object/ref just to
 * make it externally mutable.
 */
export function setMockWalletHasMarketplaceApproval(value: boolean): void {
  mockWalletHasMarketplaceApproval = value
}
