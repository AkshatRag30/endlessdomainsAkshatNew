/**
 * No time-ranged market volume/sales/new-listings endpoint exists in the
 * backend today (confirmed during planning). Modeled off the Figma "Market
 * Activity" panel and isolated behind useMarketMetrics so a real endpoint can
 * slot in later by returning the same ChartPoint[] shape per range. See the
 * implementation plan, section 9/11/12.
 */

export type MarketTimeRange = '24h' | '7d' | '30d'

export interface ChartPoint {
  label: string // timestamp or bucket label
  value: number
}

export type MarketMetricId = 'volume' | 'sales' | 'newListings' | 'newListingsValue'
export type MarketMetricUnit = 'ETH' | 'USD' | 'count'

export interface MarketMetric {
  id: MarketMetricId
  label: string
  value: number
  unit?: MarketMetricUnit
  secondaryLabel?: string // e.g. '≈ $82,799' or 'peak 4 in one period'
  changePercent: number // signed
  series: Record<MarketTimeRange, ChartPoint[]>
}
