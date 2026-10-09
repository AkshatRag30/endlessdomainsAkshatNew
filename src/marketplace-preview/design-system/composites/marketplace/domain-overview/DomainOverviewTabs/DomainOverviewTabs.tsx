import React from 'react'
import type { DomainOverviewTab, ListingCategory } from '@/marketplace-preview/types/marketplace'
import ListingCategoryTabs from '../../listings/ListingCategoryTabs'
import styles from './DomainOverviewTabs.module.scss'

export interface DomainOverviewTabsProps {
  active: DomainOverviewTab
  onChange: (tab: DomainOverviewTab) => void
  /** The active tab's content. */
  children: React.ReactNode
  /**
   * Tabs to draw disabled with a "Soon" chip, on top of 'offers' (always
   * Soon — plan O6). The real order/domain details page
   * (pages/details/[orderId].tsx) has no price-history or comparable-sales
   * endpoint yet, unlike the design-preview mock page, so it marks those
   * two Soon as well instead of showing mock charts on a real page.
   */
  comingSoonTabs?: DomainOverviewTab[]
}

const TAB_ID_PREFIX = 'domain-overview-tab'

const BASE_TABS: { id: DomainOverviewTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'price-history', label: 'Price history' },
  { id: 'comparable-sales', label: 'Comparable sales' },
  { id: 'offers', label: 'Offers' },
]

/**
 * Figma node 5:3685 (desktop) / 5:4300 (mobile): the bordered noise panel
 * holding the tab bar (5:3687, ListingCategoryTabs' 'section' variant) and
 * the active tab's content underneath it.
 */
export const DomainOverviewTabs = ({ active, onChange, children, comingSoonTabs = [] }: DomainOverviewTabsProps) => {
  // Offers is drawn with a "Soon" chip and isn't selectable (plan O6).
  const soon = new Set<DomainOverviewTab>(['offers', ...comingSoonTabs])
  const tabs: ListingCategory[] = BASE_TABS.map((tab) => (soon.has(tab.id) ? { ...tab, disabled: true, badge: 'Soon' } : tab))

  return (
    <div className={styles.panel}>
      <ListingCategoryTabs
        categories={tabs}
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
}

export default DomainOverviewTabs
