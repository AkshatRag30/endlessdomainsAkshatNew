import React from 'react'
import SearchInput from '@/design-system/primitives/inputs/search-input'
import FilterDropdown from '@/design-system/primitives/inputs/filter-dropdown'
import type { ListingFilters } from '@/hooks/marketplace/useListingFilters'
import styles from './ListingFilterBar.module.scss'

export interface ListingFilterBarProps {
  filters: ListingFilters
  onFilterChange: <K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) => void
}

const EXTENSION_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: '.ud', label: '.ud' },
  { value: '.eth', label: '.eth' },
]

const PRICE_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'under-5', label: 'Under 5 ETH' },
  { value: '5-15', label: '5 – 15 ETH' },
  { value: 'over-15', label: '15+ ETH' },
]

const LENGTH_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'short', label: '1 – 3 characters' },
  { value: 'medium', label: '4 – 6 characters' },
  { value: 'long', label: '7+ characters' },
]

const CHAIN_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'bsc', label: 'BNB Chain' },
]

const LISTED_OPTIONS = [
  { value: 'any', label: 'Any time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
]

/** Figma node 1:1048. Filter option lists are not from Figma (only the trigger buttons were exported) — reasonable defaults for a domain marketplace. */
export const ListingFilterBar = ({ filters, onFilterChange }: ListingFilterBarProps) => {
  return (
    <div className={styles.bar}>
      <SearchInput value={filters.search} onChange={(value) => onFilterChange('search', value)} />

      <div className={styles.dropdowns}>
        <FilterDropdown label="Extension" value={filters.extension} options={EXTENSION_OPTIONS} onChange={(v) => onFilterChange('extension', v)} />
        <FilterDropdown label="Price" value={filters.price} options={PRICE_OPTIONS} onChange={(v) => onFilterChange('price', v)} />
        <FilterDropdown label="Length" value={filters.length} options={LENGTH_OPTIONS} onChange={(v) => onFilterChange('length', v)} />
        <FilterDropdown label="Chain" value={filters.chain} options={CHAIN_OPTIONS} onChange={(v) => onFilterChange('chain', v)} />
        <FilterDropdown label="Listed" value={filters.listed} options={LISTED_OPTIONS} onChange={(v) => onFilterChange('listed', v)} />
      </div>
    </div>
  )
}

export default ListingFilterBar
