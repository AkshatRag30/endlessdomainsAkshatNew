import React from 'react'
import ProvidersMarquee from './ProvidersMarquee'

import styles from './IdentityOsProvidersStats.module.scss'

const STATS = [
  { value: '10+', label: 'Domain Providers' },
  { value: '70+', label: 'TLDs Registered' },
  { value: '21+', label: 'Chains Supported' },
  { value: '25K+', label: 'Active Users' },
]

export function IdentityOsProvidersStats() {
  return (
    <section className={styles.section} aria-labelledby="providers-stats-heading">
      <h2 id="providers-stats-heading" className={styles.heading}>
        Own Your Identity Across 10+ Providers In Every Major Chain
      </h2>

      <div className={styles.marqueeFrame}>
        <span className={styles.frameTopBar} aria-hidden="true" />
        <span className={styles.frameDiagLeft} aria-hidden="true" />
        <span className={styles.frameDiagRight} aria-hidden="true" />
        <span className={styles.frameSideLeft} aria-hidden="true" />
        <span className={styles.frameSideRight} aria-hidden="true" />
        <span className={styles.frameFlareLeft} aria-hidden="true" />
        <span className={styles.frameFlareRight} aria-hidden="true" />
        <div className={styles.marqueeSlot}>
          <ProvidersMarquee />
        </div>
      </div>

      <div className={styles.statsRow} role="list">
        {STATS.map(stat => (
          <div key={stat.label} className={styles.statItem} role="listitem">
            <div className={styles.statContent}>
              <span className={styles.cornerTL} aria-hidden="true" />
              <span className={styles.cornerTR} aria-hidden="true" />
              <span className={styles.cornerBL} aria-hidden="true" />
              <span className={styles.cornerBR} aria-hidden="true" />
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default IdentityOsProvidersStats
