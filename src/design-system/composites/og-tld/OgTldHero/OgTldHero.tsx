import React from 'react'
import { Input } from '@/design-system/primitives/input/Input'

import styles from './OgTldHero.module.scss'

const STATS = [
  { value: '4K+', label: 'Registered Identities' },
  { value: '450+', label: 'Integrations' },
  { value: '$2', label: 'Starting Price' },
]

export function OgTldHero() {
  return (
    <section className={styles.hero} aria-labelledby="og-tld-heading">

      {/* ── Main content ── */}
      <div className={styles.content}>

        <div className={styles.textStack}>

          {/* Background grid texture — sits only behind the label/heading/description */}
          <div className={styles.bg} aria-hidden="true">
            <div className={styles.gridLayer} />
          </div>

          {/* Top label */}
          <div className={styles.labelWrap}>
            <span className={styles.labelBracketTL} aria-hidden="true" />
            <span className={styles.labelBracketTR} aria-hidden="true" />
            <span className={styles.labelBracketBL} aria-hidden="true" />
            <span className={styles.labelBracketBR} aria-hidden="true" />
            <p className={styles.labelText}>On-Chain Identity</p>
          </div>

          {/* Heading */}
          <h1 id="og-tld-heading" className={styles.heading}>
            <span className={styles.headingLine1}>Register Your</span>
            <span className={styles.headingLine2}>.og Identity in just $2</span>
          </h1>

          {/* Description */}
          <p className={styles.description}>
            The native identity of the Endless ecosystem. One name for payments, reputation, login, and ownership across Web3. Permanent ownership. No renewals. Starting from $2.
          </p>
        </div>

        {/* Search bar */}
        <Input variant="hero" />

        {/* Stats row */}
        <div className={styles.statsRow} role="list">
          {STATS.map(stat => (
            <div key={stat.label} className={styles.statItem} role="listitem">
              <span className={styles.statBracketLeft} aria-hidden="true" />
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
              <span className={styles.statBracketRight} aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* Live badge */}
        <div className={styles.liveBadge}>
          <span className={styles.liveDot} aria-hidden="true" />
          <span className={styles.liveBadgeText}>Live · 4,000+ Registered</span>
        </div>

      </div>
    </section>
  )
}

export default OgTldHero
