import React from 'react'
import styles from './ComingSoonBadge.module.scss'

export interface ComingSoonBadgeProps {
  className?: string
}

/**
 * Figma node 72:9506 — the placeholder-nav "soon" pill (currently only
 * Auctions), reused wherever that pill shows up: SidebarNavItem's inactive
 * trailing badge and MobileDrawerMenu's matching browse-row badge. Replaces
 * the old plain gray "SOON" text pill with Figma's blue gradient/glow
 * treatment and the literal "Coming Soon" copy — the label is fixed rather
 * than driven by the item's own `badge` string, since every real usage of
 * that field is this exact pill.
 */
export const ComingSoonBadge = ({ className = '' }: ComingSoonBadgeProps) => (
  <span className={[styles.badge, className].filter(Boolean).join(' ')}>Coming Soon</span>
)

export default ComingSoonBadge
