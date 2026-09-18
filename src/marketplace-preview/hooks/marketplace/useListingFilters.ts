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

const DAY_MS = 24 * 60 * 60 * 1000

function matchesPrice(priceEth: number, bucket: string): boolean {
  switch (bucket) {
    case 'under-5':
      return priceEth < 5
    case '5-15':
      return priceEth >= 5 && priceEth <= 15
    case 'over-15':
      return priceEth > 15
    default:
      return true
  }
}

function matchesLength(domainName: string, bucket: string): boolean {
  const len = domainName.length
  switch (bucket) {
    case 'short':
      return len <= 3
    case 'medium':
      return len >= 4 && len <= 6
    case 'long':
      return len >= 7
    default:
      return true
  }
}

function matchesListed(listedAt: string, bucket: string): boolean {
  if (bucket === 'any') return true
  const ageMs = Date.now() - new Date(listedAt).getTime()
  switch (bucket) {
    case 'today':
      return ageMs <= DAY_MS
    case 'week':
      return ageMs <= 7 * DAY_MS
    case 'month':
      return ageMs <= 30 * DAY_MS
    default:
      return true
  }
}

/**
 * Pure, local filtering over the static mock array — no API call. Every
 * filter is applied against a real field on MarketplaceListing: price and
 * length are derived straight from priceEth/domainName, listed from the
 * mock data's own listedAt timestamp.
 */
export function filterListings(listings: MarketplaceListing[], search: string, filters: ListingFilters): MarketplaceListing[] {
  const term = search.trim().toLowerCase()

  return listings.filter((listing) => {
    if (term && !listing.domainName.toLowerCase().includes(term)) return false
    if (filters.extension !== 'any' && listing.extension !== filters.extension) return false
    if (filters.chain !== 'any' && listing.chain.id !== CHAIN_VALUE_TO_ID[filters.chain]) return false
    if (!matchesPrice(listing.priceEth, filters.price)) return false
    if (!matchesLength(listing.domainName, filters.length)) return false
    if (!matchesListed(listing.listedAt, filters.listed)) return false
    return true
  })
}
