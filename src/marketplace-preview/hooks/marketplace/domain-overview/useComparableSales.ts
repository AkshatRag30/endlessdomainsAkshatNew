import type { ComparableSale } from '@/marketplace-preview/types/marketplace'
import { buildComparableSales } from '@/marketplace-preview/data/marketplace/overview'
import { useMockQuery, type QueryResult } from './queryResult'

/**
 * The Comparable sales tab, newest first (plan §6.6). Mock body today; the
 * real one is `GET /marketplace/domain/:fullName/comparables` mapped through
 * toComparableSale (plan §8.2/§8.3). `skip` until the tab is first opened.
 */
export const useComparableSales = (fullName: string | null, options: { skip?: boolean } = {}): QueryResult<ComparableSale[]> =>
  useMockQuery(fullName, buildComparableSales, options)

export default useComparableSales
