import type { ReactNode } from 'react'
import styles from './TierBadge.module.scss'

export type TierBadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum'

interface TierBadgeProps {
  tier: TierBadgeTier
  /** sm = 25px card-row badge · md = 31px header / score badge (default) */
  size?: 'sm' | 'md'
  /** Show the colored dot before the label — intended for sm card badges */
  showDot?: boolean
  /** Custom content — renders instead of the tier name when provided */
  children?: ReactNode
  className?: string
  'aria-label'?: string
}

export default function TierBadge({
  tier,
  size = 'md',
  showDot = false,
  children,
  className = '',
  'aria-label': ariaLabel,
}: TierBadgeProps) {
  return (
    <div
      className={[styles.badge, styles[size], styles[tier], className].filter(Boolean).join(' ')}
      aria-label={ariaLabel ?? `${tier} tier`}
    >
      {showDot && <span className={styles.dot} aria-hidden="true" />}
      {children ?? (tier.charAt(0).toUpperCase() + tier.slice(1))}
    </div>
  )
}
