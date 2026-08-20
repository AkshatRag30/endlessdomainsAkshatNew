import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { JOURNEYS } from './journeyData'
import { useCrossfade } from './useCrossfade'
import { JourneyScreenVisual } from './JourneyScreenVisual'
import styles from './HowItWorksJourney.module.scss'

const SCREEN_DURATION = 4000

export function HowItWorksJourney() {
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(0)
  const [activeScreenIndex, setActiveScreenIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const journey = JOURNEYS[activeJourneyIndex]
  const screen = journey.screens[activeScreenIndex]

  const { display: displayJourney, phase: leftPhase } = useCrossfade(journey, 260)
  const { display: displayScreen, phase: screenPhase } = useCrossfade(screen, 240)

  // Auto-advance through the active journey's screens — resets whenever the
  // journey itself changes, since screen count differs per journey (4 for
  // mint, 3 for the rest).
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveScreenIndex(i => (i + 1) % journey.screens.length)
    }, SCREEN_DURATION)
    return () => clearInterval(timer)
  }, [isPaused, journey.id, journey.screens.length])

  const handleTabSelect = useCallback((index: number) => {
    setActiveJourneyIndex(index)
    setActiveScreenIndex(0)
  }, [])

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      const next = (activeJourneyIndex + dir + JOURNEYS.length) % JOURNEYS.length
      handleTabSelect(next)
      tabRefs.current[next]?.focus()
    },
    [activeJourneyIndex, handleTabSelect]
  )

  const handlePause = useCallback(() => setIsPaused(true), [])
  const handleResume = useCallback(() => setIsPaused(false), [])

  return (
    <section className={styles.section} aria-labelledby="how-it-works-journey-heading">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.eyebrowWrap}>
            <span className={styles.eyebrowBracketTL} aria-hidden="true" />
            <span className={styles.eyebrowBracketTR} aria-hidden="true" />
            <span className={styles.eyebrowBracketBL} aria-hidden="true" />
            <span className={styles.eyebrowBracketBR} aria-hidden="true" />
            <p className={styles.eyebrowText}>How It Works</p>
          </div>

          <h2 id="how-it-works-journey-heading" className={styles.heading}>
            <span className={styles.headingPlain}>From Mint To Earning</span>
            <span className={styles.headingAccent}>In Simple Steps</span>
          </h2>
        </div>

        <p className={styles.headerDescription}>
          Pick a journey to see exactly how it works: minting your name, building reputation, parking, trading, and unlocking perks.
        </p>
      </div>

      <div className={styles.tabBar} role="tablist" aria-label="Choose a journey" onMouseEnter={handlePause} onMouseLeave={handleResume}>
        {JOURNEYS.map((j, index) => {
          const isActive = index === activeJourneyIndex
          return (
            <button
              key={j.id}
              type="button"
              role="tab"
              id={`journey-tab-${j.id}`}
              aria-selected={isActive}
              aria-controls={`journey-panel-${j.id}`}
              tabIndex={isActive ? 0 : -1}
              ref={el => {
                tabRefs.current[index] = el
              }}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => handleTabSelect(index)}
              onKeyDown={handleTabKeyDown}
              onFocus={handlePause}
              onBlur={handleResume}
            >
              {j.tabLabel}
            </button>
          )
        })}
      </div>

      <div
        className={styles.frame}
        id={`journey-panel-${journey.id}`}
        role="tabpanel"
        aria-labelledby={`journey-tab-${journey.id}`}
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
      >
        <span className={styles.frameBg} aria-hidden="true">
          <Image src="/landing/how-it-works/journey-frame.svg" alt="" fill unoptimized className={styles.frameBgImg} />
        </span>

        <div className={styles.frameContent}>
          <div className={styles.leftContent} data-phase={leftPhase}>
            <h3 className={styles.leftTitle}>
              {displayJourney.leftTitle.map((line, index) => (
                <span className={styles.leftTitleLine} key={`${displayJourney.id}-line-${index}`}>
                  {line}
                </span>
              ))}
            </h3>
            <p className={styles.leftDescription}>{displayJourney.leftDescription}</p>
          </div>

          <JourneyScreenVisual screen={displayScreen} phase={screenPhase} />
        </div>
      </div>
    </section>
  )
}

export default HowItWorksJourney
