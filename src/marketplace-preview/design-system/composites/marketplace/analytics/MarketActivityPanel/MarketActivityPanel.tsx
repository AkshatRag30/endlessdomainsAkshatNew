import React, { useState } from 'react'
import { mockMarketMetrics, MARKET_METRICS_UPDATED_LABEL } from '@/marketplace-preview/data/marketplace/analytics'
import type { MarketTimeRange } from '@/marketplace-preview/types/marketplace'
import Badge from '@/marketplace-preview/design-system/primitives/badges/badge'
import Sparkline from '@/marketplace-preview/design-system/primitives/charts/sparkline'
import MarketMetricCard from '../MarketMetricCard'
import styles from './MarketActivityPanel.module.scss'

const RANGES: MarketTimeRange[] = ['24h', '7d', '30d']

const formatMetricValue = (value: number, unit?: string) => (unit === 'ETH' ? `${value} ETH` : value.toLocaleString('en-US'))

/**
 * Figma node 1:1645 for the desktop/mobile card list. Tablet gets a
 * different presentation (node 27:697) — one metric expanded into a big
 * chart with tabs to switch which metric is shown, instead of all four
 * stacked as small cards. Both are rendered and CSS toggles which is
 * visible per breakpoint (same pattern Header already uses for its own
 * responsive pieces), sharing the one time-range toggle between them.
 */
export const MarketActivityPanel = () => {
  const [timeRange, setTimeRange] = useState<MarketTimeRange>('24h')
  const [selectedMetricId, setSelectedMetricId] = useState(mockMarketMetrics[0].id)
  const selectedMetric = mockMarketMetrics.find((metric) => metric.id === selectedMetricId) ?? mockMarketMetrics[0]

  const rangeToggle = (
    <div className={styles.toggle} role="tablist" aria-label="Time range">
      {RANGES.map((range) => (
        <button
          key={range}
          type="button"
          role="tab"
          aria-selected={range === timeRange}
          className={`${styles.toggleOption} ${range === timeRange ? styles.toggleOptionActive : ''}`}
          onClick={() => setTimeRange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  )

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Market activity</span>
          <span className={styles.updated}>{MARKET_METRICS_UPDATED_LABEL}</span>
        </div>

        <div className={styles.cardsOnly}>{rangeToggle}</div>
      </div>

      <div className={`${styles.cards} ${styles.cardsOnly}`}>
        {mockMarketMetrics.map((metric) => (
          <MarketMetricCard key={metric.id} metric={metric} timeRange={timeRange} />
        ))}
      </div>

      <div className={styles.expanded}>
        <div className={styles.metricTabs} role="tablist" aria-label="Metric">
          {mockMarketMetrics.map((metric) => (
            <button
              key={metric.id}
              type="button"
              role="tab"
              aria-selected={metric.id === selectedMetricId}
              className={`${styles.metricTab} ${metric.id === selectedMetricId ? styles.metricTabActive : ''}`}
              onClick={() => setSelectedMetricId(metric.id)}
            >
              {metric.label}
            </button>
          ))}
        </div>

        <div className={styles.expandedValueRow}>
          <span className={styles.expandedValue}>{formatMetricValue(selectedMetric.value, selectedMetric.unit)}</span>
          <Badge variant={selectedMetric.changePercent >= 0 ? 'success' : 'danger'}>
            {selectedMetric.changePercent >= 0 ? '▲' : '▼'} {Math.abs(selectedMetric.changePercent)}%
          </Badge>
          {rangeToggle}
        </div>
        {selectedMetric.secondaryLabel && <span className={styles.expandedSecondary}>{selectedMetric.secondaryLabel}</span>}

        <div className={styles.expandedChart}>
          <Sparkline data={selectedMetric.series[timeRange]} variant={selectedMetric.id === 'sales' ? 'bar' : 'area'} height={120} />
          <div className={styles.expandedChartLabels}>
            <span>{timeRange} ago</span>
            <span>now</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketActivityPanel
