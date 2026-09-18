import { POLYGON, ETHEREUM, ARBITRUM, BSC } from '@/data/marketplace/domains'
import { DomainStatus, MyDomainListing, MyDomainsSummary } from '@/types/my-domains'

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
