import React, { useRef } from 'react'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
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
        <source src="/events/herowebm.webm" type="video/webm" />
        <source src="/events/herovideo.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays matching Figma — left dark sweep + centre fade */}
      <div className={styles.overlayLeft} aria-hidden="true" />
      <div className={styles.overlayCenter} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Eyebrow */}
        <div className={styles.eyebrowWrap} ref={eyebrowRef} aria-hidden="true">
          {/* Reticle corners */}
          <span className={styles.bracketTL} />
          <span className={styles.bracketTR} />
          <span className={styles.bracketBL} />
          <span className={styles.bracketBR} />

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
          {/* Ghost / outline button — "View Highlights" */}
          <button
            type="button"
            className={styles.btnGhost}
            onClick={onViewHighlights}
            aria-label="View highlights"
          >
            <span className={styles.btnGhostCornerTL} aria-hidden="true" />
            <span className={styles.btnGhostCornerBR} aria-hidden="true" />
            <span className={styles.btnGhostCornerTR} aria-hidden="true" />
            <span className={styles.btnGhostCornerBL} aria-hidden="true" />
            <span className={styles.btnGhostLabel}>View Highlights</span>
          </button>

          {/* Primary blue button — "Explore All Events" */}
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onExploreEvents}
          >
            Explore All Events
          </button>
        </div>
      </div>
    </section>
  )
}

export default EventsHero
