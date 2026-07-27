import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import styles from './DomainHowItWorks.module.scss'

interface Step {
  id: string
  label: string
  image: string
  mobileImage: string
  // design-specific: the 4 mob screenshots aren't all identical dimensions — real width/height
  // per step lets the image wrapper use the exact aspect ratio instead of a guessed shared value
  mobileImageWidth: number
  mobileImageHeight: number
  caption: string
}

const STEPS: Step[] = [
  {
    id: 'connect-wallet',
    label: 'Connect your Wallet',
    image: '/domain-tld/connect your wallet.png',
    mobileImage: '/domain-tld/loginmob.png',
    mobileImageWidth: 948,
    mobileImageHeight: 1029,
    caption: 'Connect the wallet you want your identity minted to.',
  },
  {
    id: 'pick-identity',
    label: 'Pick your identity',
    image: '/domain-tld/pick your identity.png',
    mobileImage: '/domain-tld/pickmob.png',
    mobileImageWidth: 948,
    mobileImageHeight: 1044,
    caption: 'Search any Identity across 60+ TLDs and check availability instantly.',
  },
  {
    id: 'pay-once',
    label: 'Pay Once. Own Forever.',
    image: '/domain-tld/pay once.png',
    mobileImage: '/domain-tld/payoncemob.png',
    mobileImageWidth: 948,
    mobileImageHeight: 1038,
    caption: 'One-time payment. No annual renewals. Minted to your wallet permanently.',
  },
  {
    id: 'connect-resolve',
    label: 'Connect and Resolve',
    image: '/domain-tld/connect and resolve.png',
    mobileImage: '/domain-tld/connectmob.png',
    mobileImageWidth: 948,
    mobileImageHeight: 1038,
    caption: 'Connect your wallets and your identity resolves across 450+applications immediately.',
  },
]

const STEP_DURATION = 4000

// design-specific: how much extra scroll distance (in viewport heights) the tall wrapper reserves
// per step beyond the first — scrolling through that distance is what advances activeIndex, so
// the section becomes tall enough to scroll through instead of only advancing on click/timer
const SCROLL_VH_PER_STEP = 0.6

export function DomainHowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isScrollDriven, setIsScrollDriven] = useState(false)
  // design-specific: the tall-wrapper scroll height only applies on desktop/tablet (mobile uses
  // its own scroll-snap card list) — defaults to undefined so no inline height is set until
  // mounted client-side, avoiding an SSR/hydration mismatch from reading window.matchMedia
  const [scrollWrapperHeight, setScrollWrapperHeight] = useState<string | undefined>(undefined)

  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  // Auto-advance timer — only runs until the user starts scrolling through the section, at which
  // point scroll position takes over as the source of truth for which step is active
  useEffect(() => {
    if (isPaused || isScrollDriven) return

    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % STEPS.length)
    }, STEP_DURATION)

    return () => clearInterval(timer)
  }, [isPaused, isScrollDriven])

  // Scroll-driven step advancement — desktop/tablet only (mobile renders its own scroll-snap card
  // list instead, see .mobileCardList below). Maps scroll progress through a tall wrapper section
  // onto a discrete step index, same technique as ParkedRoadmap's sticky-pin pattern.
  //
  // design-specific: the mobile/reduced-motion checks below only gate whether scroll listeners
  // get ATTACHED, not whether they stay attached — a matchMedia check read once inside a mount-
  // only effect (empty deps) never re-evaluates if the viewport crosses the breakpoint afterwards
  // (device rotation, resizing a browser window, or React re-mounting at a different width than
  // it first painted at). That left scrollWrapperHeight permanently set to its inflated
  // 100vh + N*60vh value with nothing to ever clear it back to undefined on mobile, which is
  // exactly what produced the large leftover blank space below the mobile card list — the tall
  // inline minHeight on .section was still in effect underneath it. A window-level resize
  // listener (registered unconditionally, before any early return) now re-checks the breakpoint
  // on every resize and tears the whole scroll-driven setup down — clearing scrollWrapperHeight
  // and isScrollDriven, and removing the scroll listener — the moment the viewport becomes mobile.
  useEffect(() => {
    if (typeof window === 'undefined') return

    let cleanupScroll: (() => void) | undefined

    function teardown() {
      cleanupScroll?.()
      cleanupScroll = undefined
      setScrollWrapperHeight(undefined)
      setIsScrollDriven(false)
    }

    function setup() {
      if (window.matchMedia('(max-width: 767px)').matches) {
        teardown()
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (cleanupScroll) return // already set up for this desktop/tablet session

      const section = sectionRef.current
      if (!section) return

      setScrollWrapperHeight(`calc(100vh + ${STEPS.length * SCROLL_VH_PER_STEP * 100}vh)`)

      let sectionTop = 0
      let scrollDist = 0

      function cacheLayout() {
        if (!section) return
        // computed directly from the known target height rather than section.offsetHeight, since
        // the inline height style set just above may not have painted yet on the very first call
        const targetHeight = window.innerHeight + STEPS.length * SCROLL_VH_PER_STEP * window.innerHeight
        const rect = section.getBoundingClientRect()
        sectionTop = window.scrollY + rect.top
        scrollDist = Math.max(1, targetHeight - window.innerHeight)
      }

      function onScroll() {
        const raw = window.scrollY - sectionTop
        // outside the section's own scroll range — leave activeIndex to click/timer control
        if (raw < 0 || raw > scrollDist) {
          setIsScrollDriven(false)
          return
        }
        setIsScrollDriven(true)
        const p = Math.max(0, Math.min(1, raw / scrollDist))
        const index = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))
        setActiveIndex(index)
      }

      cacheLayout()
      onScroll()

      window.addEventListener('scroll', onScroll, { passive: true })
      cleanupScroll = () => window.removeEventListener('scroll', onScroll)
    }

    setup()
    window.addEventListener('resize', setup)

    return () => {
      window.removeEventListener('resize', setup)
      cleanupScroll?.()
    }
  }, [])

  const handleStepClick = useCallback((index: number) => {
    setActiveIndex(index)

    // jump scroll position to the middle of that step's slice of the tall section, so clicking
    // a step and scrolling stay in sync with each other instead of fighting
    const section = sectionRef.current
    if (!section || window.matchMedia('(max-width: 767px)').matches) return
    const rect = section.getBoundingClientRect()
    const sectionTop = window.scrollY + rect.top
    const scrollDist = Math.max(1, section.offsetHeight - window.innerHeight)
    const targetP = (index + 0.5) / STEPS.length
    window.scrollTo({ top: sectionTop + targetP * scrollDist, behavior: 'smooth' })
  }, [])

  const handlePause = useCallback(() => setIsPaused(true), [])
  const handleResume = useCallback(() => setIsPaused(false), [])

  const activeStep = STEPS[activeIndex]

  return (
    <section
      className={styles.section}
      ref={sectionRef}
      aria-labelledby="domain-how-it-works-heading"
      style={scrollWrapperHeight ? { minHeight: scrollWrapperHeight } : undefined}
    >
      <h2 id="domain-how-it-works-heading" className={styles.visuallyHidden}>How it works</h2>

      <div
        className={styles.layout}
        ref={stickyRef}
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
      >

        {/* Left — step list */}
        <ul className={styles.stepList} role="tablist" aria-label="How it works steps">
          {STEPS.map((step, index) => {
            const isActive = index === activeIndex
            return (
              <li key={step.id} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={`domain-step-tab-${step.id}`}
                  aria-selected={isActive}
                  aria-controls={`domain-step-panel-${step.id}`}
                  className={`${styles.stepButton} ${isActive ? styles.stepButtonActive : ''}`}
                  onClick={() => handleStepClick(index)}
                  onFocus={handlePause}
                  onBlur={handleResume}
                >
                  {step.label}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Center — device mockup */}
        <div className={styles.mockupFrame}>
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              id={`domain-step-panel-${step.id}`}
              role="tabpanel"
              aria-labelledby={`domain-step-tab-${step.id}`}
              className={`${styles.mockupSlide} ${index === activeIndex ? styles.mockupSlideActive : ''}`}
              aria-hidden={index !== activeIndex}
            >
              <Image
                src={step.image}
                alt={`${step.label} screen preview`}
                fill
                sizes="(max-width: 768px) 280px, 380px"
                className={styles.mockupImage}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Right — active step caption */}
        <div className={styles.captionArea}>
          <p key={activeStep.id} className={styles.caption}>{activeStep.caption}</p>
        </div>

      </div>

      {/* Mobile only — each step becomes its own card. Normal page scroll (no scroll-snap, no
          inflated section height) with all 4 cards stacked via position: sticky at the same
          offset, so the next card scrolls up and over the previous one as you scroll — a
          parallax stacking reveal instead of a one-card-at-a-time carousel. */}
      <ul className={styles.mobileCardList} aria-label="How it works steps">
        {STEPS.map(step => (
          <li key={step.id} className={styles.mobileCard}>
            <h3 className={styles.mobileCardTitle}>{step.label}</h3>
            <p className={styles.mobileCardCaption}>{step.caption}</p>
            <div
              className={styles.mobileCardImageWrap}
              style={{ aspectRatio: `${step.mobileImageWidth} / ${step.mobileImageHeight}` }}
            >
              <Image
                src={step.mobileImage}
                alt={`${step.label} screen preview`}
                width={step.mobileImageWidth}
                height={step.mobileImageHeight}
                sizes="320px"
                className={styles.mobileCardImage}
                unoptimized
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default DomainHowItWorks
