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
 * Marketplace redesign preview, copied over from the design-preview build in
 * the marketplace-v2 project (composites, primitives, styles, data, and
 * assets all live under src/marketplace-preview/ so nothing here can collide
 * with this project's own design-system). Not linked from anywhere in the
 * app — safe to delete.
 *
 * This project has no real auth/cookie backend yet, so useAuth() always
 * reports a logged-out visitor (see src/marketplace-preview/stubs/auth.ts).
 * Right rail composition still matches the source project's Phase 8 state.
 */
export default function MarketplacePreview() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const { filters, debouncedSearch, setFilter } = useListingFilters()
  const filtered = filterListings(mockListings, debouncedSearch, filters)

  return (
    // data-marketplace-preview is what scopes this whole page's tokens
    // (src/marketplace-preview/design-system/styles/tokens.scss) — without
    // it, every var(--space-4)-style custom property below resolves to
    // nothing, since those custom properties are deliberately declared under
    // [data-marketplace-preview] rather than bare :root.
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
