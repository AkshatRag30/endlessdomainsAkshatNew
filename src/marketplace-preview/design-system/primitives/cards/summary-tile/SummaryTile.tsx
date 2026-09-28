import React from 'react'
import styles from './SummaryTile.module.scss'

export interface SummaryTileProps {
  label: string
  /** The value line. Plain text or a row of icon + text pieces; it inherits the tile's value typography. */
  children: React.ReactNode
  className?: string
}

/**
 * Figma node 5:3647 (domain overview summary tiles). The same grey gradient
 * surface with a white border and a light outer ring is reused by the order
 * receipt's "What next" tiles (plan §5.1). StatCard doesn't fit: it takes a
 * string value plus a required sublabel on coloured gradients.
 */
export const SummaryTile = ({ label, children, className = '' }: SummaryTileProps) => (
  <div className={[styles.tile, className].filter(Boolean).join(' ')}>
    <span className={styles.label}>{label}</span>
    <div className={styles.value}>{children}</div>
  </div>
)

export default SummaryTile
