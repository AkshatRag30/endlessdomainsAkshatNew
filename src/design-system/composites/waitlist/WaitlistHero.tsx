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
            <br />
            History Already Exists.
            <br />
            <mark className={styles.accent}>Now It Has A Home.</mark>
          </h1>

          <p className={styles.description}>
            One Identity. Multiple chains, multiple wallets, multiple actions, you have ever taken
            collapsed into a single reputation score. Permanently yours. The founding group is
            capped. Join before it fills.
          </p>

          <div className={styles.statRowWrap}>
                <WaitlistStatRow />
              </div>
        </div>

        {/* ── Right column ── */}
        <div className={styles.right}>
          <div className={styles.formFrame}>
            <span className={`${styles.dot} ${styles.topLeft}`}     aria-hidden="true" />
            <span className={`${styles.dot} ${styles.bottomLeft}`}  aria-hidden="true" />
            <span className={`${styles.dot} ${styles.topRight}`}    aria-hidden="true" />
            <span className={`${styles.dot} ${styles.bottomRight}`} aria-hidden="true" />

            <div className={styles.visualWrap}>
              <div className={styles.cardWrap}>
                <WaitlistEmailCard onComplete={onComplete} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Connector — static base + animated glow layer ── */}
        <div className={styles.connectorWrap} aria-hidden="true">
          {/* Base: original SVG at low opacity, never moves */}
          <Image
            src="/waitlist/Group 2085666369.svg"
            alt=""
            width={380}
            height={130}
            className={styles.connectorBase}
          />
          {/* Glow: inline SVG using same paths reversed (left→right) for energy-flow animation */}
          <svg
            className={styles.connectorGlow}
            viewBox="0 0 317 109"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bottom band centre-line — reversed to travel left→right */}
            <path
              className={styles.glowPath1}
              d="M13.5 26.5H105.601C107.457 26.5 109.237 27.2375 110.55 28.5503L170.45 88.4497C171.763 89.7625 173.543 90.5 175.399 90.5H315.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Top band centre-line — reversed, delayed for depth */}
            <path
              className={styles.glowPath2}
              d="M15 82H107.101C108.957 82 110.737 81.2625 112.05 79.9497L171.95 20.0503C173.263 18.7375 175.043 18 176.899 18H317"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

      </div>
    </section>
  )
}

export default WaitlistHero
