import React, { useRef } from 'react'
import Image from 'next/image'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import styles from './EventsHero.module.scss'

export interface EventsHeroProps {
  onViewHighlights?: () => void
  onExploreEvents?: () => void
}

export function EventsHero({ onViewHighlights, onExploreEvents }: EventsHeroProps) {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef    = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)

  useEntranceAnimation([eyebrowRef, headingRef, bodyRef, ctaRef])

  return (
    <>
    <section className={styles.section} aria-labelledby="events-hero-heading">
      {/* Video background — replaced with real video when available */}
      <video
        className={styles.heroBg}
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/events/events-video 1.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays matching Figma — left dark sweep + centre fade */}
      <div className={styles.overlayLeft} aria-hidden="true" />
      <div className={styles.overlayCenter} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Eyebrow */}
        <div className={styles.eyebrowWrap} ref={eyebrowRef} aria-hidden="true">
          {/* Left corner icon pair */}
          <span className={styles.cornerIconLeft} aria-hidden="true">
            <span className={`${styles.cornerDot} ${styles.cornerDotTop}`} />
            <span className={`${styles.cornerDot} ${styles.cornerDotBottom}`} />
          </span>

          <p className={styles.eyebrow}>Where Web3 Comes Alive</p>

          {/* Right corner icon pair (mirrored) */}
          <span className={styles.cornerIconRight} aria-hidden="true">
            <span className={`${styles.cornerDot} ${styles.cornerDotTop}`} />
            <span className={`${styles.cornerDot} ${styles.cornerDotBottom}`} />
          </span>
        </div>

        {/* Heading */}
        <h1 id="events-hero-heading" className={styles.heading} ref={headingRef}>
          Where Endless Domains
          <br />
          Meet the World
        </h1>

        {/* Body */}
        <p className={styles.body} ref={bodyRef}>
          From global conferences to curated community meetups, Endless Domains shapes the future of
          Web3 identity, ownership, and digital culture — one event at a time.
        </p>

        {/* CTA row */}
        <div className={styles.ctaRow} ref={ctaRef}>
          <SecondaryButton onClick={onViewHighlights}>
            View Highlights
          </SecondaryButton>
          <PrimaryButton onClick={onExploreEvents}>
            Explore All Events
          </PrimaryButton>
        </div>
      </div>
    </section>

    {/* Banner — union SVG background with "Events We Attended" label */}
    <div className={styles.bannerWrap}>
      <Image
        src="/providers/freename/union.svg"
        alt=""
        aria-hidden="true"
        fill
        unoptimized
        className={styles.unionBg}
      />
      <p className={styles.bannerLabel}>Events We Attended</p>
    </div>
    </>
  )
}

export default EventsHero
