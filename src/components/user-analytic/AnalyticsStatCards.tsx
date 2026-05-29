import React from 'react'
import styles from './Analytics.module.scss'
import type { DomainAnalyticsResult } from './analyticsData'

interface StatCardProps {
  label: string
  value: string | number
  subtitle: string
  accentClass: string
}

const StatCard = ({ label, value, subtitle, accentClass }: StatCardProps) => (
  <div className={`${styles.statCard} ${accentClass}`}>
    <p className={styles.statLabel}>{label}</p>
    <p className={styles.statValue}>{value}</p>
    <p className={styles.statSubtitle}>{subtitle}</p>
  </div>
)

interface Props {
  result: DomainAnalyticsResult
}

const AnalyticsStatCards: React.FC<Props> = ({ result }) => {
  const totalValue = result.portfolioValueByChain.reduce((sum, c) => sum + c.totalValue, 0)

  return (
    <div className={styles.statGrid} role="list" aria-label="Portfolio statistics">
      <StatCard
        label="Total Domains"
        value={result.totalDomains}
        subtitle="Across all chains"
        accentClass={styles.statCard_blue}
      />
      <StatCard
        label="EVM Domains"
        value={result.evmDomains.total}
        subtitle="EVM-compatible chains"
        accentClass={styles.statCard_green}
      />
      <StatCard
        label="Non-EVM Domains"
        value={result.nonEvmDomains.total}
        subtitle="Other chain types"
        accentClass={styles.statCard_purple}
      />
      <StatCard
        label="Listed Domains"
        value={result.listedDomains.total}
        subtitle="On marketplace"
        accentClass={styles.statCard_amber}
      />
      <StatCard
        label="Unique TLDs"
        value={result.uniqueTLDs.length}
        subtitle={result.uniqueTLDs.map(t => `.${t}`).join(', ')}
        accentClass={styles.statCard_teal}
      />
      <StatCard
        label="Portfolio Value"
        value={`$${totalValue}`}
        subtitle="Total across providers"
        accentClass={styles.statCard_orange}
      />
    </div>
  )
}

export default AnalyticsStatCards
