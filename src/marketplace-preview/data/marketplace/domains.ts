import { Chain, MarketplaceBuyInsights, MarketplaceListing } from '@/marketplace-preview/types/marketplace'

/**
 * STATIC MOCK DATA — not live. See useMarketplaceListings (Phase 3+) for the
 * hook boundary this feeds, and the implementation plan section 11 for how
 * this gets replaced by a real, mapped API response later.
 *
 * Chain icon paths point at the real logo files in
 * public/assets/img/chain-logos/ — ChainBadge renders `chain.iconSrc`
 * directly.
 */

export const POLYGON: Chain = { id: 'polygon', label: 'Polygon', iconSrc: '/assets/img/chain-logos/polygon.svg' }
export const ETHEREUM: Chain = { id: 'ethereum', label: 'Ethereum', iconSrc: '/assets/img/chain-logos/ethereum.svg' }
export const ARBITRUM: Chain = { id: 'arbitrum', label: 'Arbitrum', iconSrc: '/assets/img/chain-logos/arb.svg' }
export const BSC: Chain = { id: 'bsc', label: 'BNB Chain', iconSrc: '/assets/img/chain-logos/bnb.svg' }
// Not part of the marketplace's own 4-chain set below (buildListings'
// `chains` array, the filter dropdowns, ...) — only used by
// useMyDomainsData's deriveChain for domains whose blockchain is "UDBASE".
export const BASE: Chain = { id: 'base', label: 'Base', iconSrc: '/assets/img/chain-logos/Base.png' }

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

// Deterministic fake seller addresses for the buying flow's "Seller" row —
// the first one is the Figma reference frame's own "0x8A7F…3c9D".
const SELLER_ADDRESSES = ['0x8A7F…3c9D', '0x41bE…9f02', '0xC3d9…07aA', '0x9e15…b6C4', '0x2F6a…e81D']

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
      sellerAddress: SELLER_ADDRESSES[index % SELLER_ADDRESSES.length],
      // 18 days out for the first listing lands on the Figma reference's
      // "expires 12 Oct 2026" when viewed on 24 Sep 2026; the rest spread
      // across the 90-day maximum a listing can run.
      expiresAt: new Date(Date.now() + (18 + ((index * 11) % 70)) * DAY_MS).toISOString(),
      isOneTimePurchase: true, // every fixture is .ud, a one-time-purchase naming service
    }
  })
}

export const mockListings: MarketplaceListing[] = buildListings()

export const mockPromotedListings: MarketplaceListing[] = mockListings.filter((listing) => listing.isPromoted)

export const MOCK_LISTINGS_TOTAL = mockListings.length // 28, matches "28 domains" in the reference design

/**
 * Buying flow demo branches (plan §7), picked by listing — both are Polygon
 * listings, so the banner's "Listings settle on Polygon" reads true:
 *
 *   listing-5 (voidrunner.ud, 32,148) — wallet starts on the wrong network,
 *     then settles fine: Figma "wrong network" section 1:988 → Bought.
 *   listing-13 (ironvault.ud, 26,226) — same wrong-network start, but the
 *     transaction fails while settling: 1:988 → Reject (1:1043).
 *   listing-3 (nebulax.ud, 20,304) — right network, affordable, but another
 *     wallet buys it while this purchase is settling: → No longer available
 *     (1:1478). Nothing is charged.
 *
 * "No fund" (1:1529) needs no flag — it's a numeric comparison. Any listing
 * priced above the balance shows it, e.g. listing-9 (novacore.ud, 55,836)
 * against the starting 41,200, or anything once earlier buys have spent
 * the balance down.
 */
const BUY_FIXTURES: Record<string, Partial<MarketplaceBuyInsights>> = {
  'listing-5': { walletOnWrongNetwork: true },
  'listing-13': { walletOnWrongNetwork: true, transactionFails: true },
  'listing-3': { alreadySold: true },
}

/**
 * STATIC MOCK DATA — buying flow per-listing insights (buying-flow plan
 * §6.1), keyed by listing id. Fee figures are the Figma reference frame's
 * own (≈ 0.42 USDT purchase, ≈ 0.21 USDT approval); the model estimate
 * mirrors each listing's appraised value.
 */
export const mockMarketplaceBuyInsights: Record<string, MarketplaceBuyInsights> = Object.fromEntries(
  mockListings.map((listing) => [
    listing.id,
    {
      networkFeeEstimateUsd: 0.42,
      approvalFeeEstimateUsd: 0.21,
      modelEstimateUsd: Math.round(listing.appraisedValueEth * 2820),
      ...BUY_FIXTURES[listing.id],
    },
  ])
)

// STATIC MOCK DATA — stands in for an on-chain
// allowance(wallet, marketplaceContract) read. Unlike listing's wallet-wide,
// permanent NFT approval (mockWalletHasMarketplaceApproval in
// data/my-domains/domains.ts), USDT's allowance is amount-scoped and gets
// consumed by each purchase — approving for one price does not cover a
// later, differently-priced one. See buying-flow-implementation-plan.md §6.2.
// Starts at 0 so the demo's default path is "need usdt approval" (Phase A).
// For the already-approved "normal purchase" path (Phase B), open
// /design-preview/marketplace?usdtAllowance=20000 — that preview page seeds
// this through setMockWalletUsdtAllowance on load.
export let mockWalletUsdtAllowance = 0

/** Same read-only-binding reasoning as setMockWalletHasMarketplaceApproval — the mock hook mutates through this setter. */
export function setMockWalletUsdtAllowance(value: number): void {
  mockWalletUsdtAllowance = value
}

// Stands in for an on-chain USDT balanceOf read for the connected wallet.
// Drives both the "Pay with" card's "Balance {X} USDT" line and the "no
// fund" scenario. 41,200 is the Figma reference frame's own figure.
export let mockWalletUsdtBalance = 41200

export function setMockWalletUsdtBalance(value: number): void {
  mockWalletUsdtBalance = value
}
