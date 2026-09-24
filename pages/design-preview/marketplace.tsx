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
import { BuyFlowModal } from '@/marketplace-preview/design-system/composites/marketplace'
import type { MarketplaceListing } from '@/marketplace-preview/types/marketplace'
import { useListingFilters, filterListings } from '@/marketplace-preview/hooks/marketplace/useListingFilters'
import { mockListings, setMockWalletUsdtAllowance } from '@/marketplace-preview/data/marketplace/domains'
import { mockListingCategories } from '@/marketplace-preview/data/marketplace/categories'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import shellStyles from '@/marketplace-preview/design-system/composites/marketplace/shared/MarketplacePageShell/MarketplacePageShell.module.scss'

/**
 * Temporary preview route assembling everything built through Phase 8 —
 * not linked from anywhere in the app, safe to delete once reviewed. Right
 * rail is still empty (Phase 9/10 not built yet).
 */
export default function MarketplacePreview() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)
  // Kept (not cleared) on close so the drawer's slide-out animation still
  // has a listing to render; isOpen alone drives visibility.
  const [buyModal, setBuyModal] = useState<{ isOpen: boolean; listing: MarketplaceListing } | null>(null)
  const openBuyModal = (listing: MarketplaceListing) => setBuyModal({ isOpen: true, listing })

  // The listings table's watchlist (its hearts), lifted here so the buy
  // drawer's "Watch this name" adds to the same list.
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(() => new Set(mockListings.filter((l) => l.isFavorited).map((l) => l.id)))
  const toggleFavorite = (id: string) =>
    setFavoritedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const watchListing = (listing: MarketplaceListing) => setFavoritedIds((prev) => new Set(prev).add(listing.id))

  // Preview-only QA switch (buying-flow plan §9): ?usdtAllowance=20000 seeds
  // the mock wallet's USDT allowance on load, so the already-approved
  // "normal purchase" path (Figma 1:101) is reachable by hand. Without it the
  // mock starts at 0, and every purchase consumes its own exact approval,
  // so that path never comes up on its own.
  const router = useRouter()
  useEffect(() => {
    if (!router.isReady) return
    const seeded = Number(router.query.usdtAllowance)
    if (Number.isFinite(seeded) && seeded > 0) setMockWalletUsdtAllowance(seeded)
  }, [router.isReady, router.query.usdtAllowance])
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
            <PromotedDomainsSection onBuyNow={openBuyModal} />
          </div>
          <div className={shellStyles.listingsSlot}>
            <ListingCategoryTabs categories={mockListingCategories} activeId={activeCategory} onChange={setActiveCategory} />
            <ListingsHeading count={filtered.length} />
            <ListingFilterBar filters={filters} onFilterChange={setFilter} />
            <LiveListingsTable
              listings={filtered}
              pageSize={14}
              onBuyNow={openBuyModal}
              favoritedIds={favoritedIds}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </div>
      </MarketplacePageShell>
      <MobileBottomNav />

      {buyModal && (
        <BuyFlowModal
          isOpen={buyModal.isOpen}
          listing={buyModal.listing}
          onWatch={watchListing}
          onClose={() => setBuyModal((prev) => (prev ? { ...prev, isOpen: false } : prev))}
        />
      )}
    </div>
  )
}
