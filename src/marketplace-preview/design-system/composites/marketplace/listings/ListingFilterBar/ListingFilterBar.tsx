import React from 'react'
import SearchInput from '@/marketplace-preview/design-system/primitives/inputs/search-input'
import FilterDropdown from '@/marketplace-preview/design-system/primitives/inputs/filter-dropdown'
import type { ListingFilters } from '@/marketplace-preview/hooks/marketplace/useListingFilters'
import styles from './ListingFilterBar.module.scss'

/** ListingFilterBar's price range slider — bounds + unit, not a fixed bucket list, since the mock ETH-priced data and the real USDT-priced live data are on completely different numeric scales. */
export interface PriceRange {
  min: number
  max: number
  step: number
  currency: string
}

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
  /**
   * Price slider bounds — defaults to the mock ETH-priced data's own range
   * (design-preview/marketplace.tsx). pages/index.tsx passes real USDT
   * bounds derived from live data via useLiveListings, since the mock data's
   * priceEth (~3-20) and the real listings' priceEth (~0.5-100 USDT, see
   * mapOrderToMarketplaceListing) are on unrelated scales.
   */
  priceRange?: PriceRange
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

const DEFAULT_PRICE_RANGE: PriceRange = { min: 0, max: 20, step: 1, currency: 'ETH' }

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
 * active without opening it. Price has no option list (it's a slider,
 * rendered via FilterDropdown's children prop instead), so its label is
 * computed directly from the current value rather than looked up.
 */
export const ListingFilterBar = ({ filters, onFilterChange, extensionOptions = DEFAULT_EXTENSION_OPTIONS, priceRange = DEFAULT_PRICE_RANGE }: ListingFilterBarProps) => {
  // filters.price is 'any' until the slider's first touch — displayed at the
  // top of its own range rather than a native range input's implicit
  // "unset" position (its leftmost/min), since "any" means "no cap", not
  // "cap at the cheapest listing".
  const priceValue = filters.price === 'any' ? priceRange.max : Number(filters.price)
  const priceLabel = filters.price === 'any' ? 'Price' : `Up to ${priceValue} ${priceRange.currency}`

  const selectedExtensionLabel = extensionOptions.find((option) => option.value === filters.extension)?.label ?? 'Extension'
  const selectedLengthLabel = LENGTH_OPTIONS.find((option) => option.value === filters.length)?.label ?? 'Length'
  const selectedListedLabel = LISTED_OPTIONS.find((option) => option.value === filters.listed)?.label ?? 'Listed'

  return (
    <div className={styles.bar}>
      <SearchInput value={filters.search} onChange={(value) => onFilterChange('search', value)} />

      <div className={styles.dropdowns}>
        <FilterDropdown label={selectedExtensionLabel} value={filters.extension} options={extensionOptions} onChange={(v) => onFilterChange('extension', v)} />

        <FilterDropdown label={priceLabel}>
          <div className={styles.pricePanel}>
            <input
              type="range"
              className={styles.priceRangeInput}
              min={priceRange.min}
              max={priceRange.max}
              step={priceRange.step}
              value={priceValue}
              aria-label={`Maximum price, in ${priceRange.currency}`}
              onChange={(e) => onFilterChange('price', e.target.value)}
            />
            <span className={styles.priceRangeValue}>
              Up to {priceValue} {priceRange.currency}
            </span>
          </div>
        </FilterDropdown>

        <FilterDropdown label={selectedLengthLabel} value={filters.length} options={LENGTH_OPTIONS} onChange={(v) => onFilterChange('length', v)} />
        {/* <FilterDropdown label="Chain" value={filters.chain} options={CHAIN_OPTIONS} onChange={(v) => onFilterChange('chain', v)} /> */}
        <FilterDropdown label={selectedListedLabel} value={filters.listed} options={LISTED_OPTIONS} onChange={(v) => onFilterChange('listed', v)} />
      </div>
    </div>
  )
}

export default ListingFilterBar
