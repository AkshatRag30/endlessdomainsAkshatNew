import React from 'react'
import type { DomainPriceHistory, TrendValue } from '@/marketplace-preview/types/marketplace'
import GlassCard from '@/marketplace-preview/design-system/primitives/cards/glass-card'
import TrendDelta from '@/marketplace-preview/design-system/primitives/badges/trend-delta'
import InfoNote from '@/marketplace-preview/design-system/primitives/banners/info-note'
import PriceTrendChart from '@/marketplace-preview/design-system/primitives/charts/price-trend-chart'
import { formatStatNumber } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './PriceHistoryPanel.module.scss'

export interface PriceHistoryPanelProps {
  history?: DomainPriceHistory
  isLoading: boolean
  isError?: boolean
  onRetry?: () => void
}

type StatKey = keyof DomainPriceHistory['stats']

// Desktop order (5:4854). Mobile moves Volume to its own second row (5:5550)
// with CSS order, so the markup stays one list.
const STATS: { key: StatKey; label: string }[] = [
  { key: 'avgPrice', label: 'Avg price' },
  { key: 'volume', label: 'Volume' },
  { key: 'sales', label: 'Sales' },
  { key: 'views', label: 'Views' },
]

const Stat = ({ label, stat, statKey }: { label: string; stat: TrendValue; statKey: StatKey }) => (
  <div className={styles.stat} data-stat={statKey}>
    <dt className={styles.statLabel}>{label}</dt>
    <dd className={styles.statValueRow}>
      <span className={styles.statValue}>{formatStatNumber(stat.value)}</span>
      <TrendDelta changePct={stat.changePct} className={styles.statDelta} />
    </dd>
  </div>
)

/**
 * Figma node 5:4701 (desktop) / 5:5528 + 5:5549 (mobile): the "Price trend,
 * 30 days" card (frosted on desktop, the plain white card on mobile) with
 * four headline stats and the chart, then the data source footnote.
 *
 * Figma quirk (plan §2.7 Q7): every stat reads "1248 ▲ 9.7%"; here each comes
 * from the domain's own 30 day series.
 */
export const PriceHistoryPanel = ({ history, isLoading, isError, onRetry }: PriceHistoryPanelProps) => {
  let body: React.ReactNode
  if (isLoading && !history) {
    body = <div className={styles.skeleton} aria-busy="true" aria-label="Loading price history" />
  } else if (isError || !history) {
    // Not in Figma (plan §7 item 6).
    body = (
      <p className={styles.message}>
        Couldn&apos;t load this.{' '}
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      </p>
    )
  } else {
    body = (
      <>
        <dl className={styles.stats}>
          {STATS.map(({ key, label }) => (
            <Stat key={key} label={label} stat={history.stats[key]} statKey={key} />
          ))}
        </dl>
        {history.points.length > 0 ? (
          <div className={styles.chartSlot}>
            <PriceTrendChart points={history.points} trades={history.trades} />
          </div>
        ) : (
          // Not in Figma (plan §7 item 5).
          <p className={styles.message}>No sales in the last 30 days.</p>
        )}
      </>
    )
  }

  return (
    <div className={styles.panel}>
      <GlassCard variant="glass" title="Price trend, 30 days" titleId="domain-price-trend-title" className={styles.card}>
        {body}
      </GlassCard>
      <InfoNote>Aggregated across marketplaces, refreshed every 15 minutes.</InfoNote>
    </div>
  )
}

export default PriceHistoryPanel
