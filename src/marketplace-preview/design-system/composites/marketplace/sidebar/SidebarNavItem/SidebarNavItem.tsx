import React from 'react'
import Link from 'next/link'
import type { SidebarNavItem as SidebarNavItemData } from '@/marketplace-preview/types/marketplace'
import styles from './SidebarNavItem.module.scss'

export interface SidebarNavItemProps {
  item: SidebarNavItemData
  /**
   * True only when this item has a real destination that matches the
   * current route. Placeholder items (see isPlaceholder on the data type)
   * are never marked active — most of them currently share href '/', and
   * treating that as a match would light up several items at once.
   */
  active?: boolean
  // TEMPORARY, preview-only — see SidebarNavItem's matching prop for why.
  // Marks itself selected via onSelect instead of navigating, since several
  // of these destinations are placeholders or sit behind auth and were
  // bouncing an unauthenticated preview session to /login. Remove once
  // Phase 16 wires these up to real destinations.
  previewMode?: boolean
  onSelect?: () => void
}

export const SidebarNavItem = ({ item, active = false, previewMode, onSelect }: SidebarNavItemProps) => {
  const shellClass = [styles.item, active ? styles.active : ''].filter(Boolean).join(' ')

  return (
    <Link
      href={item.href}
      className={shellClass}
      onClick={
        previewMode
          ? (e) => {
              e.preventDefault()
              onSelect?.()
            }
          : undefined
      }
    >
      {/* Figma nodes 23:2916 ("Explore") / 57:9354 ("My domains") — the
          selected row's own leading icon, tuned specifically for the active
          highlighted look. Left as-is rather than swapped for item.icon
          below, to not disturb an already-approved active-row treatment. */}
      {active && (
        <img src="/assets/img/marketplace/drawer-explore-icon.svg" alt="" aria-hidden="true" className={styles.activeIcon} />
      )}

      {/* Figma node 70:4592 — persistent per-row leading icon for inactive
          rows (that reference gives every row its own icon, unlike the
          single active-only asset above). Only items with a matching icon
          in that design carry one; others fall back to no icon rather than
          a guessed one. */}
      {!active &&
        (item.icon ? (
          <img src={item.icon} alt="" aria-hidden="true" className={styles.icon} />
        ) : (
          // Keeps every row's label starting at the same x position within
          // a section even though a few items (Recently sold, Under
          // estimate, Price drops, Alerts) have no matching icon to show.
          <span className={styles.iconSpacer} aria-hidden="true" />
        ))}

      <span className={styles.label}>{item.label}</span>

      {active ? (
        <span className={styles.activeTrailing}>
          <span className={styles.pillWrap}>
            <img src="/assets/img/marketplace/sidebar-active-pill.png" alt="" aria-hidden="true" className={styles.pill} />
            {item.badge && <span className={styles.pillBadge}>{item.badge}</span>}
            {typeof item.count === 'number' && <span className={styles.pillCount}>{item.count}</span>}
          </span>
        </span>
      ) : (
        <span className={styles.trailing}>
          {item.badge && <span className={styles.badge}>{item.badge}</span>}
          {typeof item.count === 'number' && <span className={styles.count}>{item.count}</span>}
        </span>
      )}

      {/* Figma nodes 23:2916 / 57:9354 ("Group 2085666662") — the bracket
          flag overflowing the row's own left edge. */}
      {active && (
        <img src="/assets/img/marketplace/sidebar-active-bracket.svg" alt="" aria-hidden="true" className={styles.bracket} />
      )}
    </Link>
  )
}

export default SidebarNavItem
