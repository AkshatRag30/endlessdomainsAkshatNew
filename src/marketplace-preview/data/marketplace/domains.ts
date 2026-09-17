import { Chain, MarketplaceListing } from '@/marketplace-preview/types/marketplace'

/**
 * STATIC MOCK DATA — not live. See useMarketplaceListings (Phase 3+) for the
 * hook boundary this feeds, and the implementation plan section 11 for how
 * this gets replaced by a real, mapped API response later.
 *
 * Chain icon paths below are placeholders (project has no chain-logo assets
 * yet) — real SVGs need to be sourced when ChainBadge is actually built.
 */

export const POLYGON: Chain = { id: 'polygon', label: 'Polygon', iconSrc: '/assets/img/chains/polygon.svg' }
export const ETHEREUM: Chain = { id: 'ethereum', label: 'Ethereum', iconSrc: '/assets/img/chains/ethereum.svg' }
export const ARBITRUM: Chain = { id: 'arbitrum', label: 'Arbitrum', iconSrc: '/assets/img/chains/arbitrum.svg' }
export const BSC: Chain = { id: 'bsc', label: 'BNB Chain', iconSrc: '/assets/img/chains/bnb.svg' }

const NAME_STEMS = [
  'cryptowave', 'pixelforge', 'nebulax',
  'thisisanextremelylongdomainnamefortestingpurposes', // test fixture — mobile's domain pane needs a name long enough to actually force its internal scroll; placed in the first page (pageSize 14) so it's visible without clicking "Show more" first
  'voidrunner', 'aetherlink', 'quantumleap',
  'driftpoint', 'novacore', 'echobyte', 'lunarforge', 'zenithcode', 'ironvault',
  'solaris', 'mythicnode', 'glasswave', 'obsidian', 'stellarhash', 'cinderwolf',
  'prismatic', 'rovergrid', 'emberlink', 'frostbyte', 'orbitcast', 'wildcircuit',
  'vantagepoint', 'crimsontide', 'hollowmoon', 'silverfrost',
  // Short/medium fixtures — every stem above is 7+ characters, which left
  // the Length filter's "1-3 characters" and "4-6 characters" buckets with
  // nothing to ever match.
  'nx', 'qi', 'vox', 'nova', 'zeta', 'flux', 'echo',
]

const DAY_MS = 24 * 60 * 60 * 1000

function buildListings(): MarketplaceListing[] {
  const chains = [POLYGON, ETHEREUM, ARBITRUM, BSC]

  return NAME_STEMS.map((stem, index) => {
    const isHighAppraisal = index % 2 === 0
    // Spread across all three Price filter buckets (Under 5 / 5-15 / 15+
    // ETH) instead of the narrower 8-16 range this used to sit in, which
    // left "Under 5 ETH" with nothing to ever show.
    const priceEth = Number((3 + (index % 9) * 2.1).toFixed(2))
    // Spread across all four Listed filter buckets (today / this week /
    // this month / older) the same way.
    const listedDaysAgo = [0.2, 3, 20, 60][index % 4]

    return {
      id: `listing-${index + 1}`,
      domainName: stem,
      extension: '.ud',
      isPremium: index % 3 === 0,
      chain: chains[index % chains.length],
      priceEth,
      priceUsd: Math.round(priceEth * 2820),
      appraisedValueEth: isHighAppraisal ? priceEth : Number((priceEth * 0.75).toFixed(2)),
      appraisedTrend: isHighAppraisal ? 'high' : 'low',
      isPromoted: index < 8, // matches the Figma file's own promoted row, which repeats 8 cards
      isFavorited: false,
      listedAt: new Date(Date.now() - listedDaysAgo * DAY_MS).toISOString(),
    }
  })
}

export const mockListings: MarketplaceListing[] = buildListings()

export const mockPromotedListings: MarketplaceListing[] = mockListings.filter((listing) => listing.isPromoted)

export const MOCK_LISTINGS_TOTAL = mockListings.length // 28, matches "28 domains" in the reference design
