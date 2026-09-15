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
  // TEMPORARY, preview-only — see Header/MobileDrawerMenu's matching prop.
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
      <span className={styles.label}>{item.label}</span>
      <span className={styles.trailing}>
        {item.badge && <span className={styles.badge}>{item.badge}</span>}
        {typeof item.count === 'number' && <span className={styles.count}>{item.count}</span>}
      </span>
      {/* Same decorative flourish as the mobile drawer's selected row (Figma node 34:2994) — follows whichever item is active here too, desktop or preview-selected */}
      {active && (
        <>
          <img src="/assets/img/marketplace/drawer-explore-deco-1.svg" alt="" aria-hidden="true" className={styles.deco1} />
          <img src="/assets/img/marketplace/drawer-explore-deco-2.svg" alt="" aria-hidden="true" className={styles.deco2} />
          <img src="/assets/img/marketplace/drawer-explore-deco-3.png" alt="" aria-hidden="true" className={styles.deco3} />
        </>
      )}
    </Link>
  )
}

export default SidebarNavItem
