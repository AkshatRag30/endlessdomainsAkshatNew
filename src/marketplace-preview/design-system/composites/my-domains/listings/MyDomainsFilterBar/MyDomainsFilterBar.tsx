import React from 'react'
import SearchInput from '@/marketplace-preview/design-system/primitives/inputs/search-input'
import FilterDropdown from '@/marketplace-preview/design-system/primitives/inputs/filter-dropdown'
import ViewToggle, { ViewMode } from '@/marketplace-preview/design-system/primitives/toggles/view-toggle'
import type { MyDomainsFilters } from '@/marketplace-preview/hooks/my-domains/useMyDomainsFilters'
import styles from './MyDomainsFilterBar.module.scss'

export interface FilterOption {
  value: string
  label: string
}

export interface MyDomainsFilterBarProps {
  filters: MyDomainsFilters
  onFilterChange: <K extends keyof MyDomainsFilters>(key: K, value: MyDomainsFilters[K]) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  // Real TLDs (from /domain/detail/available-tlds via useMyDomainsData)
  // when the caller has them; falls back to the previous hardcoded list
  // for callers that don't (e.g. the design-preview page, still on mocks).
  extensionOptions?: FilterOption[]
}

const DEFAULT_EXTENSION_OPTIONS: FilterOption[] = [
  { value: 'any', label: 'All Extension' },
  { value: '.ud', label: '.ud' },
  { value: '.eth', label: '.eth' },
]

const CHAIN_OPTIONS = [
  { value: 'any', label: 'All Chain' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'bsc', label: 'BNB Chain' },
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'name', label: 'Name' },
]

/**
 * Figma node 50:6225 (filter row). Reuses the marketplace redesign's
 * SearchInput/FilterDropdown primitives — three dropdowns here instead of
 * five, plus a grid/list ViewToggle the marketplace filter bar doesn't have.
 * ViewToggle is hidden below the mobile breakpoint (see the stylesheet) —
 * Figma node 77:3743's responsive frame has no toggle at all there, since
 * MyDomainsTable forces card view unconditionally on mobile regardless of
 * the last-selected mode.
 */
export const MyDomainsFilterBar = ({ filters, onFilterChange, viewMode, onViewModeChange, extensionOptions }: MyDomainsFilterBarProps) => {
  return (
    <div className={styles.bar}>
      <SearchInput value={filters.search} onChange={(value) => onFilterChange('search', value)} className={styles.searchInput} />

      <div className={styles.controls}>
        <FilterDropdown label="All Extension" value={filters.extension} options={extensionOptions ?? DEFAULT_EXTENSION_OPTIONS} onChange={(v) => onFilterChange('extension', v)} />
        <FilterDropdown label="All Chain" value={filters.chain} options={CHAIN_OPTIONS} onChange={(v) => onFilterChange('chain', v)} />
        <FilterDropdown label="Recently Added" value={filters.sort} options={SORT_OPTIONS} onChange={(v) => onFilterChange('sort', v)} />
        <ViewToggle value={viewMode} onChange={onViewModeChange} className={styles.viewToggle} />
      </div>
    </div>
  )
}

export default MyDomainsFilterBar
