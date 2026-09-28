import React, { useEffect, useRef } from 'react'
import type { ListingCategory } from '@/marketplace-preview/types/marketplace'
import styles from './ListingCategoryTabs.module.scss'

export interface ListingCategoryTabsProps {
  categories: ListingCategory[]
  activeId: string
  onChange: (id: string) => void
  /**
   * 'category' (default) is the listings bar (Figma 1:1515) with counts.
   * 'section' is the domain overview's tab bar (5:3687): roomier 13.6px tab
   * padding, a medium (not semibold) active label, no counts.
   */
  variant?: 'category' | 'section'
  /** Accessible name for the tablist. */
  ariaLabel?: string
  /** Prefix for each tab's id, so a tabpanel can point back at its tab with aria-labelledby. */
  idPrefix?: string
  className?: string
}

const formatCount = (count: number) => count.toLocaleString('en-US')

/**
 * Figma node 1:1515. Rebuilt from the real design, replacing the Phase 7
 * guess that reused TabButton — that primitive's fixed 162px width and
 * clipped-corner main-site look never matched this translucent glass pill
 * bar, so this is bespoke markup instead, same call already made for the
 * Live Activity tabs.
 *
 * When the row scrolls (mobile), the active tab is scrolled into view on
 * mount and on every change — the domain overview's mobile Comparable sales
 * frame (5:6903) draws the bar already scrolled to its active tab.
 */
export const ListingCategoryTabs = ({
  categories,
  activeId,
  onChange,
  variant = 'category',
  ariaLabel,
  idPrefix,
  className = '',
}: ListingCategoryTabsProps) => {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    const active = bar?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!bar || !active) return
    // Scrolls the bar only; scrollIntoView would also scroll the page.
    const left = active.getBoundingClientRect().left - bar.getBoundingClientRect().left + bar.scrollLeft
    const right = left + active.offsetWidth
    if (left < bar.scrollLeft) bar.scrollTo({ left: left - 8, behavior: 'smooth' })
    else if (right > bar.scrollLeft + bar.clientWidth) bar.scrollTo({ left: right - bar.clientWidth + 8, behavior: 'smooth' })
  }, [activeId])

  const barClass = [styles.bar, variant === 'section' ? styles.section : '', className].filter(Boolean).join(' ')

  return (
    <div ref={barRef} className={barClass} role="tablist" aria-label={ariaLabel}>
      {categories.map((category) => {
        const isActive = category.id === activeId
        const tabClass = [styles.tab, isActive ? styles.tabActive : '', category.disabled ? styles.tabDisabled : ''].filter(Boolean).join(' ')
        return (
          <button
            key={category.id}
            id={idPrefix ? `${idPrefix}-${category.id}` : undefined}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={category.disabled || undefined}
            disabled={category.disabled}
            className={tabClass}
            onClick={() => onChange(category.id)}
          >
            <span className={styles.label}>{category.label}</span>
            {category.count !== undefined && <span className={styles.count}>{formatCount(category.count)}</span>}
            {category.badge && <span className={styles.badge}>{category.badge}</span>}
          </button>
        )
      })}
    </div>
  )
}

export default ListingCategoryTabs
