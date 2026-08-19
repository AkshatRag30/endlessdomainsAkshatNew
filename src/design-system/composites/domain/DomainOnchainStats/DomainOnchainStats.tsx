import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { DATA_SLOTS, pickRandomEvent, randomInt } from './DomainOnchainStatsData'
import styles from './DomainOnchainStats.module.scss'

const START_VALUE = 10009861

// A digit "reel" — a 20-cell strip (0-9 repeated twice) that always advances DOWN, even
// through a 9→0 rollover, then snaps back into the first copy once the transition ends.
// Driven imperatively via a ref instead of React state so a tick only touches the one
// digit that actually changed, never trigger a re-render of the other reels.
const STRIP_CELLS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

interface OdometerDigitProps {
  digit: number
}

function OdometerDigit({ digit }: OdometerDigitProps) {
  const stripRef = useRef<HTMLSpanElement>(null)
  const posRef = useRef(digit)

  useEffect(() => {
    const stripEl = stripRef.current
    if (!stripEl) return
    const el: HTMLSpanElement = stripEl
    const prevPos = posRef.current
    const prevDigit = prevPos % 10
    if (digit === prevDigit) return

    const nextPos = digit > prevDigit ? prevPos + (digit - prevDigit) : prevPos + (10 - prevDigit) + digit
    posRef.current = nextPos
    el.style.transform = `translateY(-${nextPos * 5}%)`

    if (nextPos < 10) return
    function handleTransitionEnd() {
      el.style.transition = 'none'
      posRef.current = nextPos - 10
      el.style.transform = `translateY(-${posRef.current * 5}%)`
      requestAnimationFrame(() => {
        el.style.transition = ''
      })
      el.removeEventListener('transitionend', handleTransitionEnd)
    }
    el.addEventListener('transitionend', handleTransitionEnd)
    return () => el.removeEventListener('transitionend', handleTransitionEnd)
  }, [digit])

  return (
    <span className={styles.digitReel}>
      <span className={styles.digitStrip} ref={stripRef} style={{ transform: `translateY(-${digit * 5}%)` }}>
        {STRIP_CELLS.map((cell, i) => (
          <span className={styles.digitCell} key={i}>
            {cell}
          </span>
        ))}
      </span>
    </span>
  )
}

interface DataSlotProps {
  top: string
  side: 'left' | 'right'
  offset: string
  align: 'left' | 'right'
  tier: 'core' | 'wide' | 'desktop'
  active: boolean
}

// One fixed background "packet" slot. Cycles its own text and timing independently once
// `active`, so the DOM node count never grows — only its content and a data-phase
// attribute change, which is what keeps this layer cheap at 60fps (requirement #15).
function DataSlot({ top, side, offset, align, tier, active }: DataSlotProps) {
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'idle' | 'live'>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!active) {
      clearTimeout(timeoutRef.current)
      setPhase('idle')
      return
    }
    timeoutRef.current = setTimeout(() => {
      setText(pickRandomEvent())
      setPhase('live')
    }, randomInt(300, 3600))
    return () => clearTimeout(timeoutRef.current)
  }, [active])

  function handleAnimationEnd() {
    setPhase('idle')
    timeoutRef.current = setTimeout(() => {
      setText(pickRandomEvent())
      setPhase('live')
    }, randomInt(1800, 5200))
  }

  return (
    <div className={styles.dataSlot} data-tier={tier} style={{ top, [side]: offset }}>
      <span className={styles.dataPacket} data-phase={phase} data-align={align} onAnimationEnd={handleAnimationEnd}>
        <span className={styles.dataMarker} />
        <span className={styles.dataLine} />
        <span className={styles.dataText}>{text}</span>
      </span>
    </div>
  )
}

export function DomainOnchainStats() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)
  const [count, setCount] = useState(START_VALUE)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => setActive(entry.isIntersecting)), { threshold: 0.25 })
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Irregular "block update" ticks (requirement #3) — never a fixed interval, so the
  // counter reads as data arriving from a live chain rather than a setInterval clock.
  useEffect(() => {
    if (!active) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let pulseTimer: ReturnType<typeof setTimeout>

    function tick() {
      if (cancelled) return
      setCount(c => c + (Math.random() < 0.12 ? 2 : 1))
      setPulse(true)
      pulseTimer = setTimeout(() => setPulse(false), 220)
      timer = setTimeout(tick, randomInt(700, 2300))
    }

    timer = setTimeout(tick, randomInt(500, 1400))
    return () => {
      cancelled = true
      clearTimeout(timer)
      clearTimeout(pulseTimer)
    }
  }, [active])

  const formatted = count.toLocaleString('en-US')
  const chars = formatted.split('')
  const total = chars.length

  return (
    <section className={styles.section} ref={sectionRef} data-active={active || undefined} aria-label="Live on-chain identity network statistics">
      <div className={styles.decor} aria-hidden="true" data-pulse={pulse || undefined}>
        <div className={styles.beam}>
          <span className={styles.beamLineWrap} data-side="left">
            <Image src="/landing/onchain-stats/beam-line-left.svg" alt="" fill className={styles.beamLine} unoptimized />
          </span>
          <span className={styles.beamLineWrap} data-side="right">
            <Image src="/landing/onchain-stats/beam-line-right.svg" alt="" fill className={styles.beamLine} unoptimized />
          </span>
          <span className={styles.beamPinWrap}>
            <Image src="/landing/onchain-stats/beam-subtract.svg" alt="" fill className={styles.beamPin} unoptimized />
          </span>
        </div>

        <span className={styles.lineWideTopWrap}>
          <Image src="/landing/onchain-stats/line-wide-top.svg" alt="" fill className={styles.lineWideTop} unoptimized />
        </span>

        {DATA_SLOTS.map(slot => (
          <DataSlot key={slot.id} top={slot.top} side={slot.side} offset={slot.offset} align={slot.align} tier={slot.tier} active={active} />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.titleBlock}>
          <div className={styles.labelWrap} data-pulse={pulse || undefined}>
            <span className={styles.labelBracketTL} />
            <span className={styles.labelBracketTR} />
            <span className={styles.labelBracketBL} />
            <span className={styles.labelBracketBR} />
            <p className={styles.labelText}>On-Chain Data &middot; Updated Every Block</p>
          </div>

          <div className={styles.counterWrap} data-pulse={pulse || undefined}>
            <span className={styles.srOnly}>{formatted} identities minted on-chain and counting</span>
            {chars.map((char, i) => {
              const posFromRight = total - 1 - i
              return char === ',' ? (
                <span className={styles.comma} key={`comma-${posFromRight}`} aria-hidden="true">
                  ,
                </span>
              ) : (
                <span aria-hidden="true" key={`digit-${posFromRight}`}>
                  <OdometerDigit digit={Number(char)} />
                </span>
              )
            })}
          </div>
        </div>

        <p className={styles.subLabel}>Identities Minted On-Chain</p>
      </div>

      <div className={styles.ctaZone}>
        <div className={styles.ctaDecor} aria-hidden="true" data-pulse={pulse || undefined}>
          <span className={styles.lineAboveCtaWrap}>
            <Image src="/landing/onchain-stats/line-wide-bottom.svg" alt="" fill className={styles.lineAboveCta} unoptimized />
          </span>
          <span className={styles.lineNarrowWrap}>
            <Image src="/landing/onchain-stats/line-narrow-bottom.svg" alt="" fill className={styles.lineNarrow} unoptimized />
          </span>
          <span className={styles.dot} data-position="left" />
          <span className={styles.dot} data-position="right" />
        </div>

        <div className={styles.ctaBar}>
          <Image src="/landing/onchain-stats/cta-bg.png" alt="" fill className={styles.ctaBg} unoptimized priority={false} />
          <span className={styles.ctaShimmer} />
          <p className={styles.ctaText}>
            Over 80% Of All Minted Web3 Identities Have Zero Earning Or Utility Activity In The Last 12 Months.
          </p>
          <button type="button" className={styles.ctaLink}>
            <span>View The Data</span>
            <Image src="/landing/onchain-stats/arrow-up-right.svg" alt="" width={24} height={24} unoptimized />
          </button>
        </div>
      </div>
    </section>
  )
}

export default DomainOnchainStats
