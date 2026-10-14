import React from 'react'
import SearchInput from '@/marketplace-preview/design-system/primitives/inputs/search-input'
import FilterDropdown from '@/marketplace-preview/design-system/primitives/inputs/filter-dropdown'
import type { ListingFilters } from '@/marketplace-preview/hooks/marketplace/useListingFilters'
import { priceFilterLabel } from '@/marketplace-preview/helpers/marketplace/priceFilter'
import PriceFilterPanel from '../PriceFilterPanel'
import styles from './ListingFilterBar.module.scss'

export interface ListingFilterBarProps {
  filters: ListingFilters
  onFilterChange: <K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) => void
  /**
   * Extension dropdown options — defaults to the mock-data '.ud'/'.eth' pair
   * (design-preview/marketplace.tsx still relies on that default). The real
   * landing page (pages/index.tsx) passes real extensions derived from
   * whatever GET /marketplacev2/orders actually returned, via
   * useLiveListings — that endpoint's own tld values (e.g. "og") don't
   * overlap with the mock pair at all, so a live page needs the real list to
   * ever match anything.
   */
  extensionOptions?: { value: string; label: string }[]
  /** Unit shown in the price fields and pill — the live listings are priced in USDT (pages/index.tsx), the mock data in ETH (the default). */
  priceCurrency?: string
}

// Each list's own 'any' entry carries the dropdown's original static label
// as its text (not a generic "Any") — see the selectedXLabel variables
// below: the idle/unselected state then renders identically to the old
// always-static-label behavior, with no separate fallback needed.
const DEFAULT_EXTENSION_OPTIONS = [
  { value: 'any', label: 'Extension' },
  { value: '.ud', label: '.ud' },
  { value: '.eth', label: '.eth' },
]


const LENGTH_OPTIONS = [
  { value: 'any', label: 'Length' },
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

/**
 * Figma node 1:1048. Filter option lists are not from Figma (only the
 * trigger buttons were exported) — reasonable defaults for a domain
 * marketplace.
 *
 * Every trigger shows the currently selected option's own label instead of
 * a fixed string — same override of FilterDropdown's own default "always
 * show the static label" behavior that MyDomainsFilterBar already
 * established (see that component's own file comment) — so a pill reads as
 * active without opening it. Price has no option list (it's min and max
 * inputs, PriceFilterPanel, rendered via FilterDropdown's children), so its
 * label is built from the applied bounds instead.
 */
export const ListingFilterBar = ({ filters, onFilterChange, extensionOptions = DEFAULT_EXTENSION_OPTIONS, priceCurrency = 'ETH' }: ListingFilterBarProps) => {
  const priceLabel = priceFilterLabel(filters.minPrice, filters.maxPrice, priceCurrency)

  const selectedExtensionLabel = extensionOptions.find((option) => option.value === filters.extension)?.label ?? 'Extension'
  const selectedLengthLabel = LENGTH_OPTIONS.find((option) => option.value === filters.length)?.label ?? 'Length'
  const selectedListedLabel = LISTED_OPTIONS.find((option) => option.value === filters.listed)?.label ?? 'Listed'

  return (
    <div className={styles.bar}>
      <SearchInput value={filters.search} onChange={(value) => onFilterChange('search', value)} />

      <div className={styles.dropdowns}>
        <FilterDropdown label={selectedExtensionLabel} value={filters.extension} options={extensionOptions} onChange={(v) => onFilterChange('extension', v)} />

        <FilterDropdown label={priceLabel}>
          {(close) => (
            <PriceFilterPanel
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              currency={priceCurrency}
              onApply={(minPrice, maxPrice) => {
                onFilterChange('minPrice', minPrice)
                onFilterChange('maxPrice', maxPrice)
              }}
              onClose={close}
            />
          )}
        </FilterDropdown>

        <FilterDropdown label={selectedLengthLabel} value={filters.length} options={LENGTH_OPTIONS} onChange={(v) => onFilterChange('length', v)} />
        {/* <FilterDropdown label="Chain" value={filters.chain} options={CHAIN_OPTIONS} onChange={(v) => onFilterChange('chain', v)} /> */}
        <FilterDropdown label={selectedListedLabel} value={filters.listed} options={LISTED_OPTIONS} onChange={(v) => onFilterChange('listed', v)} />
      </div>
    </div>
  )
}

export default ListingFilterBar
