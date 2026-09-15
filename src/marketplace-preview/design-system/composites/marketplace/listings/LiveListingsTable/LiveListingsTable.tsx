import React, { useState } from 'react'
import type { MarketplaceListing } from '@/marketplace-preview/types/marketplace'
import DefaultButton from '@/marketplace-preview/design-system/primitives/buttons/default-buttons'
import ListingRow, { ListingDomainCell, ListingRestCells } from '../ListingRow'
import styles from './LiveListingsTable.module.scss'

export interface LiveListingsTableProps {
  listings: MarketplaceListing[]
  /** How many rows a "Show N more" click reveals — 14 matches the reference design's initial page. */
  pageSize?: number
}

/**
 * Figma node 1:1087 (header) + 1:1149 (row). Pagination is a plain
 * reveal-more over the given array — no API call. favorited state lives
 * here (not in ListingRow) since mobile renders each listing's cells split
 * across two separate panes (see .mobileSplit in the stylesheet) — both
 * need to agree on which listings are favorited regardless of which
 * layout is currently visible.
 */
export const LiveListingsTable = ({ listings, pageSize = 14 }: LiveListingsTableProps) => {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(() => new Set(listings.filter((l) => l.isFavorited).map((l) => l.id)))
  const visible = listings.slice(0, visibleCount)
  const remaining = listings.length - visible.length

  const toggleFavorite = (id: string) => {
    setFavoritedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className={styles.wrap} role="table" aria-label="Live listings">
      {visible.length === 0 ? (
        <p className={styles.empty}>No domains match these filters.</p>
      ) : (
        <>
          <div className={styles.scrollWrap}>
            <div className={styles.header} role="row">
              <span role="columnheader">Domain Name</span>
              <span role="columnheader">Price</span>
              <span role="columnheader">Appraised Value</span>
              <span role="columnheader">Chain</span>
              <span role="columnheader">Action</span>
            </div>

            <div className={styles.rows} role="rowgroup">
              {visible.map((listing) => (
                <ListingRow
                  key={listing.id}
                  listing={listing}
                  favorited={favoritedIds.has(listing.id)}
                  onToggleFavorite={() => toggleFavorite(listing.id)}
                />
              ))}
            </div>
          </div>

          <div className={styles.mobileSplit} role="table" aria-label="Live listings">
            <div className={styles.domainPane} role="rowgroup">
              <div className={styles.domainPaneHeader} role="columnheader">
                Domain Name
              </div>
              {visible.map((listing) => (
                <div key={listing.id} className={styles.domainPaneRow} role="row">
                  <ListingDomainCell listing={listing} />
                </div>
              ))}
            </div>

            <div className={styles.scrollPane}>
              <div className={styles.scrollPaneInner}>
                <div className={styles.restHeader} role="row">
                  <span role="columnheader">Price</span>
                  <span role="columnheader">Appraised Value</span>
                  <span role="columnheader">Chain</span>
                  <span role="columnheader">Action</span>
                </div>

                <div className={styles.restRows} role="rowgroup">
                  {visible.map((listing) => (
                    <div key={listing.id} className={styles.restRow} role="row">
                      <ListingRestCells listing={listing} favorited={favoritedIds.has(listing.id)} onToggleFavorite={() => toggleFavorite(listing.id)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

export default LiveListingsTable
