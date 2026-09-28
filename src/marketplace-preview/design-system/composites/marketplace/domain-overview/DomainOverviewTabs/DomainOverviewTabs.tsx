import React from 'react'
import type { DomainOverviewTab, ListingCategory } from '@/marketplace-preview/types/marketplace'
import ListingCategoryTabs from '../../listings/ListingCategoryTabs'
import styles from './DomainOverviewTabs.module.scss'

export interface DomainOverviewTabsProps {
  active: DomainOverviewTab
  onChange: (tab: DomainOverviewTab) => void
  /** The active tab's content. */
  children: React.ReactNode
}

const TAB_ID_PREFIX = 'domain-overview-tab'

// Offers is drawn with a "Soon" chip and isn't selectable (plan O6).
const TABS: ListingCategory[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'price-history', label: 'Price history' },
  { id: 'comparable-sales', label: 'Comparable sales' },
  { id: 'offers', label: 'Offers', disabled: true, badge: 'Soon' },
]

/**
 * Figma node 5:3685 (desktop) / 5:4300 (mobile): the bordered noise panel
 * holding the tab bar (5:3687, ListingCategoryTabs' 'section' variant) and
 * the active tab's content underneath it.
 */
export const DomainOverviewTabs = ({ active, onChange, children }: DomainOverviewTabsProps) => (
  <div className={styles.panel}>
    <ListingCategoryTabs
      categories={TABS}
      activeId={active}
      onChange={(id) => onChange(id as DomainOverviewTab)}
      variant="section"
      ariaLabel="Domain details"
      idPrefix={TAB_ID_PREFIX}
    />
    <div className={styles.content} role="tabpanel" aria-labelledby={`${TAB_ID_PREFIX}-${active}`}>
      {children}
    </div>
  </div>
)

export default DomainOverviewTabs
