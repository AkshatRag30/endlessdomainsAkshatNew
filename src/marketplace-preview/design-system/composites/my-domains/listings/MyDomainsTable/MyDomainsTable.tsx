import React, { useState } from 'react'
import { useIsMobile } from '@/marketplace-preview/stubs/useIsMobile'
import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'
import StatusChip from '@/marketplace-preview/design-system/primitives/badges/status-chip'
import DefaultButton from '@/marketplace-preview/design-system/primitives/buttons/default-buttons'
import type { ViewMode } from '@/marketplace-preview/design-system/primitives/toggles/view-toggle'
import MyDomainRow from '../MyDomainRow'
import MyDomainCard from '../MyDomainCard'
import styles from './MyDomainsTable.module.scss'

export interface MyDomainsTableProps {
  domains: MyDomainListing[]
  viewMode: ViewMode
  /** How many rows/cards a "Show N more" click reveals. */
  pageSize?: number
  onList?: (domain: MyDomainListing) => void
  onEditPrice?: (domain: MyDomainListing) => void
}

/**
 * Figma node 375:51245 (list) / 375:51247 (grid) — same "Status" legend and
 * the same underlying domain data in both, just MyDomainRow vs MyDomainCard
 * below it. Plain reveal-more over the given array — no API call, same
 * pattern as the marketplace redesign's LiveListingsTable.
 *
 * Figma node 77:3743 (small mobile/mobile responsive frame) has no list
 * layout at all — every domain renders as a MyDomainCard, one per row, and
 * the Status legend above the list is dropped entirely (each card already
 * carries its own status badge). MyDomainRow's own mobile fallback predates
 * that reference and was always a placeholder — see its file comment. This
 * mobile cutoff always forces grid, full stop.
 *
 * A second, narrower range also forces grid: 1040–1279px. That's not
 * "tablet" in this codebase's own vocabulary ($breakpoint-tablet is 1040,
 * same as $breakpoint-desktop) — it's the width where MarketplacePageShell
 * activates its rail-narrowed 2-column desktop grid (see that file's .grid
 * comment) but still doesn't leave "main" enough room for MyDomainRow's own
 * six column floors, a MacBook Air 13" browser window commonly lands right
 * in it. True tablet widths (768–1039px, including an iPad 13" in
 * portrait) don't have this problem at all — MarketplacePageShell collapses
 * to a single full-width column there instead, so "main" gets nearly the
 * whole viewport and the row grid fits comfortably — so table and card view
 * are both freely selectable there via ViewToggle, same as at 1280px and
 * up. A horizontal scrollbar on the table was tried for the 1040–1279 case
 * instead of forcing grid and reverted, since forcing card there reads as
 * the intended design rather than a workaround.
 */
export const MyDomainsTable = ({ domains, viewMode, pageSize = 14, onList, onEditPrice }: MyDomainsTableProps) => {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const isMobileWidth = useIsMobile(767) // < 768px — always forces grid (Figma's own mobile frame)
  const isBelowLaptop = useIsMobile(1279) // <= 1279px
  const isBelowTablet = useIsMobile(1039) // <= 1039px — true tablet ends here
  // 1040–1279px only: below true tablet's own top end, but still short of
  // 1280px — see the comment above for why this specific range is the one
  // that can't fit row view.
  const isLaptopNarrow = isBelowLaptop && !isBelowTablet
  const effectiveViewMode = isMobileWidth || isLaptopNarrow ? 'grid' : viewMode
  const visible = domains.slice(0, visibleCount)
  const remaining = domains.length - visible.length

  return (
    <div className={styles.wrap} role="table" aria-label="My domains">
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Status</span>
        <StatusChip variant="neutral">Not Listed</StatusChip>
        <StatusChip variant="for-sale">For sale</StatusChip>
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>No domains match these filters.</p>
      ) : effectiveViewMode === 'grid' ? (
        <div className={styles.grid}>
          {visible.map((domain) => (
            <MyDomainCard key={domain.id} domain={domain} onList={onList} onEditPrice={onEditPrice} />
          ))}
        </div>
      ) : (
        <>
          <div className={styles.header} role="row">
            <span role="columnheader">Domain Name</span>
            <span role="columnheader">Price</span>
            <span role="columnheader">Renewal</span>
            <span role="columnheader">Interest</span>
            <span role="columnheader">EST. value</span>
            <span role="columnheader">Action</span>
          </div>

          <div className={styles.rows} role="rowgroup">
            {visible.map((domain) => (
              <MyDomainRow key={domain.id} domain={domain} onList={onList} onEditPrice={onEditPrice} />
            ))}
          </div>
        </>
      )}

      {remaining > 0 && (
        <div className={styles.showMore}>
          <DefaultButton onClick={() => setVisibleCount((prev) => prev + pageSize)}>
            Show {Math.min(remaining, pageSize)} more
          </DefaultButton>
        </div>
      )}
    </div>
  )
}

export default MyDomainsTable
