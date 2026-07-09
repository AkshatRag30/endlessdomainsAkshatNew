import React from 'react'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import styles from './BugBountyHero.module.scss'

const ARROWS = Array.from({ length: 8 })

export function BugBountyHero() {
  return (
    <section className={styles.hero} aria-labelledby="bug-bounty-heading">

      {/* ── Background layers ── */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.stripeLayer} />
        <div className={styles.glowBand} />
        <div className={styles.ditherPatchTop} />
        <div className={styles.ditherPatchLeft} />
        <div className={styles.ditherPatchRight} />
      </div>

      {/* ── Falling comets — thin trailing line with a bold dot at the tip ── */}
      <div className={styles.arrowsLayer} aria-hidden="true">
        {ARROWS.map((_, i) => (
          <span key={i} className={styles.arrow}>
            <svg width="10" height="42" viewBox="0 0 10 42" fill="none">
              <line x1="5" y1="0" x2="5" y2="32" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="5" cy="36" r="3" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className={styles.content}>

        <div className={styles.textStack}>

          {/* Title block — label + heading share a contained gray halftone patch behind them */}
          <div className={styles.titleBlock}>
            <div className={styles.ditherPatch} aria-hidden="true" />

            {/* Top label */}
            <div className={styles.labelWrap}>
              <span className={styles.labelBracketTL} aria-hidden="true" />
              <span className={styles.labelBracketTR} aria-hidden="true" />
              <span className={styles.labelBracketBL} aria-hidden="true" />
              <span className={styles.labelBracketBR} aria-hidden="true" />
              <p className={styles.labelText}>Find Bugs. Get Paid.</p>
            </div>

            {/* Heading */}
            <h1 id="bug-bounty-heading" className={styles.heading}>
              <span className={styles.headingLine1}>Welcome To The Endless Domains</span>
              <span className={styles.headingLine2}>Bug Bounty Program</span>
            </h1>

            {/* Description */}
            <p className={styles.description}>
              Endless Domains invites you to find the bugs before anyone else does. Get hands-on access to our staging environment, a clear path through five guided phases, and rewards up to $500 based on what you uncover.
            </p>
          </div>

          {/* CTA row */}
          <div className={styles.ctaRow}>
            <SecondaryButton type="button">
              View Reward Tiers
            </SecondaryButton>
            <PrimaryButton size="sm" shape="rounded">
              Become A Tester
            </PrimaryButton>
          </div>

        </div>

      </div>
    </section>
  )
}

export default BugBountyHero
