import React from 'react'
import styles from './LoadingStep.module.scss'

// Figma node 1:8442 — 5 skeleton rows standing in for the domain header,
// how-to-sell toggle, price input, domain insights card, and duration
// toggle while the modal's own data "loads". Fixed, finite set of 5 blocks
// (not runtime-computed), so each gets its own nth-child rule in SCSS
// rather than an inline height per this subtree's CLAUDE.md §4 rule.
const SKELETON_COUNT = 5

/** Shown first on every entry point, for a fixed short delay, before ListingFlowModal auto-advances to the real form. */
export const LoadingStep = () => (
  <div className={styles.wrap} aria-hidden="true">
    {Array.from({ length: SKELETON_COUNT }, (_, index) => (
      <div key={index} className={styles.row} />
    ))}
  </div>
)

export default LoadingStep
