import type { IconType } from 'react-icons'

export interface SidebarNavItem {
  id: string
  label: string
  href: string
  count?: number
  badge?: string // e.g. 'soon'
  /** True when href has no real destination yet — points at '/' until built, same convention as the header's menuItems.ts. */
  isPlaceholder?: boolean
  /**
   * True when this row needs a signed-in session — while signed out it
   * renders muted and routes to /login instead of its real href, matching
   * the account-gated destinations (My domains, Analytics, Payouts,
   * Promotions) rather than a build-status flag like isPlaceholder.
   */
  requiresAuth?: boolean
  /**
   * Figma node 70:4592 — per-row leading icon, shown whether or not the row
   * is active. Optional: a handful of items (Recently sold, Under estimate,
   * Price drops, Alerts) have no matching icon in that reference and fall
   * back to no icon rather than a guessed one. A react-icons component for
   * the rows a simple generic icon exists for (heart, user, gear, ...); a
   * public/ asset path for the ones that don't (Extensions' sparkle-burst
   * mark, Payouts' composite wallet+dollar glyph, and the raster
   * auctions/promotions icons) — see this file's own header comment for the
   * full breakdown.
   */
  icon?: string | IconType
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
