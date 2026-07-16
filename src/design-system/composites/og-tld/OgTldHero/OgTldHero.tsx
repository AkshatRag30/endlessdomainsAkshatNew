import React from 'react'
import Image from 'next/image'
import { Input } from '@/design-system/primitives/input/Input'

import styles from './OgTldHero.module.scss'

const STATS = [
  { value: '4K+', label: 'Registered Identities' },
  { value: '450+', label: 'Integrations' },
  { value: '$2', label: 'Starting Price' },
]

// design-specific: scoped to only .og examples, rather than the Input primitive's shared
// cross-TLD default list, since this is the .og-specific hero
const OG_PLACEHOLDER_DOMAINS = [
  'explorer.og',
  'metaverse.og',
  'digital.og',
  'crypto.og',
  'identity.og',
  'onchain.og',
] as const

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
        <Input variant="hero" placeholderDomains={OG_PLACEHOLDER_DOMAINS} />

        {/* Stats row */}
        <div className={styles.statsFrame}>
          <Image src="/og-tld/bottomright.svg" alt="" aria-hidden="true" width={53} height={91} className={`${styles.cornerImgDesktop} ${styles.topLeft}`}     unoptimized />
          <Image src="/og-tld/bottomright.svg" alt="" aria-hidden="true" width={53} height={91} className={`${styles.cornerImgDesktop} ${styles.bottomRight}`} unoptimized />
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
        </div>

        {/* Live badge */}
        <div className={styles.liveBadge}>
          <span className={styles.liveDot} aria-hidden="true" />
          <span className={styles.liveBadgeText}>Live · 4,000+ Registered</span>
        </div>

        {/* Corner marks — mobile only, below the live badge, one on each edge */}
        <div className={styles.cornerRow} aria-hidden="true">
          <Image src="/og-tld/bottomright.svg" alt="" width={24} height={41} className={`${styles.cornerImgMobile} ${styles.cornerImgMobileLeft}`}  unoptimized />
          <Image src="/og-tld/bottomright.svg" alt="" width={24} height={41} className={`${styles.cornerImgMobile} ${styles.cornerImgMobileRight}`} unoptimized />
        </div>

      </div>
    </section>
  )
}

export default OgTldHero
