import React from 'react'
import Image from 'next/image'
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
      {/* Figma node 70:4592 — persistent per-row leading icon, same glyph
          whether the row is active or not (only its color/size changes via
          styles.activeIcon vs styles.icon) — a row's icon identity has to
          stay recognizable across pages, since which row is "active" is a
          per-page prop (initialSelectedId), not something inherent to the
          row itself. item.icon is a react-icons component (or a bespoke
          IconType-shaped component, see MyDomainsIcon) for the rows a
          simple glyph exists for, or a public/ asset path for the handful
          too specific/custom for one (see the data file's own comment) —
          string is the only case that still needs next/image. */}
      {typeof item.icon === 'string' ? (
        <Image
          src={item.icon}
          alt=""
          aria-hidden="true"
          width={active ? 15 : 14}
          height={active ? 15 : 14}
          className={active ? styles.activeIcon : styles.icon}
        />
      ) : item.icon ? (
        <item.icon size={active ? 15 : 14} aria-hidden="true" className={active ? styles.activeIcon : styles.icon} />
      ) : (
        // Keeps every row's label starting at the same x position within a
        // section even though a few items have no matching icon to show.
        <span className={active ? styles.activeIcon : styles.icon} aria-hidden="true" />
      )}

      <span className={styles.label}>{item.label}</span>

      {active ? (
        <span className={styles.activeTrailing}>
          <span className={styles.pillWrap}>
            <Image src="/assets/img/marketplace/sidebar-active-pill.png" alt="" aria-hidden="true" width={100} height={18} className={styles.pill} />
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
        <Image src="/assets/img/marketplace/sidebar-active-bracket.svg" alt="" aria-hidden="true" width={13} height={40} className={styles.bracket} />
      )}
    </Link>
  )
}

export default SidebarNavItem
