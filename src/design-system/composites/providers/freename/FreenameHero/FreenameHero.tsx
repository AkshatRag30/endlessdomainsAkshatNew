import React, { useRef } from 'react'
import Image from 'next/image'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './FreenameHero.module.scss'

const STATS = [
  { value: '8',     label: 'TLDs Available' },
  { value: '100K+', label: 'Total Registrations' },
  { value: '$5',    label: 'Starting Price' },
]


export interface FreenameHeroProps {
  onGetStarted?: () => void
}

export function FreenameHero({ onGetStarted }: FreenameHeroProps) {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef    = useRef<HTMLParagraphElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)

  useEntranceAnimation([eyebrowRef, headingRef, bodyRef, statsRef])

  return (
    <section className={styles.section} aria-labelledby="freename-hero-heading">
      <Image src="/providers/freename/topright.svg"    alt="" aria-hidden="true" width={53} height={91} className={`${styles.cornerImg} ${styles.topRight}`}    unoptimized />
      <Image src="/providers/freename/topright.svg"    alt="" aria-hidden="true" width={53} height={91} className={`${styles.cornerImg} ${styles.topLeft}`}     unoptimized />
      <Image src="/providers/freename/bottomright.svg" alt="" aria-hidden="true" width={53} height={91} className={`${styles.cornerImg} ${styles.bottomRight}`} unoptimized />
      <Image src="/providers/freename/bottomright.svg" alt="" aria-hidden="true" width={53} height={91} className={`${styles.cornerImg} ${styles.bottomLeft}`}  unoptimized />
      <div className={styles.inner}>

        <div className={styles.gridZone}>
          <div className={styles.eyebrowWrap} ref={eyebrowRef}>
            <span className={styles.reticleCorner} aria-hidden="true" />
            <p className={styles.eyebrow}>THE OS FOR ON-CHAIN IDENTITY.</p>
            <span className={`${styles.reticleCorner} ${styles.reticleCornerRight}`} aria-hidden="true" />
          </div>

          <h1 id="freename-hero-heading" className={styles.heading} ref={headingRef}>
            Register Through
            <br />
            <mark className={styles.headingAccent}>Freename</mark>
          </h1>
        </div>

        <p className={styles.body} ref={bodyRef}>
          Access 8 Web3-native TLDs from one of the leading decentralized naming providers.
          <br />
          Permanent ownership. Custom namespaces. Starting from $5.
        </p>

        <div className={styles.statsFrame} ref={statsRef}>
          <div className={styles.statsRow}>
            {STATS.map((stat, i) => (
              <div key={stat.value} className={styles.statItem}>
                <div className={styles.statCard}>
                  <div className={styles.statContent}>
                    <p className={styles.statValue}>{stat.value}</p>
                    <p className={styles.statLabel}>{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default FreenameHero
