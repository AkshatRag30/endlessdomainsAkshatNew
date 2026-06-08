import { useState, useCallback, useEffect } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import styles from './ScoreLoading.module.scss'

const FUN_FACTS = [
  'Endless Identitys has 450+ wallet integrations across EVM, Non-EVM, and Solana. Your .og identity resolves everywhere you already are.',
  'Your .og identity is permanent. No renewals. No expiry. No middlemen. One transaction and it is yours forever.',
  'Over 1 billion people hold on-chain assets globally. Only 9.2 million have an on-chain identity. You are in a rare group.',
  'Your reputation score runs from 0 to 1000 and updates every single day. The more you show up on-chain, the higher it climbs.',
  'Missing a GM streak is recorded in the OS Memory forever. The OS never forgets. Which means consistency is the most valuable thing you can build.',
  'Your reputation tier unlocks partner rewards, whitelist slots, and early access automatically. No applications. No waiting. The OS already knows your score.',
  'The on-chain economy built payments, trust, and data infrastructure over a decade. Endless Identitys built the missing fourth layer: identity.',
]


const WaveLoader = () => (
  <svg className={styles.waveSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <circle cx="21.6471" cy="21.6471" r="20.2941" stroke="white" strokeWidth="2.70588" />
    <mask id="score-wave-mask">
      <circle cx="21.6471" cy="21.6471" r="16.2353" fill="white" />
    </mask>
    <g mask="url(#score-wave-mask)">
      <g className={styles.waveBack}>
        <path
          d="M-44 24 C-33 18 -22 18 -11 24 C0 30 11 30 22 24 C33 18 44 18 55 24 C66 30 77 30 88 24 V60 H-44 Z"
          fill="white"
          opacity={0.35}
        />
      </g>
      <g className={styles.waveFront}>
        <path
          d="M-44 26 C-33 20 -22 20 -11 26 C0 32 11 32 22 26 C33 20 44 20 55 26 C66 32 77 32 88 26 V60 H-44 Z"
          fill="white"
        />
      </g>
    </g>
  </svg>
)

export default function ScoreLoading() {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => setCurrent(i => (i === 0 ? FUN_FACTS.length - 1 : i - 1)), [])
  const next = useCallback(() => setCurrent(i => (i === FUN_FACTS.length - 1 ? 0 : i + 1)), [])

  useEffect(() => {
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [next])

  return (
    <div className={styles.root}>
      <div className={styles.card}>

        {/* Wave loader */}
        <div className={styles.illustrationWrap}>
          <div className={styles.outerRing} aria-hidden="true">
            <div className={styles.innerCircle}>
              <WaveLoader />
            </div>
          </div>
          <div className={styles.shadowEllipse} aria-hidden="true" />
        </div>

        {/* Heading + subtitle */}
        <div className={styles.textBlock}>
          <h2 className={styles.heading}>Calculating your score...</h2>
          <p className={styles.subtitle}>Reading your on-chain history. Usually around 30 seconds.</p>
        </div>

        {/* Progress bar */}
        <div className={styles.progressTrack} role="progressbar" aria-label="Loading progress">
          <div className={styles.progressFill} />
        </div>

        {/* Did you know card */}
        <div className={styles.factCard}>
          <span className={styles.factBadge}>Did you know</span>
          <p className={styles.factText}>{FUN_FACTS[current]}</p>
        </div>

        {/* Slider navigation */}
        <div className={styles.factNav}>
          <button type="button" className={styles.navArrow} onClick={prev} aria-label="Previous fact">
            <HiChevronLeft size={22} aria-hidden="true" />
          </button>
          <div className={styles.dots} role="tablist" aria-label="Fact navigation">
            {FUN_FACTS.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Fact ${i + 1}`}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
          <button type="button" className={styles.navArrow} onClick={next} aria-label="Next fact">
            <HiChevronRight size={22} aria-hidden="true" />
          </button>
        </div>

      </div>
    </div>
  )
}
