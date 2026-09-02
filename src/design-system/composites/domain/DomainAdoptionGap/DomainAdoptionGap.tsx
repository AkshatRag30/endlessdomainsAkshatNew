import React, { useEffect, useRef, useState } from 'react'
import { PiWarningCircleLight } from 'react-icons/pi'

import styles from './DomainAdoptionGap.module.scss'

// Quick, one-time step reveals for the two headline numbers — not a live ticker like the
// on-chain stats section, just a brief "counting up to scale" flourish (requirement:
// phase 2 / phase 4). Runs once when `run` flips true and never repeats. With reduced
// motion, skip the stepping entirely and land straight on the final value.
function useQuickCount(run: boolean, steps: number[], stepDelayMs: number, instant: boolean) {
  const [value, setValue] = useState(steps[0])
  useEffect(() => {
    if (!run) return
    if (instant) {
      setValue(steps[steps.length - 1])
      return
    }
    let cancelled = false
    steps.forEach((step, i) => {
      setTimeout(() => {
        if (!cancelled) setValue(step)
      }, i * stepDelayMs)
    })
    return () => {
      cancelled = true
    }
  }, [run, instant])
  return value
}

const TOTAL_STEPS = [0, 174, 421, 741]
const PERCENT_STEPS = [0, 1, 2]

export function DomainAdoptionGap() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)
  // Flips false → true the first time the section is seen and never resets — unlike
  // `active`, which toggles back to false the moment the section scrolls out of view
  // again. The reveal effect below depends on THIS, not `active`, so a fast scroll that
  // crosses the 30% threshold and back out within a couple of seconds can't cancel the
  // timers it already scheduled (see the bug this fixes, below).
  const [triggered, setTriggered] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const hasRunRef = useRef(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [barBuilt, setBarBuilt] = useState(false)
  const [boundaryPulse, setBoundaryPulse] = useState(false)
  const [labelReveal, setLabelReveal] = useState(false)
  const [grayPulse, setGrayPulse] = useState(false)
  const [percentSettled, setPercentSettled] = useState(false)
  const [countRun, setCountRun] = useState(false)
  const [percentRun, setPercentRun] = useState(false)

  const total = useQuickCount(countRun, TOTAL_STEPS, 130, reducedMotion)
  // stepDelayMs (275) × the 4 intervals between PERCENT_STEPS' 5 values = 1100ms — tuned
  // to match .barFill's own 1.1s CSS transition exactly, so the number finishes counting
  // at the same instant the bar finishes filling instead of trailing it by a second.
  const percent = useQuickCount(percentRun, PERCENT_STEPS, 275, reducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => setActive(entry.isIntersecting)), { threshold: 0.3 })
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Latches `active` into a one-way flag — see the `triggered` declaration above for why
  // the reveal effect needs this instead of depending on `active` directly.
  useEffect(() => {
    if (active) setTriggered(true)
  }, [active])

  // The one-shot reveal sequence — runs exactly once, the first time the section enters
  // the viewport. Scrolling in and out again afterward never replays it (requirement:
  // "animate once → settle into ambient activity", not a scrubbed/repeating animation).
  //
  // BUG THIS FIXES: this effect used to depend on `active` directly. A fast scroll that
  // carries the section past the 30% visibility threshold and back out again within the
  // ~3.3s reveal window flips `active` true→false, which re-runs this effect — and its
  // cleanup unconditionally cleared every timer just scheduled, before most of them ever
  // fired. Since `hasRunRef` was already set, the effect's guard then blocked it from ever
  // rescheduling them, permanently freezing the bar/percent at their pre-reveal 0% state.
  // Depending on `triggered` (which only ever flips false → true once) instead means this
  // effect runs exactly once for the whole lifetime of the section, so nothing can tear
  // its timers down mid-flight.
  useEffect(() => {
    if (!triggered || hasRunRef.current) return
    hasRunRef.current = true
    setRevealed(true)

    if (reducedMotion) {
      setCountRun(true)
      setPercentRun(true)
      setBarBuilt(true)
      setLabelReveal(true)
      setPercentSettled(true)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))

    at(500, () => setCountRun(true))
    // Bar starts filling and the percent counter starts climbing together — both tuned to
    // land at t=2000 (900 + the bar's 1.1s transition), so the fill and the number always
    // finish as one connected motion instead of drifting apart.
    at(900, () => setBarBuilt(true))
    at(900, () => setPercentRun(true))
    at(2000, () => setBoundaryPulse(true))
    at(2050, () => setPercentSettled(true))
    at(2250, () => setBoundaryPulse(false))
    at(2350, () => setLabelReveal(true))
    at(2550, () => setGrayPulse(true))
    at(3150, () => setGrayPulse(false))

    return () => timers.forEach(clearTimeout)
  }, [triggered, reducedMotion])

  return (
    <section className={styles.section} ref={sectionRef} data-active={revealed || undefined} aria-labelledby="adoption-gap-heading">
      <div className={styles.header}>
        <div className={styles.eyebrowWrap}>
          <span className={styles.eyebrowBracketTL} />
          <span className={styles.eyebrowBracketTR} />
          <span className={styles.eyebrowBracketBL} />
          <span className={styles.eyebrowBracketBR} />
          <p className={styles.eyebrowText}>The Adoption Gap</p>
        </div>

        <h2 id="adoption-gap-heading" className={styles.heading}>
          <span className={styles.headingLine1}>741 Million People Hold Onchain Assets.</span>
          <span className={styles.headingLine2}>Almost None Own an Identity.</span>
        </h2>

        <p className={styles.description}>
          Wallets grew faster than identity did. Hundreds of millions of people are still transacting as a string of hex, and it costs them, constantly.
        </p>
      </div>

      <div className={styles.visualization}>
        <div className={styles.barLabels}>
          <span className={styles.labelIdentity} data-reveal={labelReveal || undefined}>
            Crypto Owners vs. Holders With a Readable Identity
          </span>
          <span className={styles.labelTotal}>{total}M total</span>
        </div>

        <div className={styles.barTrack} aria-hidden="true">
          <div className={styles.barGrayAmbient} data-pulse={grayPulse || undefined}>
            <span className={styles.barGrayLabel}>730M+ still anonymous hex</span>
          </div>

          <div className={styles.barFill} data-built={barBuilt || undefined}>
            <span className={styles.barBoundary} data-pulse={boundaryPulse || undefined} />
          </div>

          <span className={styles.barFillLabel} data-reveal={labelReveal || undefined}>10M+ with an identity</span>
        </div>

        <span className={styles.srOnly}>
          {total} million on-chain users total. {percentSettled ? 'Under 2%' : `${percent}%`} carry a human-readable identity.
        </span>
      </div>

      <div className={styles.statistic}>
        <div className={styles.statisticRow}>
          <span className={styles.statValue}>{percentSettled ? 'Under 2%' : `${percent}%`}</span>
          <p className={styles.statDesc}>of crypto&apos;s 741 million owners carry a human-readable identity. The other 98%+ are the market we are building for.</p>
        </div>

        <div className={styles.sourceNote}>
          <PiWarningCircleLight className={styles.sourceIcon} aria-hidden="true" />
          <p className={styles.sourceText}>
            Calculated: 10M+ identities / 741M crypto owners &middot; Sources: Endless Domains provider totals; Crypto.com Market Sizing Report, Feb 2026
          </p>
        </div>
      </div>
    </section>
  )
}

export default DomainAdoptionGap
