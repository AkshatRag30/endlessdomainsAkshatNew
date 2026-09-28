import type { DomainOverview } from '@/marketplace-preview/types/marketplace'
import { resolveDomainOverview } from '@/marketplace-preview/data/marketplace/overview'
import { useMockQuery, type QueryResult } from './queryResult'

/**
 * The overview page's main data: facts, listing, seller, interest (plan
 * §6.6). Mock body today; the real one is `GET /marketplace/domain/:fullName`
 * mapped through toDomainOverview (plan §8.2/§8.3). Pass null until the
 * route param is known.
 */
export const useDomainOverview = (fullName: string | null): QueryResult<DomainOverview> =>
  useMockQuery(fullName, resolveDomainOverview)

export default useDomainOverview
