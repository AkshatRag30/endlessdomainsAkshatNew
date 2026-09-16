import React from 'react'
import ListingCategoryTabs from '@/marketplace-preview/design-system/composites/marketplace/listings/ListingCategoryTabs'
import type { DomainStatus, MyDomainsStatusCounts } from '@/marketplace-preview/types/my-domains'

export type MyDomainsStatusFilter = DomainStatus | 'all'

export interface MyDomainsCategoryTabsProps {
  statusCounts: MyDomainsStatusCounts
  activeId: MyDomainsStatusFilter
  onChange: (id: MyDomainsStatusFilter) => void
}

const TABS: { id: MyDomainsStatusFilter; label: string }[] = [
  { id: 'all', label: 'All domain' },
  { id: 'for-sale', label: 'For sale' },
  { id: 'not-listed', label: 'Not listed' },
  { id: 'sold', label: 'Sold' },
  { id: 'expiring-soon', label: 'Expiring soon' },
  { id: 'expired', label: 'Expired' },
]

/**
 * Figma node 50:6197 — same pill-tab bar as the marketplace redesign's
 * category tabs (node 1:1515). Reuses that component directly rather than
 * rebuilding it, just adapting MyDomainsStatusCounts into the
 * ListingCategory shape it already expects.
 */
export const MyDomainsCategoryTabs = ({ statusCounts, activeId, onChange }: MyDomainsCategoryTabsProps) => (
  <ListingCategoryTabs
    categories={TABS.map((tab) => ({ id: tab.id, label: tab.label, count: statusCounts[tab.id] }))}
    activeId={activeId}
    onChange={(id) => onChange(id as MyDomainsStatusFilter)}
  />
)

export default MyDomainsCategoryTabs
