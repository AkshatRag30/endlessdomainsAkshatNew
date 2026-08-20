import React from 'react'
import Image from 'next/image'

import styles from './DomainIdentityOS.module.scss'

interface IdentityStat {
  id: string
  value: string
  label: string
  accent?: boolean
}

const STATS: IdentityStat[] = [
  { id: 'rented', value: '401.6M', label: 'Domain Names Rented Worldwide' },
  { id: 'aftermarket', value: '$290M', label: 'In Annual Aftermarket Sales', accent: true },
  { id: 'revoke', value: 'Zero', label: 'Platforms That Can Revoke It' },
]

export function DomainIdentityOS() {
  return (
    <section className={styles.section} aria-labelledby="identity-os-heading">
      <div className={styles.header}>
        <div className={styles.eyebrowWrap}>
          <span className={styles.eyebrowBracketTL} aria-hidden="true" />
          <span className={styles.eyebrowBracketTR} aria-hidden="true" />
          <span className={styles.eyebrowBracketBL} aria-hidden="true" />
          <span className={styles.eyebrowBracketBR} aria-hidden="true" />
          <p className={styles.eyebrowText}>Endless Domains</p>
        </div>

        <h2 id="identity-os-heading" className={styles.heading}>
          <span className={styles.headingPlain}>How Identity </span>
          <span className={styles.headingAccent}>OS Works</span>
        </h2>

        <p className={styles.description}>
          Identity OS goes beyond ownership. Your .og is the key that unlocks reputation, real-world use cases, and an ecosystem built around who you
          are on-chain. Permanent. No renewals. No expiry. No limits on what your identity can become
        </p>
      </div>

      <div className={styles.statsBlock}>
        <span className={styles.connector} aria-hidden="true">
          <Image src="/landing/identity-os/connector-line.svg" alt="" width={1470} height={68} className={styles.connectorImg} unoptimized />
        </span>

        <div className={styles.statsRow} role="list">
          {STATS.map(stat => (
            <div key={stat.id} className={styles.statCol} role="listitem">
              <span className={styles.divider} aria-hidden="true" />

              <div className={styles.statBox}>
                <span className={styles.statCornerTL} aria-hidden="true" />
                <span className={styles.statCornerTR} aria-hidden="true" />
                <span className={styles.statCornerBL} aria-hidden="true" />
                <span className={styles.statCornerBR} aria-hidden="true" />

                <span className={`${styles.statValue} ${stat.accent ? styles.statValueAccent : ''}`}>{stat.value}</span>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          ))}

          <span className={`${styles.divider} ${styles.dividerEnd}`} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

export default DomainIdentityOS
