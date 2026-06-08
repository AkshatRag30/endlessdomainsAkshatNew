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
          d="M-200 24 C-189 18 -178 18 -167 24 C-156 30 -145 30 -134 24 C-123 18 -112 18 -101 24 C-90 30 -79 30 -68 24 C-57 18 -46 18 -35 24 C-24 30 -13 30 -2 24 C9 18 20 18 31 24 C42 30 53 30 64 24 C75 18 86 18 97 24 C108 30 119 30 130 24 C141 18 152 18 163 24 C174 30 185 30 196 24 V60 H-200 Z"
          fill="white"
          opacity={0.35}
        />
      </g>
      <g className={styles.waveFront}>
        <path
          d="M-200 26 C-189 20 -178 20 -167 26 C-156 32 -145 32 -134 26 C-123 20 -112 20 -101 26 C-90 32 -79 32 -68 26 C-57 20 -46 20 -35 26 C-24 32 -13 32 -2 26 C9 20 20 20 31 26 C42 32 53 32 64 26 C75 20 86 20 97 26 C108 32 119 32 130 26 C141 20 152 20 163 26 C174 32 185 32 196 26 V60 H-200 Z"
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
