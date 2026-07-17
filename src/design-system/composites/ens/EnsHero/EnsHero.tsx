import React from 'react'
import Image from 'next/image'
import { Input } from '@/design-system/primitives/input/Input'
import type { TldPageData } from '@/data/tldPages'

import styles from './EnsHero.module.scss'

export interface EnsHeroProps {
  data: TldPageData
}

// design-specific: scoped to only this page's own tld, rather than the Input primitive's shared
// cross-TLD default list, so each TLD page's hero only cycles through its own examples
const EXAMPLE_NAMES = ['explorer', 'metaverse', 'digital', 'crypto', 'identity', 'onchain']

export function EnsHero({ data }: EnsHeroProps) {
  const { hero, providerShort, providerIcon: ProviderIcon, tld } = data
  const placeholderDomains = EXAMPLE_NAMES.map(name => `${name}${tld}`)

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
            <p className={styles.labelText}>{hero.label}</p>
          </div>

          {/* Heading */}
          <h1 id="ens-heading" className={styles.heading}>
            <span className={styles.headingLine1}>{hero.headingLine1}</span>
            <span className={styles.headingLine2}>{hero.headingLine2}</span>
          </h1>

          {/* Description */}
          <p className={styles.description}>
            {hero.description}
          </p>
        </div>

        {/* Search bar */}
        <Input variant="hero" placeholderDomains={placeholderDomains} />

        {/* Stats row */}
        <div className={styles.statsFrame}>
          <Image src="/og-tld/bottomright.svg" alt="" aria-hidden="true" width={53} height={91} className={`${styles.cornerImgDesktop} ${styles.topLeft}`}     unoptimized />
          <Image src="/og-tld/bottomright.svg" alt="" aria-hidden="true" width={53} height={91} className={`${styles.cornerImgDesktop} ${styles.bottomRight}`} unoptimized />
          <div className={styles.statsRow} role="list">
            {hero.stats.map(stat => (
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

        {/* Partnership lockup — Endless Domains × provider */}
        <div className={styles.partnerWrap}>
          <Image src="/ens/Subtract.svg" alt="" aria-hidden="true" width={560} height={78} className={styles.partnerFrame} unoptimized />
          <div className={styles.partnerLockup}>
            <Image src="/ens/endlesslogo.svg" alt="Endless Domains" width={140} height={45} className={styles.partnerLogo} unoptimized />
            <span className={styles.partnerEns}>
              <ProviderIcon className={styles.partnerEnsIcon} aria-hidden="true" />
              {providerShort}
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
