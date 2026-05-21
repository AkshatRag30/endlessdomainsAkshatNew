import Image from 'next/image'
import React from 'react'
import { WaitlistEmailCard } from './WaitlistEmailCard'
import { WaitlistStatRow } from './WaitlistStatRow'
import styles from './WaitlistHero.module.scss'

export interface WaitlistHeroProps {
  onComplete?: () => void
}

export function WaitlistHero({ onComplete }: WaitlistHeroProps) {
  return (
    <section className={styles.section} aria-labelledby="waitlist-hero-heading">
      <div className={styles.inner}>

        {/* ── Left column ── */}
        <div className={styles.left}>
          <div className={styles.phaseTag}>
            <p className={styles.phaseText}>PHASE 1 · IDENTITY OS · JUNE 2026</p>
          </div>

          <h1 id="waitlist-hero-heading" className={styles.heading}>
            Your <mark className={styles.accent}>On-Chain</mark>
            {' '}History Already Exists.{' '}
            <mark className={styles.accent}>Now It Has A Home.</mark>
          </h1>

          <p className={styles.description}>
            One Identity. Multiple chains, multiple wallets, multiple actions, you have ever taken
            collapsed into a single reputation score. Permanently yours. The founding group is
            capped. Join before it fills.
          </p>

          <WaitlistStatRow />
        </div>

        {/* ── Connector SVG (floats over the gap between columns) ── */}
        <div className={styles.connectorWrap} aria-hidden="true">
          <Image
            src="/waitlist/Group 2085666369.svg"
            alt=""
            width={380}
            height={220}
            className={styles.connectorSvg}
          />
        </div>

        {/* ── Right column ── */}
        <div className={styles.right}>
          <div className={styles.visualWrap}>
            <div className={styles.cardWrap}>
              <WaitlistEmailCard onComplete={onComplete} />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default WaitlistHero
