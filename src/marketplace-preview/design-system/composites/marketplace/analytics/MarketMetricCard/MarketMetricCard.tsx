import React from 'react'
import type { MarketMetric, MarketTimeRange } from '@/types/marketplace'
import Badge from '@/design-system/primitives/badges/badge'
import Sparkline from '@/design-system/primitives/charts/sparkline'
import styles from './MarketMetricCard.module.scss'

export interface MarketMetricCardProps {
  metric: MarketMetric
  timeRange: MarketTimeRange
}

const formatValue = (metric: MarketMetric) => (metric.unit === 'ETH' ? `${metric.value} ETH` : metric.value.toLocaleString('en-US'))

/** Figma node 1:1645. Sales renders as a bar chart, everything else as a filled line — a real distinction in the design, not a stylistic choice. */
export const MarketMetricCard = ({ metric, timeRange }: MarketMetricCardProps) => {
  const points = metric.series[timeRange]

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <span className={styles.label}>{metric.label}</span>
        <div className={styles.valueRow}>
          <span className={styles.value}>{formatValue(metric)}</span>
          <Badge variant={metric.changePercent >= 0 ? 'success' : 'danger'}>
            {metric.changePercent >= 0 ? '▲' : '▼'} {Math.abs(metric.changePercent)}%
          </Badge>
        </div>
        {metric.secondaryLabel && <span className={styles.secondary}>{metric.secondaryLabel}</span>}
      </div>

      <div className={styles.chart}>
        <Sparkline data={points} variant={metric.id === 'sales' ? 'bar' : 'area'} height={34} />
        <div className={styles.chartLabels}>
          <span>{timeRange} ago</span>
          <span>now</span>
        </div>
      </div>
    </div>
  )
}

export default MarketMetricCard
