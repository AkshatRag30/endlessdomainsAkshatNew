import { HeroCategoryChip, SidebarSection } from '@/types/marketplace'

/**
 * STATIC MOCK DATA. Real routes are wired where they already exist
 * (Watchlist, My domains, Analytics, Profile); everything else is a
 * placeholder pointing at '/' until that page is built, same convention
 * used by the header's menuItems.ts.
 *
 * Section layout matches Figma node 70:3612 exactly — three sections
 * (Marketplace / Seller Hub / Account) rather than the earlier two-section
 * Browse/Your Account split. Recently sold, Under estimate, Price drops,
 * and Alerts existed in that earlier split but have no counterpart here, so
 * they're dropped rather than kept as orphaned items with no matching
 * design. Payouts, Promotions, Profile, and Settings are new.
 */

// Icon set pulled from Figma node 70:4592 (same file, the sidebar's own
// icon layer). My domains reuses the exact same heart glyph as Watchlist —
// that's not a mismatch on this side, the source file itself gives both
// rows the identical icon asset.
const ICON_BASE = '/assets/img/marketplace/sidebar-icons'

export const mockSidebarSections: SidebarSection[] = [
  {
    id: 'marketplace',
    title: 'Marketplace',
    items: [
      { id: 'explore', label: 'Explore', href: '/', isPlaceholder: true, icon: `${ICON_BASE}/explore.png` },
      { id: 'auctions', label: 'Auctions', href: '/', badge: 'soon', isPlaceholder: true, icon: `${ICON_BASE}/auctions.png` },
      { id: 'extensions', label: 'Extensions', href: '/', count: 37, isPlaceholder: true, icon: `${ICON_BASE}/extensions.svg` },
      { id: 'watchlist', label: 'Watchlist', href: '/profile/watchlist', count: 12, icon: `${ICON_BASE}/watchlist.svg` },
    ],
  },
  {
    id: 'seller-hub',
    title: 'Seller Hub',
    items: [
      { id: 'my-domains', label: 'My domains', href: '/profile/domains', count: 12, icon: `${ICON_BASE}/watchlist.svg` },
      { id: 'analytics', label: 'Analytics', href: '/profile/analytics', count: 4, icon: `${ICON_BASE}/analytics.svg` },
      { id: 'payouts', label: 'Payouts', href: '/', isPlaceholder: true, icon: `${ICON_BASE}/payouts.svg` },
      { id: 'promotions', label: 'Promotions', href: '/', isPlaceholder: true, icon: `${ICON_BASE}/promotions.png` },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    items: [
      { id: 'profile', label: 'Profile', href: '/profile/userProfile', count: 12, icon: `${ICON_BASE}/profile.svg` },
      { id: 'settings', label: 'Settings', href: '/', count: 4, isPlaceholder: true, icon: `${ICON_BASE}/settings.svg` },
    ],
  },
]

export const mockHeroCategoryChips: HeroCategoryChip[] = [
  { id: 'collectibles', label: 'Collectibles', position: { top: '18%', left: '10%' } },
  { id: 'credit-1', label: 'Credit', position: { top: '38%', left: '4%' } },
  { id: 'credit-2', label: 'Credit', position: { top: '62%', left: '14%' } },
  { id: 'real-estate', label: 'Real Estate', position: { top: '16%', right: '12%' } },
  { id: 'equity', label: 'Equity', position: { top: '42%', right: '6%' } },
  { id: 'commodity', label: 'Commodity', position: { top: '64%', right: '14%' } },
]
