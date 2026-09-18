import React from 'react'
import type { ListingCategory } from '@/types/marketplace'
import styles from './ListingCategoryTabs.module.scss'

export interface ListingCategoryTabsProps {
  categories: ListingCategory[]
  activeId: string
  onChange: (id: string) => void
}

const formatCount = (count: number) => count.toLocaleString('en-US')

/**
 * Figma node 1:1515. Rebuilt from the real design, replacing the Phase 7
 * guess that reused TabButton — that primitive's fixed 162px width and
 * clipped-corner main-site look never matched this translucent glass pill
 * bar, so this is bespoke markup instead, same call already made for the
 * Live Activity tabs.
 */
export const ListingCategoryTabs = ({ categories, activeId, onChange }: ListingCategoryTabsProps) => {
  return (
    <div className={styles.bar} role="tablist">
      {categories.map((category) => {
        const isActive = category.id === activeId
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => onChange(category.id)}
          >
            <span className={styles.label}>{category.label}</span>
            <span className={styles.count}>{formatCount(category.count)}</span>
          </button>
        )
      })}
    </div>
  )
}

export default ListingCategoryTabs
