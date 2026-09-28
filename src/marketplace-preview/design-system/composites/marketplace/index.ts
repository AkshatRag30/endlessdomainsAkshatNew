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

export { default as BuyFlowModal } from './buying-flow/BuyFlowModal'
export type { BuyFlowModalProps } from './buying-flow/BuyFlowModal'

export { default as DomainOverviewShell } from './domain-overview/DomainOverviewShell'
export type { DomainOverviewShellProps } from './domain-overview/DomainOverviewShell'
export { default as DomainHeroCard } from './domain-overview/DomainHeroCard'
export type { DomainHeroCardProps } from './domain-overview/DomainHeroCard'
export { default as DomainSummaryTiles } from './domain-overview/DomainSummaryTiles'
export type { DomainSummaryTilesProps } from './domain-overview/DomainSummaryTiles'
export { default as DomainOverviewTabs } from './domain-overview/DomainOverviewTabs'
export type { DomainOverviewTabsProps } from './domain-overview/DomainOverviewTabs'
export { default as NameFactsCard } from './domain-overview/NameFactsCard'
export type { NameFactsCardProps } from './domain-overview/NameFactsCard'
export { default as SellerCard } from './domain-overview/SellerCard'
export type { SellerCardProps } from './domain-overview/SellerCard'
export { default as InterestCard } from './domain-overview/InterestCard'
export type { InterestCardProps } from './domain-overview/InterestCard'
export { default as DomainActivityCard } from './domain-overview/DomainActivityCard'
export type { DomainActivityCardProps } from './domain-overview/DomainActivityCard'
export { default as PriceHistoryPanel } from './domain-overview/PriceHistoryPanel'
export type { PriceHistoryPanelProps } from './domain-overview/PriceHistoryPanel'
export { default as ComparableSalesPanel } from './domain-overview/ComparableSalesPanel'
export type { ComparableSalesPanelProps } from './domain-overview/ComparableSalesPanel'
export { default as OrderHeaderCard } from './domain-overview/OrderHeaderCard'
export type { OrderHeaderCardProps } from './domain-overview/OrderHeaderCard'
export { default as OrderReceiptCard } from './domain-overview/OrderReceiptCard'
export type { OrderReceiptCardProps } from './domain-overview/OrderReceiptCard'
export { default as OrderTimelineCard } from './domain-overview/OrderTimelineCard'
export type { OrderTimelineCardProps } from './domain-overview/OrderTimelineCard'
export { default as OrderNextStepsCard } from './domain-overview/OrderNextStepsCard'
export type { OrderNextStepsCardProps } from './domain-overview/OrderNextStepsCard'
export { default as DomainPriceHeader } from './shared/DomainPriceHeader'
export type { DomainPriceHeaderProps } from './shared/DomainPriceHeader'
