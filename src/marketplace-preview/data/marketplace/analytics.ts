import { ChartPoint, MarketMetric, MarketTimeRange } from '@/types/marketplace'

/** STATIC MOCK DATA — no time-ranged market metrics endpoint exists yet, see src/types/marketplace/analytics.ts. */

const POINTS_PER_RANGE: Record<MarketTimeRange, number> = { '24h': 12, '7d': 14, '30d': 15 }

function buildSeries(endValue: number, volatility: number): Record<MarketTimeRange, ChartPoint[]> {
  const ranges: MarketTimeRange[] = ['24h', '7d', '30d']
  const result = {} as Record<MarketTimeRange, ChartPoint[]>

  ranges.forEach((range) => {
    const count = POINTS_PER_RANGE[range]
    const points: ChartPoint[] = []
    let value = endValue * (0.6 + Math.random() * 0.15)

    for (let i = 0; i < count; i++) {
      const drift = (endValue - value) / (count - i)
      value = Math.max(0, value + drift + (Math.random() - 0.5) * volatility)
      points.push({ label: `${range}-${i}`, value: Number(value.toFixed(2)) })
    }
    points[points.length - 1] = { label: `${range}-${count - 1}`, value: endValue }
    result[range] = points
  })

  return result
}

export const mockMarketMetrics: MarketMetric[] = [
  {
    id: 'volume',
    label: 'Volume',
    value: 29.4,
    unit: 'ETH',
    secondaryLabel: '≈ $82,799',
    changePercent: 40,
    series: buildSeries(29.4, 3),
  },
  {
    id: 'sales',
    label: 'Sales',
    value: 76,
    unit: 'count',
    secondaryLabel: 'peak 4 in one period',
    changePercent: 130,
    series: buildSeries(76, 8),
  },
  {
    id: 'newListings',
    label: 'New listings',
    value: 143,
    unit: 'count',
    secondaryLabel: '6 per period on average',
    changePercent: 82,
    series: buildSeries(143, 12),
  },
  {
    id: 'newListingsValue',
    label: 'New listings',
    value: 0.52,
    unit: 'ETH',
    secondaryLabel: '≈ $1,477',
    changePercent: 8,
    series: buildSeries(0.52, 0.06),
  },
]

export const MARKET_METRICS_UPDATED_LABEL = 'updated 4 min ago'
