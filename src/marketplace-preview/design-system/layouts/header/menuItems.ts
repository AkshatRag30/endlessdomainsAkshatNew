export interface HeaderNavItem {
  label: string
  href: string
  /**
   * True when this item has no real destination yet. Per product direction
   * during the header redesign (Figma node 3:6449 shows Marketplace,
   * Portfolio, Sell, Resources, only Marketplace exists as a real page
   * today), these link to the homepage until their real pages are built.
   */
  isPlaceholder?: boolean
}

export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { label: 'Marketplace', href: '/' },
  { label: 'Portfolio', href: '/', isPlaceholder: true },
  { label: 'Sell', href: '/', isPlaceholder: true },
  { label: 'Resources', href: '/', isPlaceholder: true },
]
