import React from 'react'
import styles from './WaitlistStatRow.module.scss'

interface StatItem {
  value: string
  label: string
}

const STATS: StatItem[] = [
  { value: '50', label: 'Pts On Sign-Up' },
  { value: '100', label: 'Pts / Referral' },
  { value: 'Top 500', label: 'Early Access' },
]

export function WaitlistStatRow() {
  return (
    <div className={styles.row} role="list" aria-label="Waitlist reward statistics">
      {STATS.map((stat, i) => (
        <React.Fragment key={stat.label}>
          {i > 0 && <div className={styles.divider} aria-hidden="true" />}
          <div className={styles.stat} role="listitem">
            <div className={styles.bracketBox}>
              <p className={styles.value}>{stat.value}</p>
              <p className={styles.label}>{stat.label}</p>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

export default WaitlistStatRow
