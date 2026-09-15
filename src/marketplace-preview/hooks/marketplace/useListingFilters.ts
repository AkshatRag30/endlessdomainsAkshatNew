import { useState } from 'react'
import { useDebounces } from '@/utils/useDebounce'
import type { MarketplaceListing } from '@/marketplace-preview/types/marketplace'

export interface ListingFilters {
  search: string
  extension: string
  price: string
  length: string
  chain: string
  listed: string
}

export const DEFAULT_LISTING_FILTERS: ListingFilters = {
  search: '',
  extension: 'any',
  price: 'any',
  length: 'any',
  chain: 'any',
  listed: 'any',
}

/**
 * Local-only filter state for the Live Listings search + filter bar — no
 * API call, matches src/utils/useDebounce.ts's existing 300ms default
 * rather than introducing a second debounce implementation (this repo
 * already has three; see the implementation plan's risks section).
 */
export function useListingFilters() {
  const [filters, setFilters] = useState<ListingFilters>(DEFAULT_LISTING_FILTERS)
  const debouncedSearch = useDebounces(filters.search)

  const setFilter = <K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return { filters, debouncedSearch, setFilter }
}

const CHAIN_VALUE_TO_ID: Record<string, string> = {
  polygon: 'polygon',
  ethereum: 'ethereum',
  arbitrum: 'arbitrum',
  bsc: 'bsc',
}

/**
 * Pure, local filtering over the static mock array — no API call. Search
 * and chain are wired to real fields; price/length/listed have no matching
 * field on MarketplaceListing yet (see the implementation plan's data
 * model), so they're accepted but not applied, rather than silently
 * pretending to filter on something that doesn't exist.
 */
export function filterListings(listings: MarketplaceListing[], search: string, filters: ListingFilters): MarketplaceListing[] {
  const term = search.trim().toLowerCase()

  return listings.filter((listing) => {
    if (term && !listing.domainName.toLowerCase().includes(term)) return false
    if (filters.extension !== 'any' && listing.extension !== filters.extension) return false
    if (filters.chain !== 'any' && listing.chain.id !== CHAIN_VALUE_TO_ID[filters.chain]) return false
    return true
  })
}
