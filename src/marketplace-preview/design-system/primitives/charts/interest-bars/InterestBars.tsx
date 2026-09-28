import React from 'react'
import Image from 'next/image'
import TrendDelta from '@/marketplace-preview/design-system/primitives/badges/trend-delta'
import styles from './InterestBars.module.scss'

export interface InterestBarItem {
  label: string
  value: number
  /** Signed percent change, e.g. 9.7 or -3.1. */
  changePct: number
}

export interface InterestBarsProps {
  items: InterestBarItem[]
  className?: string
}

// Keeps a bar wide enough for the stat block printed under it (Figma's are
// 130px), so a tiny value can't collapse its column.
const MIN_COLUMN_PX = 130

/**
 * Figma node 5:3764 (domain overview "Interest"): side by side bars with a
 * stat block under each. Figma labels the bars "Negative"/"Positive", so the
 * bar colour, mood face, arrow and delta colour all follow the sign of each
 * item's change.
 *
 * Figma quirks (plan §2.7 Q3/Q4), not copied: it draws "▲ 9.7%" in red next
 * to a sad face (an up arrow in the negative colour), and two equal 1248
 * values as 158px vs 308px bars. Here widths are proportional to the values.
 */
export const InterestBars = ({ items, className = '' }: InterestBarsProps) => {
  // Runtime ratio of the data itself, not a fixed variant set — the one
  // inline style design-system CLAUDE.md §4.5 allows.
  const gridStyle = {
    gridTemplateColumns: items.map((item) => `minmax(${MIN_COLUMN_PX}px, ${Math.max(item.value, 1)}fr)`).join(' '),
  }

  return (
    <div className={[styles.grid, className].filter(Boolean).join(' ')} style={gridStyle}>
      {items.map((item) => {
        const tone = item.changePct < 0 ? 'negative' : 'positive'
        return (
          <div key={item.label} className={styles.column} data-tone={tone}>
            <span className={styles.bar} aria-hidden="true" />
            <div className={styles.stat}>
              <span className={styles.label}>{item.label}</span>
              <div className={styles.valueRow}>
                <Image
                  src={tone === 'negative' ? '/assets/img/domain-overview/mood-sad.svg' : '/assets/img/domain-overview/mood-happy.svg'}
                  alt=""
                  aria-hidden="true"
                  width={33}
                  height={33}
                  className={styles.mood}
                />
                {/* No thousands separator, as Figma draws it and as the summary tile's "1248 views" reads. */}
                <span className={styles.value}>{item.value}</span>
                <TrendDelta changePct={item.changePct} className={styles.delta} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default InterestBars
