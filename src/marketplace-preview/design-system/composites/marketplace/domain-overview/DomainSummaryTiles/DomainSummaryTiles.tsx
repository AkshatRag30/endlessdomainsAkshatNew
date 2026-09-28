import React from 'react'
import Image from 'next/image'
import type { DomainOverview } from '@/marketplace-preview/types/marketplace'
import SummaryTile from '@/marketplace-preview/design-system/primitives/cards/summary-tile'
import { formatDate, formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './DomainSummaryTiles.module.scss'

export interface DomainSummaryTilesProps {
  overview: DomainOverview
  /** Whether the current viewer is watching this name — adds their own heart to the "saved" count. */
  viewerWatching: boolean
}

// Not in Figma: a value with nothing to show (not listed, no estimate).
const EMPTY = '—'

/**
 * Figma node 5:3646 (desktop) / 5:4261 (mobile). Model estimate, 7 day
 * interest, seller and listing expiry.
 */
export const DomainSummaryTiles = ({ overview, viewerWatching }: DomainSummaryTilesProps) => {
  const { facts, interest, seller, expiresAt } = overview
  const saved = interest.saved + (viewerWatching ? 1 : 0)

  return (
    <div className={styles.grid}>
      <SummaryTile label="Model estimate">
        {facts.modelEstimateUsd !== null ? formatToken(facts.modelEstimateUsd) : EMPTY}
      </SummaryTile>

      <SummaryTile label="Interest, 7 days">
        <span className={styles.stat}>
          <Image src="/assets/img/domain-overview/eye.svg" alt="" aria-hidden="true" width={15} height={15} className={styles.eyeIcon} />
          {interest.views7d.value} views
        </span>
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.stat}>
          {/* Figma's 13px box with the 9.5×11.1 glyph inset inside it (5:3662). */}
          <span className={styles.bookmarkBox}>
            <Image src="/assets/img/domain-overview/bookmark.svg" alt="" aria-hidden="true" width={9.5} height={11.1} className={styles.bookmarkIcon} />
          </span>
          {saved} saved
        </span>
      </SummaryTile>

      <SummaryTile label="Seller">{seller ? seller.displayAddress : EMPTY}</SummaryTile>

      <SummaryTile label="Listing expires">
        {expiresAt ? (
          <span className={styles.stat}>
            {/* 17×18.3 box, 13.3×15.2 glyph inset (5:3674). */}
            <span className={styles.calendarBox}>
              <Image src="/assets/img/domain-overview/calendar.svg" alt="" aria-hidden="true" width={13.3} height={15.2} className={styles.calendarIcon} />
            </span>
            {formatDate(expiresAt)}
          </span>
        ) : (
          EMPTY
        )}
      </SummaryTile>
    </div>
  )
}

export default DomainSummaryTiles
