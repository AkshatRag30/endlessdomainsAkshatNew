// Curated barrel, mirrors the main site's composites/<domain>/index.ts
// convention — re-exports a hand picked subset, not everything in the
// folder. Grows as each phase in the implementation plan adds composites.

export { MarketplacePageShell } from './shared/MarketplacePageShell'
export type { MarketplacePageShellProps } from './shared/MarketplacePageShell'

export { MarketplaceSidebar } from './sidebar/MarketplaceSidebar'
export { MobileDrawerMenu } from './sidebar/MobileDrawerMenu'

export { MarketplaceHero } from './hero/MarketplaceHero'
export { PromotedDomainsSection } from './promoted/PromotedDomainsSection'
export { PromotedDomainCard } from './promoted/PromotedDomainCard'
export type { PromotedDomainCardProps } from './promoted/PromotedDomainCard'

export { ListingCategoryTabs } from './listings/ListingCategoryTabs'
export { ListingFilterBar } from './listings/ListingFilterBar'
export { LiveListingsTable } from './listings/LiveListingsTable'
export { ListingRow } from './listings/ListingRow'

export { LiveActivityPanel } from './activity/LiveActivityPanel'
export { ActivityItem } from './activity/ActivityItem'
export { LiveActivityTicker } from './activity/LiveActivityTicker'

export { MarketActivityPanel } from './analytics/MarketActivityPanel'
export { MarketMetricCard } from './analytics/MarketMetricCard'

export { MobileBottomNav } from './shared/MobileBottomNav'
