import React from 'react'
import Image from 'next/image'
import { PrimaryButton } from '@/design-system/primitives/button'
import styles from './CommunityAmbassador.module.scss'

const BENEFITS = [
  'Early access to new features',
  'Access to private community',
  'Ambassador leaderboard recognition',
  'Direct access to the core team',
  'Rewards tied to onchain activity',
  'Verified ambassador credential',
]

const STEPS = [
  {
    title: 'Apply',
    description: 'Submit with your onchain identity',
  },
  {
    title: 'Onboard',
    description: 'Complete your ambassador setup',
  },
  {
    title: 'Contribute',
    description: 'Earn your place on the leaderboard',
  },
]

export function CommunityAmbassador() {
  return (
    <section className={styles.section} aria-labelledby="ambassador-heading">

      {/* ── Header row ── */}
      <div className={styles.topArea}>

        {/* Decorative striped column on the left */}
        <div className={styles.stripeCol} data-side="left" aria-hidden="true" />

        {/* Center content */}
        <div className={styles.centerContent}>

          {/* Subtitle with corner brackets */}
          <div className={styles.subtitleWrap}>
            <span className={styles.subtitleBracketTL} aria-hidden="true" />
            <span className={styles.subtitleBracketTR} aria-hidden="true" />
            <span className={styles.subtitleBracketBL} aria-hidden="true" />
            <span className={styles.subtitleBracketBR} aria-hidden="true" />
            <p className={styles.subtitleText}>Ambassador program</p>
          </div>

          {/* Heading */}
          <h2 id="ambassador-heading" className={styles.heading}>
            <span className={styles.headingLine1}>Represent Endless Domains.</span>
            <span className={styles.headingLine2}>Grow your reputation.</span>
          </h2>

          {/* Description */}
          <p className={styles.description}>
            Built for people who believe in the power of onchain identity and want to help others discover it.
          </p>

        </div>

        {/* Decorative striped column on the right */}
        <div className={styles.stripeCol} data-side="right" aria-hidden="true" />
      </div>

      {/* ── Benefits grid ── */}
      <div className={styles.benefitsGrid}>
        {BENEFITS.map(benefit => (
          <div key={benefit} className={styles.benefitCell}>
            <p className={styles.benefitText}>{benefit}</p>
          </div>
        ))}
      </div>

      {/* ── CTA banner shape ── */}
      <div className={styles.ctaSection}>
        <div className={styles.bannerWrap}>
          <Image
            src="/providers/freename/Union.svg"
            alt=""
            aria-hidden="true"
            fill
            unoptimized
            className={styles.unionBg}
          />

          <div className={styles.stepsRow}>
            {STEPS.map(step => (
              <div key={step.title} className={styles.step}>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.ctaButtonWrap}>
          <PrimaryButton size="sm">Apply to become an ambassador</PrimaryButton>
        </div>
      </div>

    </section>
  )
}

export default CommunityAmbassador
