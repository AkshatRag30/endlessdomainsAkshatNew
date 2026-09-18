import { useState } from 'react'
import { useDebounces } from '@/utils/useDebounce'
import type { MyDomainListing } from '@/types/my-domains'
import type { MyDomainsStatusFilter } from '@/design-system/composites/my-domains/listings/MyDomainsCategoryTabs'

export interface MyDomainsFilters {
  search: string
  extension: string
  chain: string
  sort: string
}

export const DEFAULT_MY_DOMAINS_FILTERS: MyDomainsFilters = {
  search: '',
  extension: 'any',
  chain: 'any',
  sort: 'recent',
}

/**
 * Local-only filter state for the search + filter bar — no API call, same
 * 300ms useDebounces() the marketplace redesign's useListingFilters uses,
 * not a second debounce implementation (this repo already has three; see
 * the implementation plan's risks section).
 */
export function useMyDomainsFilters() {
  const [filters, setFilters] = useState<MyDomainsFilters>(DEFAULT_MY_DOMAINS_FILTERS)
  const debouncedSearch = useDebounces(filters.search)

  const setFilter = <K extends keyof MyDomainsFilters>(key: K, value: MyDomainsFilters[K]) => {
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
 * Pure, local filtering over the static mock array — no API call. Unlike the
 * marketplace redesign's category tabs (which have no backing field on
 * MarketplaceListing yet), `status` is a real field here, so the category
 * tabs actually filter the table. `sort` has no matching concept on
 * MyDomainListing (no createdAt) — accepted but not applied, same honest gap
 * pattern useListingFilters already uses for price/length/listed.
 */
export function filterMyDomains(
  domains: MyDomainListing[],
  status: MyDomainsStatusFilter,
  search: string,
  filters: MyDomainsFilters
): MyDomainListing[] {
  const term = search.trim().toLowerCase()

  return domains.filter((domain) => {
    if (status !== 'all' && domain.status !== status) return false
    if (term && !domain.domainName.toLowerCase().includes(term)) return false
    if (filters.extension !== 'any' && domain.extension !== filters.extension) return false
    if (filters.chain !== 'any' && domain.chain.id !== CHAIN_VALUE_TO_ID[filters.chain]) return false
    return true
  })
}
