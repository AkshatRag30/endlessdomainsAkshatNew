import { ListingCategory } from '@/marketplace-preview/types/marketplace'

/** STATIC MOCK DATA — category counts confirmed against Figma node 1:1515's real design context. */

export const mockListingCategories: ListingCategory[] = [
  { id: 'all', label: 'All', count: 14208 },
  { id: 'short', label: 'Short', count: 412 },
  { id: 'numeric', label: 'Numeric', count: 1180 },
  { id: 'dictionary', label: 'Dictionary', count: 2640 },
  { id: 'brandable', label: 'Brandable', count: 3980 },
  { id: 'premium-extensions', label: 'Premium extensions', count: 1870 }, // was 1878 — the earlier screenshot-only guess, corrected against the real node
]
