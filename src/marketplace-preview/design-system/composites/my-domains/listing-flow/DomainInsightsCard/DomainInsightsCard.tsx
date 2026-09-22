import React, { useState } from 'react'
import { FiBarChart2 } from 'react-icons/fi'
import type { DomainListingInsights } from '@/marketplace-preview/types/my-domains'
import { formatToken } from '../format'
import styles from './DomainInsightsCard.module.scss'

export interface DomainInsightsCardProps {
  insights: DomainListingInsights
  className?: string
}

const DEMAND_LABEL: Record<DomainListingInsights['demand'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

// Figma node 1:8739 — 6 fixed bar heights (px), ascending, the last one
// tallest and brand-colored. Plain CSS bars rather than the Sparkline/
// recharts primitive: recharts' BarChart doesn't render 6 distinct bars
// cleanly at this ~60px width (bars fused into a few uneven blobs instead
// of a crisp staircase), where fixed-height divs match Figma exactly.
const COMPARABLE_BAR_HEIGHTS = [12, 16.5, 19.8, 23.4, 26.4, 30]

export const DomainInsightsCard = ({ insights, className = '' }: DomainInsightsCardProps) => {
  const [expanded, setExpanded] = useState(true)
  const shellClass = [styles.wrap, className].filter(Boolean).join(' ')

  return (
    <div className={shellClass}>
      <div className={styles.card}>
        <div className={styles.header}>
          <FiBarChart2 size={16} aria-hidden="true" className={styles.headerIcon} />
          <span className={styles.headerLabel}>Domain insights</span>
          <button type="button" className={styles.toggle} onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? 'Hide' : 'Show'}
          </button>
        </div>

        {expanded && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Estimated value</span>
                <span className={styles.statValue}>{formatToken(insights.suggestedUsd)}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Endless score</span>
                <span className={styles.statValue}>
                  {insights.endlessScore.toFixed(1)} <span className={styles.statValueMuted}>/5</span>
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Demand</span>
                <span className={[styles.statValue, styles[`demand-${insights.demand}`]].join(' ')}>
                  {DEMAND_LABEL[insights.demand]}
                </span>
              </div>
            </div>

            <div className={styles.comparables}>
              <div className={styles.comparablesText}>
                <span className={styles.comparablesLabel}>Similar names sold around</span>
                <span className={styles.comparablesValue}>
                  {formatToken(insights.comparableSalesLowUsd)} – {formatToken(insights.comparableSalesHighUsd)} USDT
                </span>
              </div>
              <div className={styles.comparablesBars} aria-hidden="true">
                {COMPARABLE_BAR_HEIGHTS.map((height, index) => (
                  <span
                    key={index}
                    className={[
                      styles.comparablesBar,
                      index === COMPARABLE_BAR_HEIGHTS.length - 1 ? styles.comparablesBarActive : '',
                    ].join(' ')}
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {expanded && (
        <p className={styles.callout}>Right around the estimate, which is where most sales clear.</p>
      )}
    </div>
  )
}

export default DomainInsightsCard
