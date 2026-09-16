import React from 'react'
import styles from './DomainAvatar.module.scss'

export interface DomainAvatarProps {
  className?: string
}

/**
 * Figma nodes 375:51245/375:51247 ("token"/"Avatar"/"ENS" group) — every
 * card and row in the reference uses the same generic circular mark, not a
 * per-domain generated image. A real per-domain avatar/blockie is a later,
 * separate concern (the design's own repeated placeholder gives no signal
 * on what that would look like) — this is a faithful generic stand-in, not
 * a guess at bespoke per-domain art.
 */
export const DomainAvatar = ({ className = '' }: DomainAvatarProps) => (
  <span className={[styles.avatar, className].filter(Boolean).join(' ')} aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="8" cy="8" rx="2.8" ry="6.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M1.7 8H14.3" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  </span>
)

export default DomainAvatar
