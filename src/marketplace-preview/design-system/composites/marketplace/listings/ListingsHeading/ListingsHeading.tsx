import React from 'react'
import styles from './ListingsHeading.module.scss'

export interface ListingsHeadingProps {
  count: number
}

/**
 * Sits directly above ListingFilterBar's search/filter row in every
 * breakpoint of the reference design — present in the Figma file but not
 * wired up when the filter bar and table were first built. `count` is the
 * currently filtered listings total (not a fixed constant), so it stays
 * accurate as filters narrow the results instead of only ever matching the
 * unfiltered mock set.
 */
export const ListingsHeading = ({ count }: ListingsHeadingProps) => (
  <div className={styles.row}>
    <span className={styles.title}>Live Listings</span>
    <span className={styles.count}>{count} domains</span>
  </div>
)

export default ListingsHeading
