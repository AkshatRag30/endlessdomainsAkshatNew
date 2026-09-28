import type { MarketplaceOrder } from '@/marketplace-preview/types/marketplace'
import { getMockOrder } from '@/marketplace-preview/data/marketplace/orders'
import { useMockQuery, type QueryResult } from './queryResult'

/**
 * The receipt page's order (plan §6.6). Mock body today; the real one is
 * `GET /marketplace/orders/:orderId` (buyer or seller only) mapped through
 * toMarketplaceOrder (plan §8.2/§8.3). Pass null until the route param is known.
 */
export const useMarketplaceOrder = (orderId: string | null): QueryResult<MarketplaceOrder> => useMockQuery(orderId, getMockOrder)

export default useMarketplaceOrder
