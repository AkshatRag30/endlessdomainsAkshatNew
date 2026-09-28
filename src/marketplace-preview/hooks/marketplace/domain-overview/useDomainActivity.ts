import type { DomainActivityEvent } from '@/marketplace-preview/types/marketplace'
import { buildDomainActivity } from '@/marketplace-preview/data/marketplace/overview'
import { useMockQuery, type QueryResult } from './queryResult'

/**
 * The Overview tab's Activity card, newest first (plan §6.6). Mock body
 * today; the real one is `GET /marketplace/domain/:fullName/activity`
 * mapped through toActivityEvent (plan §8.2/§8.3).
 */
export const useDomainActivity = (fullName: string | null, options: { skip?: boolean } = {}): QueryResult<DomainActivityEvent[]> =>
  useMockQuery(fullName, buildDomainActivity, options)

export default useDomainActivity
