import React, { useState } from 'react'
import type { MyDomainListing } from '@/types/my-domains'
import Badge from '@/design-system/primitives/badges/badge'
import DefaultButton from '@/design-system/primitives/buttons/default-buttons'
import type { ViewMode } from '@/design-system/primitives/toggles/view-toggle'
import MyDomainRow from '../MyDomainRow'
import MyDomainCard from '../MyDomainCard'
import styles from './MyDomainsTable.module.scss'

export interface MyDomainsTableProps {
  domains: MyDomainListing[]
  viewMode: ViewMode
  /** How many rows/cards a "Show N more" click reveals. */
  pageSize?: number
}

/**
 * Figma node 375:51245 (list) / 375:51247 (grid) — same "Status" legend and
 * the same underlying domain data in both, just MyDomainRow vs MyDomainCard
 * below it. Plain reveal-more over the given array — no API call, same
 * pattern as the marketplace redesign's LiveListingsTable.
 */
export const MyDomainsTable = ({ domains, viewMode, pageSize = 14 }: MyDomainsTableProps) => {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const visible = domains.slice(0, visibleCount)
  const remaining = domains.length - visible.length

  return (
    <div className={styles.wrap} role="table" aria-label="My domains">
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Status</span>
        <Badge variant="neutral">Not Listed</Badge>
        <Badge variant="success">For sale</Badge>
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>No domains match these filters.</p>
      ) : viewMode === 'grid' ? (
        <div className={styles.grid}>
          {visible.map((domain) => (
            <MyDomainCard key={domain.id} domain={domain} />
          ))}
        </div>
      ) : (
        <>
          <div className={styles.header} role="row">
            <span role="columnheader">Domain Name</span>
            <span role="columnheader">Price</span>
            <span role="columnheader">EST. value</span>
            <span role="columnheader">Interest</span>
            <span role="columnheader">Renewal</span>
            <span role="columnheader">Action</span>
          </div>

          <div className={styles.rows} role="rowgroup">
            {visible.map((domain) => (
              <MyDomainRow key={domain.id} domain={domain} />
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
