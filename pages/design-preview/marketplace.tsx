import Header from '@/design-system/layouts/header'
import MarketplacePageShell from '@/design-system/composites/marketplace/shared/MarketplacePageShell'
import MarketplaceSidebar from '@/design-system/composites/marketplace/sidebar/MarketplaceSidebar'
import MobileDrawerMenu from '@/design-system/composites/marketplace/sidebar/MobileDrawerMenu'
import MarketplaceHero from '@/design-system/composites/marketplace/hero/MarketplaceHero'
import PromotedDomainsSection from '@/design-system/composites/marketplace/promoted/PromotedDomainsSection'
import ListingCategoryTabs from '@/design-system/composites/marketplace/listings/ListingCategoryTabs'
import ListingsHeading from '@/design-system/composites/marketplace/listings/ListingsHeading'
import ListingFilterBar from '@/design-system/composites/marketplace/listings/ListingFilterBar'
import LiveListingsTable from '@/design-system/composites/marketplace/listings/LiveListingsTable'
import LiveActivityPanel from '@/design-system/composites/marketplace/activity/LiveActivityPanel'
import LiveActivityTicker from '@/design-system/composites/marketplace/activity/LiveActivityTicker'
import MarketActivityPanel from '@/design-system/composites/marketplace/analytics/MarketActivityPanel'
import MobileBottomNav from '@/design-system/composites/marketplace/shared/MobileBottomNav'
import { useListingFilters, filterListings } from '@/hooks/marketplace/useListingFilters'
import { mockListings } from '@/data/marketplace/domains'
import { mockListingCategories } from '@/data/marketplace/categories'
import { useState } from 'react'
import shellStyles from '@/design-system/composites/marketplace/shared/MarketplacePageShell/MarketplacePageShell.module.scss'

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
    <div>
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
