import React, { useState } from 'react'
import type { MarketplaceListing } from '@/marketplace-preview/types/marketplace'
import DefaultButton from '@/marketplace-preview/design-system/primitives/buttons/default-buttons'
import PromotedDomainCard from '../../promoted/PromotedDomainCard'
import ListingRow from '../ListingRow'
import styles from './LiveListingsTable.module.scss'

export interface LiveListingsTableProps {
  listings: MarketplaceListing[]
  /** How many rows a "Show N more" click reveals — 14 matches the reference design's initial page. */
  pageSize?: number
}

/**
 * Figma node 1:1087 (header) + 1:1149 (row). Pagination is a plain
 * reveal-more over the given array — no API call. favorited state lives
 * here (not in ListingRow) since mobile renders the same listings as a
 * separate card list (see .cardList in the stylesheet, reusing
 * PromotedDomainCard) — both need to agree on which listings are
 * favorited regardless of which layout is currently visible.
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

          <div className={styles.cardList} role="table" aria-label="Live listings">
            {visible.map((listing) => (
              <PromotedDomainCard
                key={listing.id}
                listing={listing}
                fullWidth
                favorited={favoritedIds.has(listing.id)}
                onToggleFavorite={() => toggleFavorite(listing.id)}
              />
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

export default LiveListingsTable
