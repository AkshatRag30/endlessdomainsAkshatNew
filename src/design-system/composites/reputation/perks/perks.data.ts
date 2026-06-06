import endlessLogo from '../../../../../public/user-profile/endlessnewlogo.svg'

// ── Types ─────────────────────────────────────────────────────────────────────

export type PerkStatus = 'claimable' | 'available' | 'locked' | 'sold-out' | 'expired'
export type PerkTier = 'bronze' | 'silver' | 'gold' | 'platinum'
export type FilterTier = 'all' | PerkTier

export interface PerkItem {
  id: string
  status: PerkStatus
  tier: PerkTier
  type: string
  title: string
  description: string
  partnerName: string
  partnerLogo: string
  claimedCount: number
  totalCount: number
  pointsRequired?: number
  currentPoints?: number
}

// ── Nav links ─────────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'Marketplace', href: '/' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Perks Catalog', href: '#' },
  { label: 'Parked Domains', href: '/parked-domains' },
]

// ── Filter tiers ─────────────────────────────────────────────────────────────

export const FILTER_TIERS: FilterTier[] = ['all', 'bronze', 'silver', 'gold', 'platinum']

// ── Mock perks data (replace with API on integration) ─────────────────────────

const logo = endlessLogo as unknown as string
const LOREM_LONG =
  'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of'
const LOREM_MED =
  'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority'

export const MOCK_PERKS: PerkItem[] = [
  { id: '1', status: 'claimable', tier: 'bronze', type: 'NFT', title: 'Lorem Ipsum', description: LOREM_LONG, partnerName: 'Endless Domains', partnerLogo: logo, claimedCount: 14, totalCount: 50 },
  { id: '2', status: 'available', tier: 'silver', type: 'NFT', title: 'Lorem Ipsum', description: LOREM_MED, partnerName: 'Endless Domains', partnerLogo: logo, claimedCount: 14, totalCount: 50 },
  { id: '3', status: 'locked', tier: 'silver', type: 'NFT', title: 'Lorem Ipsum', description: LOREM_MED, partnerName: 'Endless Domains', partnerLogo: logo, claimedCount: 14, totalCount: 50, pointsRequired: 500, currentPoints: 312 },
  { id: '4', status: 'sold-out', tier: 'bronze', type: 'NFT', title: 'Lorem Ipsum', description: LOREM_LONG, partnerName: 'Endless Domains', partnerLogo: logo, claimedCount: 14, totalCount: 50 },
  { id: '5', status: 'expired', tier: 'bronze', type: 'NFT', title: 'Lorem Ipsum', description: LOREM_LONG, partnerName: 'Endless Domains', partnerLogo: logo, claimedCount: 14, totalCount: 50 },
  { id: '6', status: 'expired', tier: 'bronze', type: 'NFT', title: 'Lorem Ipsum', description: LOREM_LONG, partnerName: 'Endless Domains', partnerLogo: logo, claimedCount: 14, totalCount: 50 },
  { id: '7', status: 'claimable', tier: 'gold', type: 'Discount', title: 'Lorem Ipsum', description: LOREM_LONG, partnerName: 'Endless Domains', partnerLogo: logo, claimedCount: 7, totalCount: 30 },
  { id: '8', status: 'available', tier: 'gold', type: 'Whitelist', title: 'Lorem Ipsum', description: LOREM_MED, partnerName: 'Endless Domains', partnerLogo: logo, claimedCount: 3, totalCount: 20 },
  { id: '9', status: 'locked', tier: 'gold', type: 'NFT', title: 'Lorem Ipsum', description: LOREM_MED, partnerName: 'Endless Domains', partnerLogo: logo, claimedCount: 0, totalCount: 25, pointsRequired: 750, currentPoints: 312 },
  { id: '10', status: 'claimable', tier: 'platinum', type: 'Access', title: 'Lorem Ipsum', description: LOREM_LONG, partnerName: 'Endless Domains', partnerLogo: logo, claimedCount: 2, totalCount: 10 },
  { id: '11', status: 'locked', tier: 'platinum', type: 'NFT', title: 'Lorem Ipsum', description: LOREM_MED, partnerName: 'Endless Domains', partnerLogo: logo, claimedCount: 0, totalCount: 5, pointsRequired: 1000, currentPoints: 312 },
]
