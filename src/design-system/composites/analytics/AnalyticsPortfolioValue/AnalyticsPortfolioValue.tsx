import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { FiArrowUpRight } from 'react-icons/fi'
import styles from '../Analytics.module.scss'
import { mockAnalyticsDomains, applyPDFilter, computePVStats } from '../data/mockAnalyticsData'
import type { PDFilterState } from '../data/mockAnalyticsData'

const PVSparkline = dynamic(() => import('./PVSparkline'), { ssr: false })
const PortfolioBarChart = dynamic(() => import('./PortfolioBarChart'), { ssr: false })

interface Props {
  filterState: PDFilterState
}

const AnalyticsPortfolioValue: React.FC<Props> = ({ filterState }) => {
  const filteredDomains = useMemo(
    () => applyPDFilter(mockAnalyticsDomains, filterState),
    [filterState],
  )

  const stats = useMemo(
    () => computePVStats(filteredDomains, filterState),
    [filteredDomains, filterState],
  )

  return (
    <div className={styles.pvWrap}>
      <div className={styles.pvStatRow}>
        <div className={styles.pvStatCard}>
          <div className={styles.pvStatMain}>
            <div className={styles.pvStatContent}>
              <p className={styles.pvStatTitle}>Total Portfolio Value</p>
              <p className={styles.pvStatBigValue}>${stats.totalValue.toLocaleString()}</p>
              <p className={styles.pvStatSub}>
                {stats.totalProviders > 0
                  ? `Across ${stats.totalProviders} Provider${stats.totalProviders !== 1 ? 's' : ''}`
                  : 'No domains match filter'}
              </p>
            </div>
            <div className={styles.pvSparklineWrap} aria-hidden="true">
              <PVSparkline data={stats.sparklineData} />
            </div>
          </div>
        </div>

        <div className={styles.pvStatDivider} aria-hidden="true" />

        <div className={styles.pvStatCard}>
          <div className={styles.pvStatMain}>
            <div className={styles.pvStatContent}>
              <p className={styles.pvStatTitle}>Total Domain</p>
              <p className={styles.pvStatBigValue}>{stats.totalDomains}</p>
              <p className={styles.pvStatSub}>Across {stats.totalProviders} Provider{stats.totalProviders !== 1 ? 's' : ''}</p>
            </div>
            <div
              className={styles.pvStatBadge}
              aria-label={`+${stats.newDomainsCount} new domains ${stats.newDomainsPeriod}`}
            >
              <div className={styles.pvStatBadgeText}>
                <span className={styles.pvStatBadgeNum}>+{stats.newDomainsCount}</span>
                <span className={styles.pvStatBadgePeriod}>{stats.newDomainsPeriod}</span>
              </div>
              <FiArrowUpRight className={styles.pvStatBadgeIcon} aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className={styles.pvStatDivider} aria-hidden="true" />

        <div className={styles.pvStatCard}>
          <div className={styles.pvStatMain}>
            <div className={styles.pvStatContent}>
              <p className={styles.pvStatTitle}>Avg. Domain Value</p>
              <p className={styles.pvStatBigValue}>${stats.avgValue}</p>
              <p className={styles.pvStatSub}>Per Domain</p>
            </div>
            <div
              className={styles.pvStatBadge}
              aria-label={`${stats.totalProviders} active providers`}
            >
              <div className={styles.pvStatBadgeText}>
                <span className={styles.pvStatBadgeNum}>{stats.totalProviders}</span>
                <span className={styles.pvStatBadgePeriod}>providers</span>
              </div>
              <FiArrowUpRight className={styles.pvStatBadgeIcon} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <PortfolioBarChart providers={stats.barProviders} maxValue={stats.barMax} />
    </div>
  )
}

export default AnalyticsPortfolioValue

