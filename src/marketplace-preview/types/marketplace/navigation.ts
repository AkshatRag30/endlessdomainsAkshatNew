export interface SidebarNavItem {
  id: string
  label: string
  href: string
  count?: number
  badge?: string // e.g. 'soon'
  /** True when href has no real destination yet — points at '/' until built, same convention as the header's menuItems.ts. */
  isPlaceholder?: boolean
}

export interface SidebarSection {
  id: string
  title: string // e.g. 'Browse', 'Your Account'
  items: SidebarNavItem[]
}

export interface ListingCategory {
  id: string
  label: string
  count: number
}

export interface HeroCategoryChip {
  id: string
  label: string
  position: { top: string; left?: string; right?: string }
}
