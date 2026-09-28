import React from 'react'
import styles from './StatusChip.module.scss'

export type StatusChipVariant = 'for-sale' | 'neutral' | 'expired' | 'completed'

export interface StatusChipProps {
  variant: StatusChipVariant
  children: React.ReactNode
  className?: string
}

const VARIANT_CLASS: Record<StatusChipVariant, string> = {
  'for-sale': 'forSale',
  neutral: 'neutral',
  expired: 'expired',
  completed: 'completed',
}

/**
 * Figma node 80:7181 (the "Status" legend above the listings table) — a
 * solid gradient chip with a blended noise texture, not the light pill the
 * shared Badge primitive renders. The same exact chip (down to the noise
 * asset) also backs MyDomainCard's own per-card status indicator (Figma
 * node 60:13505), so this is a dedicated primitive rather than a new Badge
 * variant — Badge is also used by MarketActivityPanel/MarketMetricCard for
 * an unrelated percent-change indicator that must keep its own light look.
 * "For sale" and "expired" each get their own color; every other domain
 * status (not listed, sold, expiring soon) still shares the neutral
 * dark-gray gradient, since Figma only ever specified two treatments and
 * "expired" is the one deliberate addition on top of that. "completed" is
 * the order receipt's glowing green pill (Figma 5:7458).
 */
export const StatusChip = ({ variant, children, className = '' }: StatusChipProps) => {
  const shellClass = [styles.chip, styles[VARIANT_CLASS[variant]], className].filter(Boolean).join(' ')

  return <span className={shellClass}>{children}</span>
}

export default StatusChip
