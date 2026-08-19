import React, { useEffect, useRef, useState } from 'react'
import { PiWarningCircleLight } from 'react-icons/pi'

import { TRANSFORM_PAIRS, pickAmbientAddress, randomInt } from './DomainAdoptionGapData'
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

interface MarkerProps {
  top: string
  side: 'left' | 'right'
  offset: string
  active: boolean
  variant: 'ambient' | 'transform'
}

// One fixed background wallet-address slot. 'ambient' markers just cycle plain addresses
// (the unresolved gray market — phase 8). 'transform' markers hold on an address, then
// resolve it into its paired human-readable identity before cycling to the next pair
// (phase 7) — the moment this whole section is built around.
function Marker({ top, side, offset, active, variant }: MarkerProps) {
  const [text, setText] = useState('')
  const [resolved, setResolved] = useState(false)
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const pairIndexRef = useRef(0)

  useEffect(() => {
    if (!active) {
      clearTimeout(timeoutRef.current)
      setVisible(false)
      return
    }

    function showAmbient() {
      setText(pickAmbientAddress())
      setResolved(false)
      setVisible(true)
      timeoutRef.current = setTimeout(() => {
        setVisible(false)
        timeoutRef.current = setTimeout(showAmbient, randomInt(2200, 5200))
      }, randomInt(2600, 4200))
    }

    function showTransform() {
      const pair = TRANSFORM_PAIRS[pairIndexRef.current % TRANSFORM_PAIRS.length]
      pairIndexRef.current += 1
      setText(pair.address)
      setResolved(false)
      setVisible(true)
      timeoutRef.current = setTimeout(() => {
        setText(pair.identity)
        setResolved(true)
        timeoutRef.current = setTimeout(() => {
          setVisible(false)
          timeoutRef.current = setTimeout(showTransform, randomInt(3200, 5600))
        }, 2600)
      }, 1500)
    }

    timeoutRef.current = setTimeout(variant === 'transform' ? showTransform : showAmbient, randomInt(300, 2400))
    return () => clearTimeout(timeoutRef.current)
  }, [active, variant])

  return (
    <div className={styles.marker} data-variant={variant} style={{ top, [side]: offset }}>
      <span className={styles.markerText} data-visible={visible || undefined} data-resolved={resolved || undefined}>
        {text}
      </span>
    </div>
  )
}

const TOTAL_STEPS = [0, 174, 421, 741]
const PERCENT_STEPS = [0, 7, 12, 16, 19]

export function DomainAdoptionGap() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)
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
  const percent = useQuickCount(percentRun, PERCENT_STEPS, 110, reducedMotion)

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

  // The one-shot reveal sequence — runs exactly once, the first time the section enters
  // the viewport. Scrolling in and out again afterward never replays it (requirement:
  // "animate once → settle into ambient activity", not a scrubbed/repeating animation).
  useEffect(() => {
    // hasRunRef, not state — this guard must never itself be a reactive dependency of
    // this effect. It was state originally, and setting it inside the effect made React
    // tear the effect down (running its cleanup, which cleared every timer just
    // scheduled) on the very next render, before any of them could fire.
    if (!active || hasRunRef.current) return
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
    at(900, () => setBarBuilt(true))
    at(2150, () => setBoundaryPulse(true))
    at(2400, () => setBoundaryPulse(false))
    at(2200, () => setPercentRun(true))
    at(2200 + PERCENT_STEPS.length * 110 + 250, () => setPercentSettled(true))
    at(2500, () => setLabelReveal(true))
    at(2700, () => setGrayPulse(true))
    at(3300, () => setGrayPulse(false))

    return () => timers.forEach(clearTimeout)
  }, [active, reducedMotion])

  // Reduced motion means no continuous ambient activity — the wallet-address markers
  // never start cycling at all, and the section holds at its plain settled state.
  const markersActive = active && !reducedMotion

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
            No one can take it away
          </span>
          <span className={styles.labelTotal}>{total}M total</span>
        </div>

        <div className={styles.barTrack} aria-hidden="true">
          <div className={styles.barGrayAmbient} data-pulse={grayPulse || undefined}>
            <Marker top="30%" side="left" offset="8%" active={markersActive} variant="ambient" />
            <Marker top="65%" side="left" offset="34%" active={markersActive} variant="ambient" />
            <Marker top="30%" side="left" offset="58%" active={markersActive} variant="ambient" />
          </div>

          <div className={styles.barFill} data-built={barBuilt || undefined}>
            <div className={styles.barFillInner}>
              <Marker top="50%" side="right" offset="6%" active={markersActive} variant="transform" />
            </div>
            <span className={styles.barBoundary} data-pulse={boundaryPulse || undefined} />
          </div>
        </div>

        <span className={styles.srOnly}>
          {total} million on-chain users total. {percentSettled ? 'Under 20%' : `${percent}%`} carry a human-readable identity.
        </span>
      </div>

      <div className={styles.statistic}>
        <div className={styles.statisticRow}>
          <span className={styles.statValue}>{percentSettled ? 'Under 20%' : `${percent}%`}</span>
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
