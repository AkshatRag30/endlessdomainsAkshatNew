import React from 'react'
import { Chain } from '@/marketplace-preview/types/marketplace'
import styles from './ChainBadge.module.scss'

export interface ChainBadgeProps {
  chain: Chain
  className?: string
}

/**
 * Renders a colored dot instead of `chain.iconSrc` — the project has no real
 * chain logo assets yet (flagged in src/data/marketplace/domains.ts). Swap
 * this for an <img src={chain.iconSrc}> once those exist, the dot class per
 * chain.id below is the only thing that would need to go.
 */
export const ChainBadge = ({ chain, className = '' }: ChainBadgeProps) => {
  const shellClass = [styles.badge, className].filter(Boolean).join(' ')
  const dotClass = [styles.dot, styles[chain.id] ?? styles.default].filter(Boolean).join(' ')

  return (
    <span className={shellClass}>
      <span className={dotClass} aria-hidden="true" />
      {chain.label}
    </span>
  )
}

export default ChainBadge
