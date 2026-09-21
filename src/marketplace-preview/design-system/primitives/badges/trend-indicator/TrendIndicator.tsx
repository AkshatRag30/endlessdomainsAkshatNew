import React from 'react'
import Image from 'next/image'
import styles from './TrendIndicator.module.scss'

export interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'neutral'
  label: string // e.g. 'High', '40%'
  className?: string
}

// Real exported Figma assets (node 1:1034's appraisal trend arrows) —
// 'neutral' has no Figma precedent, falls back to the up arrow, rotated flat.
const ARROW_SRC: Record<TrendIndicatorProps['direction'], string> = {
  up: '/assets/img/marketplace/trend-up.svg',
  down: '/assets/img/marketplace/trend-down.svg',
  neutral: '/assets/img/marketplace/trend-up.svg',
}

export const TrendIndicator = ({ direction, label, className = '' }: TrendIndicatorProps) => {
  const shellClass = [styles.trend, styles[direction], className].filter(Boolean).join(' ')

  return (
    <span className={shellClass}>
      {label}
      <Image src={ARROW_SRC[direction]} alt="" aria-hidden="true" width={9} height={7} className={styles.arrow} />
    </span>
  )
}

export default TrendIndicator
