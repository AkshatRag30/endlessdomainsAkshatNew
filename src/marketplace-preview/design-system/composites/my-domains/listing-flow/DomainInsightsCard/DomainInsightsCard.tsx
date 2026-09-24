import React, { useMemo, useState } from 'react'
import { FiBarChart2 } from 'react-icons/fi'
import type { DomainListingInsights } from '@/marketplace-preview/types/my-domains'
import { formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import TokenSuffix from '@/marketplace-preview/design-system/primitives/token-suffix'
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

// Figma node 1:8739 — 6 bars, ascending, the last one tallest and
// brand-colored. Plain CSS bars rather than the Sparkline/recharts
// primitive: recharts' BarChart doesn't render 6 distinct bars cleanly at
// this ~60px width (bars fused into a few uneven blobs instead of a crisp
// staircase), where height-styled divs match Figma exactly.
const COMPARABLE_BAR_COUNT = 6
const MIN_BAR_HEIGHT_PX = 12
const MAX_BAR_HEIGHT_PX = 30

// Deterministic PRNG (mulberry32) — same domain always reproduces the same
// bar shape on every render, but a different seed (a different domain's own
// insight numbers) produces a visibly different shape, instead of every
// domain card sharing one hardcoded staircase.
function mulberry32(seed: number) {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0
  }
  return hash
}

/**
 * Bar heights are seeded off this domain's own insight numbers (comparable
 * sales range, demand, endless score), not a shared constant, so every
 * domain's mini-chart looks different — higher demand trends toward a
 * steeper climb, lower demand toward a flatter one. The last bar always
 * renders tallest (the highlighted "current" bar per Figma).
 */
function getComparableBarHeights(insights: DomainListingInsights): number[] {
  const seed = hashString(
    `${insights.comparableSalesLowUsd}-${insights.comparableSalesHighUsd}-${insights.suggestedUsd}-${insights.endlessScore}-${insights.demand}`
  )
  const random = mulberry32(seed)
  const demandBias = insights.demand === 'high' ? 0.85 : insights.demand === 'medium' ? 0.6 : 0.4

  const ratios: number[] = []
  let level = 0.15 + random() * 0.15
  for (let i = 0; i < COMPARABLE_BAR_COUNT; i++) {
    ratios.push(level)
    level = Math.min(1, level + demandBias * (0.08 + random() * 0.12))
  }
  ratios[COMPARABLE_BAR_COUNT - 1] = 1

  return ratios.map((ratio) => Math.round(MIN_BAR_HEIGHT_PX + ratio * (MAX_BAR_HEIGHT_PX - MIN_BAR_HEIGHT_PX)))
}

export const DomainInsightsCard = ({ insights, className = '' }: DomainInsightsCardProps) => {
  const [expanded, setExpanded] = useState(true)
  const shellClass = [styles.wrap, className].filter(Boolean).join(' ')
  const barHeights = useMemo(() => getComparableBarHeights(insights), [insights])

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
                  {formatToken(insights.comparableSalesLowUsd)} – {formatToken(insights.comparableSalesHighUsd)} <TokenSuffix />
                </span>
              </div>
              <div className={styles.comparablesBars} aria-hidden="true">
                {barHeights.map((height, index) => (
                  <span
                    key={index}
                    className={[
                      styles.comparablesBar,
                      index === barHeights.length - 1 ? styles.comparablesBarActive : '',
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
