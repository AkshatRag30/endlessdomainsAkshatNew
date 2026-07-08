import React from 'react'
import { ConnectIcon, ContributeIcon, LearnIcon } from './icons'
import styles from './CommunityDifferent.module.scss'

const FEATURES = [
  {
    Icon: ContributeIcon,
    title: 'Contribute and earn',
    description: 'Show up, add value, and get recognised for it onchain.',
    position: 'left' as const,
  },
  {
    Icon: LearnIcon,
    title: 'Learn and grow',
    description: 'Access resources and daily actions to improve your reputation score.',
    position: 'center' as const,
  },
  {
    Icon: ConnectIcon,
    title: 'Connect and build',
    description: 'Find builders and partners who are working at the same level you are.',
    position: 'right' as const,
  },
]

export function CommunityDifferent() {
  return (
    <section className={styles.section} aria-labelledby="different-heading">

      {/* ── Top content area ── */}
      <div className={styles.topArea}>

        {/* Decorative striped column on the left */}
        <div className={styles.stripeCol} data-side="left" aria-hidden="true" />
        <div className={styles.dividerLine} data-side="left" aria-hidden="true" />

        {/* Center content */}
        <div className={styles.centerContent}>

          {/* Subtitle with 4 corner brackets */}
          <div className={styles.subtitleWrap}>
            <span className={styles.subtitleBracketTL} aria-hidden="true" />
            <span className={styles.subtitleBracketTR} aria-hidden="true" />
            <span className={styles.subtitleBracketBL} aria-hidden="true" />
            <span className={styles.subtitleBracketBR} aria-hidden="true" />
            <p className={styles.subtitleText}>Why we are different</p>
          </div>

          {/* Heading */}
          <h2 id="different-heading" className={styles.heading}>
            <span className={styles.headingLine1}>More Than a Community.</span>
            <span className={styles.headingLine2}>A Reputation Network.</span>
          </h2>

          {/* Description */}
          <p className={styles.description}>
            Every member of the Endless Domains community is building something real. Your contributions here are not just conversations. They are proof of work, verified, visible, and tied to your onchain identity.
          </p>

        </div>

        {/* Decorative striped column on the right */}
        <div className={styles.dividerLine} data-side="right" aria-hidden="true" />
        <div className={styles.stripeCol} data-side="right" aria-hidden="true" />
      </div>

      {/* ── Bottom feature cards area ── */}
      <div className={styles.bottomArea}>

        {/* Vertical glow dividers */}
        <div className={styles.glowDivider} data-side="left" aria-hidden="true" />
        <div className={styles.glowDivider} data-side="right" aria-hidden="true" />

        {/* Feature cards */}
        {FEATURES.map(feature => (
          <div key={feature.title} className={styles.featureCard} data-position={feature.position}>
            {/* Icon badge */}
            <div className={styles.iconBadgeWrap}>
              <div className={styles.iconGlowBeam} aria-hidden="true" />
              <div className={styles.iconBadge}>
                <feature.Icon />
              </div>
            </div>

            {/* Text */}
            <div className={styles.cardText}>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}

export default CommunityDifferent
