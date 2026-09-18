import React from 'react'
import StatCard from '@/design-system/primitives/cards/stat-card'
import type { MyDomainsSummary } from '@/types/my-domains'
import styles from './PortfolioStatsRow.module.scss'

export interface PortfolioStatsRowProps {
  summary: MyDomainsSummary
}

const formatEth = (value: number) => value.toFixed(1)
const formatUsd = (value: number) => `$${value.toLocaleString('en-US')}`

/** Figma node 50:6238 — the four gradient portfolio tiles, in the 2x2 layout the reference design's 305px-wide right rail wraps them into. */
export const PortfolioStatsRow = ({ summary }: PortfolioStatsRowProps) => (
  <div className={styles.grid}>
    <StatCard
      variant="blue"
      align="end"
      label="Domains"
      value={String(summary.totalDomains)}
      sublabel={`${summary.statusCounts['for-sale']} listed`}
    />
    <StatCard
      variant="dark"
      label="Estimated value"
      value={formatEth(summary.estimatedValueEth)}
      sublabel={`ETH · ${formatUsd(summary.estimatedValueUsd)}`}
    />
    <StatCard
      variant="gray"
      label="Listed value"
      value={formatEth(summary.listedValueEth)}
      sublabel="ETH live on sale"
    />
    <StatCard
      variant="purple"
      align="end"
      label="Sold, all time"
      value={String(summary.soldCount).padStart(2, '0')}
      sublabel={formatUsd(summary.soldValueUsd)}
    />
  </div>
)

export default PortfolioStatsRow
