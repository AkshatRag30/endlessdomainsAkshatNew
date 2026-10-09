import React from 'react'
import styles from './ListingsHeading.module.scss'

export interface ListingsHeadingProps {
  count: number
  /** Defaults to "Live Listings". The watchlist passes "Your watchlist" (watchlist plan Q1). */
  title?: string
  /** Replaces the default "{count} domains" text, e.g. the watchlist's "1 name" / "12 names". */
  countLabel?: string
}

/**
 * Sits directly above ListingFilterBar's search/filter row in every
 * breakpoint of the reference design — present in the Figma file but not
 * wired up when the filter bar and table were first built. `count` is the
 * currently filtered listings total (not a fixed constant), so it stays
 * accurate as filters narrow the results instead of only ever matching the
 * unfiltered mock set.
 */
export const ListingsHeading = ({ count, title = 'Live Listings', countLabel }: ListingsHeadingProps) => (
  <div className={styles.row}>
    <span className={styles.title}>{title}</span>
    <span className={styles.count}>{countLabel ?? `${count} domains`}</span>
  </div>
)

export default ListingsHeading
