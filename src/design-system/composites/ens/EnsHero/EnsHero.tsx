import React from 'react'
import Image from 'next/image'
import { SiEthereum } from 'react-icons/si'
import { Input } from '@/design-system/primitives/input/Input'

import styles from './EnsHero.module.scss'

const STATS = [
  { value: 'Millions', label: 'Registered Identities' },
  { value: '1000+', label: 'Integrations' },
  { value: '$5', label: 'Starting Price' },
]

export function EnsHero() {
  return (
    <section className={styles.hero} aria-labelledby="ens-heading">

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
          <h1 id="ens-heading" className={styles.heading}>
            <span className={styles.headingLine1}>Register Your</span>
            <span className={styles.headingLine2}>.eth Identity</span>
          </h1>

          {/* Description */}
          <p className={styles.description}>
            The original on-chain identity on Ethereum. One name for payments, login, governance, and digital ownership.
          </p>
        </div>

        {/* Search bar */}
        <Input variant="hero" />

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

        {/* Partnership lockup — Endless Domains × ENS */}
        <div className={styles.partnerWrap}>
          <Image src="/ens/Subtract.svg" alt="" aria-hidden="true" width={560} height={78} className={styles.partnerFrame} unoptimized />
          <div className={styles.partnerLockup}>
            <Image src="/ens/endlesslogo.svg" alt="Endless Domains" width={140} height={45} className={styles.partnerLogo} unoptimized />
            <span className={styles.partnerDivider} aria-hidden="true" />
            <span className={styles.partnerEns}>
              <SiEthereum className={styles.partnerEnsIcon} aria-hidden="true" />
              ENS
            </span>
          </div>
        </div>

        {/* Corner marks — mobile only, below the partnership lockup, one on each edge */}
        <div className={styles.cornerRow} aria-hidden="true">
          <Image src="/og-tld/bottomright.svg" alt="" width={24} height={41} className={`${styles.cornerImgMobile} ${styles.cornerImgMobileLeft}`}  unoptimized />
          <Image src="/og-tld/bottomright.svg" alt="" width={24} height={41} className={`${styles.cornerImgMobile} ${styles.cornerImgMobileRight}`} unoptimized />
        </div>

      </div>
    </section>
  )
}

export default EnsHero
