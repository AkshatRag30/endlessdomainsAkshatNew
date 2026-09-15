import { HeroCategoryChip, SidebarSection } from '@/marketplace-preview/types/marketplace'

/**
 * STATIC MOCK DATA. Real routes are wired where they already exist
 * (Watchlist, My domains, Seller analytics); everything else is a
 * placeholder pointing at '/' until that page is built, same convention
 * used by the header's menuItems.ts.
 */

export const mockSidebarSections: SidebarSection[] = [
  {
    id: 'browse',
    title: 'Browse',
    items: [
      { id: 'explore', label: 'Explore', href: '/', isPlaceholder: true },
      { id: 'recently-sold', label: 'Recently sold', href: '/', count: 37, isPlaceholder: true },
      { id: 'under-estimate', label: 'Under estimate', href: '/', count: 19, isPlaceholder: true },
      { id: 'price-drops', label: 'Price drops', href: '/', count: 4, isPlaceholder: true },
      { id: 'extensions', label: 'Extensions', href: '/', isPlaceholder: true },
      { id: 'auctions', label: 'Auctions', href: '/', badge: 'soon', isPlaceholder: true },
    ],
  },
  {
    id: 'account',
    title: 'Your Account',
    items: [
      { id: 'watchlist', label: 'Watchlist', href: '/profile/watchlist', count: 12 },
      { id: 'alerts', label: 'Alerts', href: '/', count: 4, isPlaceholder: true },
      { id: 'my-domains', label: 'My domains', href: '/profile/domains' },
      { id: 'seller-analytics', label: 'Seller analytics', href: '/profile/analytics' },
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
