import React from 'react'

import styles from './DomainStats.module.scss'

const STATS = [
  { value: '650+', label: 'Wallet Integrations' },
  { value: '70+', label: 'TLDs Available' },
  { value: '10+', label: 'Identity Providers' },
  { value: '$2', label: 'Starting Price' },
]

export function DomainStats() {
  return (
    <section className={styles.section} aria-label="Domain platform statistics">
      <div className={styles.row} role="list">
        {STATS.map(stat => (
          <div key={stat.label} className={styles.statItem} role="listitem">
            <span className={styles.statBracketLeft} aria-hidden="true" />
            <span className={styles.mobileCornerTL} aria-hidden="true" />
            <span className={styles.mobileCornerTR} aria-hidden="true" />
            <span className={styles.mobileCornerBL} aria-hidden="true" />
            <span className={styles.mobileCornerBR} aria-hidden="true" />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
            <span className={styles.statBracketRight} aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default DomainStats
