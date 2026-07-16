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
          <div className={styles.bannerBgLayer}>
            <Image
              src="/providers/freename/Union.svg"
              alt=""
              aria-hidden="true"
              fill
              unoptimized
              className={`${styles.unionBg} ${styles.unionBgDesktop}`}
            />
            {/* design-specific: inline SVG instead of next/image — `fill` locks width/left/right
                as inline styles that can't be cropped or resized via a CSS class, which is what
                made the mobile banner unreliable. Inline markup lets viewBox crop the long flat
                side arms cleanly (200 units trimmed off each side of the original 0-1212 range),
                same technique used for CommunityDivider's mobile variant. */}
            <svg
              className={`${styles.unionBg} ${styles.unionBgMobile}`}
              width="100%"
              height="100%"
              viewBox="360 0 492 208"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#ambassadorMobileBannerFilter)">
                <path
                  d="M750.963 188.357C749.372 199.624 739.729 208 728.35 208H488.646C477.267 208 467.624 199.624 466.033 188.357L454.773 108.643C453.181 97.3764 443.538 89 432.16 89H22.8375C10.2247 89 0 78.6128 0 66C0 53.3872 10.2247 43 22.8375 43H409.555C419.176 43 427.766 36.9697 431.034 27.9202L435.672 15.0798C438.94 6.03032 447.53 0 457.151 0H755.238C764.86 0 773.449 6.03032 776.718 15.0798L781.355 27.9202C784.624 36.9697 793.213 43 802.835 43H1189.16C1201.78 43 1212 53.3872 1212 66C1212 78.6128 1201.78 89 1189.16 89H784.836C773.458 89 763.815 97.3764 762.223 108.643L750.963 188.357Z"
                  fill="url(#ambassadorMobileBannerPaint0)"
                />
              </g>
              <defs>
                <filter id="ambassadorMobileBannerFilter" x="0" y="0" width="1212" height="211.683" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="3.68347" />
                  <feGaussianBlur stdDeviation="10.5347" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_51_138" />
                </filter>
                <linearGradient id="ambassadorMobileBannerPaint0" x1="0.0689336" y1="184.597" x2="1211.93" y2="184.597" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2639ED" stopOpacity="0" />
                  <stop offset="0.50366" stopColor="#2639ED" />
                  <stop offset="1" stopColor="#2639ED" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

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
