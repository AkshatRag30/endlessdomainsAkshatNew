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
  // Real chains present in the signed-in user's own domains (from
  // useMyDomainsData's chainOptions) when the caller has them; falls back
  // to the previous hardcoded 4-chain list for callers that don't.
  chainOptions?: FilterOption[]
  /** POST /marketplacev2/orders/listing-status/sync (useSyncListingStatus). Optional — the design-preview page (still on mocks) leaves this unset, so the button stays visually real but inert there, same convention as other action props here. */
  onSyncNow?: () => void
  isSyncing?: boolean
}

const DEFAULT_EXTENSION_OPTIONS: FilterOption[] = [
  { value: 'any', label: 'All Extension' },
  { value: '.ud', label: '.ud' },
  { value: '.eth', label: '.eth' },
]

const DEFAULT_CHAIN_OPTIONS: FilterOption[] = [
  { value: 'any', label: 'All Chain' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'bsc', label: 'BNB Chain' },
]

/**
 * Figma node 50:6225 (filter row). Reuses the marketplace redesign's
 * SearchInput/FilterDropdown primitives, plus a grid/list ViewToggle the
 * marketplace filter bar doesn't have. ViewToggle is hidden below the
 * mobile breakpoint (see the stylesheet) — Figma node 77:3743's responsive
 * frame has no toggle at all there, since MyDomainsTable forces card view
 * unconditionally on mobile regardless of the last-selected mode. No sort
 * dropdown here anymore — it never actually sorted anything (no matching
 * field on MyDomainListing), so it was removed rather than kept as a
 * control with no effect.
 *
 * Each FilterDropdown's trigger shows the currently selected option's own
 * label instead of a fixed string — FilterDropdown's own default behavior
 * (see its file comment) is to always show the `label` prop verbatim and
 * only mark the selection inside the open panel, which meant there was no
 * way to tell a filter was active without opening it. Falls back to each
 * option list's own "All ..." entry when nothing's selected, so the
 * default/no-filter state reads the same as before.
 */
export const MyDomainsFilterBar = ({ filters, onFilterChange, viewMode, onViewModeChange, extensionOptions, chainOptions, onSyncNow, isSyncing }: MyDomainsFilterBarProps) => {
  const resolvedExtensionOptions = extensionOptions ?? DEFAULT_EXTENSION_OPTIONS
  const resolvedChainOptions = chainOptions ?? DEFAULT_CHAIN_OPTIONS
  const selectedExtensionLabel = resolvedExtensionOptions.find((option) => option.value === filters.extension)?.label ?? 'All Extension'
  const selectedChainLabel = resolvedChainOptions.find((option) => option.value === filters.chain)?.label ?? 'All Chain'

  return (
    <div className={styles.bar}>
      <SearchInput value={filters.search} onChange={(value) => onFilterChange('search', value)} className={styles.searchInput} />

      <div className={styles.controls}>
        <button type="button" className={styles.trigger} onClick={onSyncNow} disabled={isSyncing}>
          {isSyncing ? 'Syncing…' : 'Sync Now'}
        </button>
        <FilterDropdown label={selectedExtensionLabel} value={filters.extension} options={resolvedExtensionOptions} onChange={(v) => onFilterChange('extension', v)} />
        <FilterDropdown label={selectedChainLabel} value={filters.chain} options={resolvedChainOptions} onChange={(v) => onFilterChange('chain', v)} />
        <ViewToggle value={viewMode} onChange={onViewModeChange} className={styles.viewToggle} />
      </div>
    </div>
  )
}

export default MyDomainsFilterBar
