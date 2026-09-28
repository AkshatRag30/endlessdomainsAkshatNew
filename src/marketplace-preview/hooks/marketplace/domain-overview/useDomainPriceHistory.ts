import type { DomainPriceHistory } from '@/marketplace-preview/types/marketplace'
import { buildDomainPriceHistory } from '@/marketplace-preview/data/marketplace/overview'
import { useMockQuery, type QueryResult } from './queryResult'

/**
 * The Price history tab's 30 day series (plan §6.6). Mock body today; the
 * real one is `GET /marketplace/domain/:fullName/price-history?range=30d`
 * mapped through toPriceHistory (plan §8.2/§8.3). `skip` until the tab is
 * first opened.
 */
export const useDomainPriceHistory = (fullName: string | null, options: { skip?: boolean } = {}): QueryResult<DomainPriceHistory> =>
  useMockQuery(fullName, buildDomainPriceHistory, options)

export default useDomainPriceHistory
