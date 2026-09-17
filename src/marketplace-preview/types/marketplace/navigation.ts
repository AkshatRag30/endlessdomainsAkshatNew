export interface SidebarNavItem {
  id: string
  label: string
  href: string
  count?: number
  badge?: string // e.g. 'soon'
  /** True when href has no real destination yet — points at '/' until built, same convention as the header's menuItems.ts. */
  isPlaceholder?: boolean
  /** Figma node 70:4592 — per-row leading icon, shown whether or not the row is active. Optional: a handful of items (Recently sold, Under estimate, Price drops, Alerts) have no matching icon in that reference and fall back to no icon rather than a guessed one. */
  icon?: string
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
