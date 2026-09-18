import Header from '@/marketplace-preview/design-system/layouts/header'
import MarketplacePageShell from '@/marketplace-preview/design-system/composites/marketplace/shared/MarketplacePageShell'
import MarketplaceSidebar from '@/marketplace-preview/design-system/composites/marketplace/sidebar/MarketplaceSidebar'
import MobileDrawerMenu from '@/marketplace-preview/design-system/composites/marketplace/sidebar/MobileDrawerMenu'
import MarketplaceHero from '@/marketplace-preview/design-system/composites/marketplace/hero/MarketplaceHero'
import PromotedDomainsSection from '@/marketplace-preview/design-system/composites/marketplace/promoted/PromotedDomainsSection'
import ListingCategoryTabs from '@/marketplace-preview/design-system/composites/marketplace/listings/ListingCategoryTabs'
import ListingsHeading from '@/marketplace-preview/design-system/composites/marketplace/listings/ListingsHeading'
import ListingFilterBar from '@/marketplace-preview/design-system/composites/marketplace/listings/ListingFilterBar'
import LiveListingsTable from '@/marketplace-preview/design-system/composites/marketplace/listings/LiveListingsTable'
import LiveActivityPanel from '@/marketplace-preview/design-system/composites/marketplace/activity/LiveActivityPanel'
import LiveActivityTicker from '@/marketplace-preview/design-system/composites/marketplace/activity/LiveActivityTicker'
import MarketActivityPanel from '@/marketplace-preview/design-system/composites/marketplace/analytics/MarketActivityPanel'
import MobileBottomNav from '@/marketplace-preview/design-system/composites/marketplace/shared/MobileBottomNav'
import { useListingFilters, filterListings } from '@/marketplace-preview/hooks/marketplace/useListingFilters'
import { mockListings } from '@/marketplace-preview/data/marketplace/domains'
import { mockListingCategories } from '@/marketplace-preview/data/marketplace/categories'
import { useState } from 'react'
import shellStyles from '@/marketplace-preview/design-system/composites/marketplace/shared/MarketplacePageShell/MarketplacePageShell.module.scss'

/**
 * Temporary preview route assembling everything built through Phase 8 —
 * not linked from anywhere in the app, safe to delete once reviewed. Right
 * rail is still empty (Phase 9/10 not built yet).
 */
export default function MarketplacePreview() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const { filters, debouncedSearch, setFilter } = useListingFilters()
  const filtered = filterListings(mockListings, debouncedSearch, filters)

  return (
    <div data-marketplace-preview>
      <Header onMenuClick={() => setMenuOpen((prev) => !prev)} menuOpen={menuOpen} previewMode />
      <LiveActivityTicker />
      <MarketplacePageShell
        sidebar={
          <>
            <MarketplaceSidebar previewMode />
            <MobileDrawerMenu onClose={() => setMenuOpen(false)} previewMode />
          </>
        }
        hero={<MarketplaceHero />}
        sidebarOpen={menuOpen}
        onCloseSidebar={() => setMenuOpen(false)}
        rightRail={
          <div className={shellStyles.railGroup}>
            <LiveActivityPanel />
            <MarketActivityPanel />
          </div>
        }
      >
        <div className={shellStyles.mainStack}>
          <div className={shellStyles.promotedSlot}>
            <PromotedDomainsSection />
          </div>
          <div className={shellStyles.listingsSlot}>
            <ListingCategoryTabs categories={mockListingCategories} activeId={activeCategory} onChange={setActiveCategory} />
            <ListingsHeading count={filtered.length} />
            <ListingFilterBar filters={filters} onFilterChange={setFilter} />
            <LiveListingsTable listings={filtered} pageSize={14} />
          </div>
        </div>
      </MarketplacePageShell>
      <MobileBottomNav />
    </div>
  )
}
