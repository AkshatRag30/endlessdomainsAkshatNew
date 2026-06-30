import React, { useRef } from 'react'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './ParkedHero.module.scss'

export interface ParkedHeroProps {
  onParkNow?: () => void
  onSeeHowItWorks?: () => void
}

export function ParkedHero({ onParkNow, onSeeHowItWorks }: ParkedHeroProps) {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef    = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)

  useEntranceAnimation([eyebrowRef, headingRef, bodyRef, ctaRef])

  return (
    <section className={styles.section} aria-labelledby="parked-hero-heading">
      <video
        className={styles.heroBg}
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/parked-domains/herowebm.webm" type="video/webm" />
        <source src="/parked-domains/herovideo.mp4" type="video/mp4" />
      </video>
      <div className={styles.inner}>
        <div className={styles.gridZone}>
          <div className={styles.eyebrowWrap} ref={eyebrowRef}>
            <span className={styles.reticleCorner} aria-hidden="true" />
            <p className={styles.eyebrow}>BRING YOUR OWN DOMAIN.</p>
            <span className={`${styles.reticleCorner} ${styles.reticleCornerRight}`} aria-hidden="true" />
          </div>

          <h1 id="parked-hero-heading" className={styles.heading} ref={headingRef}>
            Your Domain Works While You Sleep.
            <br />
            <mark className={styles.headingAccent}>Park It. Earn From It.</mark>
          </h1>
        </div>

        <p className={styles.body} ref={bodyRef}>
          Your idle .crypto, .x, .wallet or any Web3 domain is a digital billboard earning
          nothing. Link it to our ad network via IPFS once and collect passive revenue
          every month. No developer needed. No annual fees.
        </p>

        <div className={styles.ctaFrame} ref={ctaRef}>
          <div className={`${styles.cornerFill} ${styles.cornerFillLeft}`} />
          <div className={`${styles.cornerFill} ${styles.cornerFillRight}`} />
          {/* Desktop lines — inside ctaFrame flanking buttons */}
          <div className={`${styles.line} ${styles.leftV} ${styles.desktopLine}`} />
          <div className={`${styles.line} ${styles.leftD} ${styles.desktopLine}`} />
          <div className={`${styles.line} ${styles.rightV} ${styles.desktopLine}`} />
          <div className={`${styles.line} ${styles.rightD} ${styles.desktopLine}`} />

          <div className={styles.ctaRow}>
            <SecondaryButton onClick={onParkNow} className={styles.parkBtn}>
              Park My Domain
            </SecondaryButton>

            <PrimaryButton
              onClick={onSeeHowItWorks}
              icon={
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              iconPosition="right"
            >
              See How It Works
            </PrimaryButton>
          </div>

          {/* Mobile-only lines — below buttons */}
          <div className={styles.mobileLines} aria-hidden="true">
            <div className={`${styles.line} ${styles.leftV}`} />
            <div className={`${styles.line} ${styles.leftD}`} />
            <div className={`${styles.line} ${styles.rightV}`} />
            <div className={`${styles.line} ${styles.rightD}`} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ParkedHero
