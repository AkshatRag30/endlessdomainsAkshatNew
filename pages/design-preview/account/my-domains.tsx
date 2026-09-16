import { useState } from 'react'
import Header from '@/marketplace-preview/design-system/layouts/header'
import MarketplacePageShell from '@/marketplace-preview/design-system/composites/marketplace/shared/MarketplacePageShell'
import MarketplaceSidebar from '@/marketplace-preview/design-system/composites/marketplace/sidebar/MarketplaceSidebar'
import MobileDrawerMenu from '@/marketplace-preview/design-system/composites/marketplace/sidebar/MobileDrawerMenu'
import ListingsHeading from '@/marketplace-preview/design-system/composites/marketplace/listings/ListingsHeading'
import {
  MyDomainsHeroBanner,
  PortfolioStatsRow,
  MyDomainsCategoryTabs,
  MyDomainsFilterBar,
  MyDomainsTable,
  NeedsAttentionPanel,
  MostViewedPanel,
  QuickActionsPanel,
} from '@/marketplace-preview/design-system/composites/my-domains'
import type { MyDomainsStatusFilter } from '@/marketplace-preview/design-system/composites/my-domains'
import type { ViewMode } from '@/marketplace-preview/design-system/primitives/toggles/view-toggle'
import { mockMyDomainsSummary, mockNeedsAttention, mockMostViewed } from '@/marketplace-preview/data/my-domains/domains'
import { useMyDomainsFilters, filterMyDomains } from '@/marketplace-preview/hooks/my-domains/useMyDomainsFilters'
import styles from './my-domains.module.scss'

/**
 * My Domains dashboard preview, copied over from the design-preview build in
 * the marketplace-v2 project — see marketplace.tsx in this same folder for
 * the shared composites/primitives/styles it reuses from
 * src/marketplace-preview/. Not linked from anywhere in the app — safe to
 * delete. See that project's my-domains-redesign-plan.html for the full
 * plan; this page covers phases 05-09 (stat cards through the right rail).
 *
 * Every action button (List, Edit Price, Bulk List, Appraise, Transfer) is
 * intentionally inert — none of these are wired to real modals or on-chain
 * calls yet. MobileBottomNav is deliberately omitted here for the same
 * reason as the source project: it hardcodes "Explore" as the only active
 * tab and has no "My Domains" destination.
 */
export default function MyDomainsPreview() {
  const [activeStatus, setActiveStatus] = useState<MyDomainsStatusFilter>('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const { filters, debouncedSearch, setFilter } = useMyDomainsFilters()

  const summary = mockMyDomainsSummary
  const filtered = filterMyDomains(summary.domains, activeStatus, debouncedSearch, filters)

  return (
    // Same scoping requirement as marketplace.tsx — see that file's comment.
    <div data-marketplace-preview>
      <Header onMenuClick={() => setMenuOpen((prev) => !prev)} menuOpen={menuOpen} previewMode />
      <MarketplacePageShell
        sidebar={
          <>
            {/* 'my-domains' starts selected here since this preview's own URL
                (/design-preview/account/my-domains) doesn't match the real
                route MarketplaceSidebar's pathname check looks for
                (/profile/domains) — see the Phase 04 checkpoint on where
                this page ultimately lives. */}
            <MarketplaceSidebar previewMode initialSelectedId="my-domains" />
            <MobileDrawerMenu onClose={() => setMenuOpen(false)} previewMode />
          </>
        }
        hero={<MyDomainsHeroBanner />}
        sidebarOpen={menuOpen}
        onCloseSidebar={() => setMenuOpen(false)}
        rightRail={
          <div className={styles.rightRailStack}>
            <PortfolioStatsRow summary={summary} />
            <NeedsAttentionPanel domains={mockNeedsAttention} />
            <MostViewedPanel domains={mockMostViewed} />
            <QuickActionsPanel />
          </div>
        }
      >
        <div className={styles.mainStack}>
          <MyDomainsCategoryTabs statusCounts={summary.statusCounts} activeId={activeStatus} onChange={setActiveStatus} />
          <ListingsHeading count={filtered.length} />
          <MyDomainsFilterBar filters={filters} onFilterChange={setFilter} viewMode={viewMode} onViewModeChange={setViewMode} />
          <MyDomainsTable domains={filtered} viewMode={viewMode} pageSize={14} />
        </div>
      </MarketplacePageShell>
    </div>
  )
}
