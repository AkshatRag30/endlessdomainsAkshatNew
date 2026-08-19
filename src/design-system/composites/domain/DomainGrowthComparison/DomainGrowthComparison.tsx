import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'

import styles from './DomainGrowthComparison.module.scss'

// Historical-looking growth data for the left bar chart — a general upward trend with one
// standout peak, not a perfectly smooth ramp, so it reads as "real" history rather than a
// generic progress bar. Percent of the chart's own max height.
const BAR_HEIGHTS = [15, 21, 18, 29, 26, 39, 34, 51, 47, 72]
const DOMINANT_BAR_INDEX = 7

// The two data points the growth line passes through, extracted from the Figma frame's
// own marker positions, expressed as a fraction of the chart's viewBox so the curve is
// grounded in the real design rather than an invented shape.
const LINE_VIEWBOX = { width: 564, height: 220 }
const LINE_PATH = 'M 4 202 C 90 196, 170 190, 232 166 C 292 140, 352 122, 407 103 C 452 87, 500 48, 540 12'
const LINE_POINTS: Array<{ x: number; y: number; label: string; value: string; side: 'above' | 'below'; align: 'center' | 'end' }> = [
  { x: 407, y: 103, label: 'Web3 Identity', value: '+36$', side: 'above', align: 'center' },
  // This point sits right at the top-right corner of the chart — a callout floating
  // above and centered on it would clip against both the top and right edges of the
  // card, so it drops below the point and right-aligns onto it instead.
  { x: 540, y: 12, label: 'Web3 Identity', value: '+36$', side: 'below', align: 'end' },
]

function useHoverOrViewportActive() {
  const groupRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [supportsHover, setSupportsHover] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setSupportsHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Touch/tablet has no reliable hover, so the whole comparison activates once when it
  // enters the viewport instead (requirement: "mobile = viewport activation").
  useEffect(() => {
    if (supportsHover || typeof window === 'undefined' || !groupRef.current) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => setActive(entry.isIntersecting)), { threshold: 0.4 })
    observer.observe(groupRef.current)
    return () => observer.disconnect()
  }, [supportsHover])

  const handleEnter = () => supportsHover && setActive(true)
  const handleLeave = () => supportsHover && setActive(false)

  return { groupRef, active, reducedMotion, handleEnter, handleLeave }
}

interface BarChartProps {
  active: boolean
}

// Bars grow from the bottom via scaleY (transform-origin: bottom), not height, so the
// reveal never triggers layout — each bar is staggered a little so the chart reads as one
// fluid sweep left→right rather than independent bars popping in.
function BarChart({ active }: BarChartProps) {
  return (
    <div className={styles.barChart} data-active={active || undefined} aria-hidden="true">
      {BAR_HEIGHTS.map((height, i) => (
        <span
          key={i}
          className={styles.bar}
          data-dominant={i === DOMINANT_BAR_INDEX || undefined}
          style={{ height: `${height}%`, transitionDelay: active ? `${i * 55}ms` : `${(BAR_HEIGHTS.length - i) * 25}ms` }}
        />
      ))}
    </div>
  )
}

interface GrowthLineProps {
  active: boolean
}

// The line "draws" via stroke-dasharray/-dashoffset (one continuous path, not per-segment
// DOM nodes), and each data point/label fades in once the draw has reached its position
// along the path — timed off the same active flag, no per-frame JS.
function GrowthLine({ active }: GrowthLineProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(1)

  useLayoutEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength())
  }, [])

  return (
    <div className={styles.lineChart} data-active={active || undefined} aria-hidden="true">
      <svg className={styles.lineSvg} viewBox={`0 0 ${LINE_VIEWBOX.width} ${LINE_VIEWBOX.height}`} preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="growthLineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-white-alpha-40)" />
            <stop offset="100%" stopColor="var(--color-white-alpha-08)" />
          </linearGradient>
        </defs>
        <path
          className={styles.lineFill}
          d={`${LINE_PATH} L 540 220 L 4 220 Z`}
          fill="url(#growthLineFill)"
        />
        <path
          ref={pathRef}
          className={styles.linePath}
          d={LINE_PATH}
          stroke="var(--color-white-primary)"
          strokeWidth={2}
          strokeLinecap="round"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: active ? 0 : pathLength,
          }}
        />
        {LINE_POINTS.map((point, i) => (
          <circle
            key={i}
            className={styles.linePoint}
            data-active={active || undefined}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="var(--color-white-primary)"
            style={{ transitionDelay: active ? `${450 + i * 250}ms` : '0ms' }}
          />
        ))}
      </svg>

      {LINE_POINTS.map((point, i) => (
        <div
          key={i}
          className={styles.lineCallout}
          data-active={active || undefined}
          data-side={point.side}
          data-align={point.align}
          style={{
            left: `${(point.x / LINE_VIEWBOX.width) * 100}%`,
            top: `${(point.y / LINE_VIEWBOX.height) * 100}%`,
            transitionDelay: active ? `${600 + i * 250}ms` : '0ms',
          }}
        >
          {point.side === 'above' && <span className={styles.lineCalloutLeader} />}
          <span className={styles.lineCalloutPill}>
            <span className={styles.lineCalloutLabel}>{point.label}</span>
            <span className={styles.lineCalloutValue}>{point.value}</span>
          </span>
          {point.side === 'below' && <span className={styles.lineCalloutLeader} />}
        </div>
      ))}
    </div>
  )
}

export function DomainGrowthComparison() {
  const { groupRef, active, reducedMotion, handleEnter, handleLeave } = useHoverOrViewportActive()

  return (
    <section className={styles.section} aria-labelledby="growth-comparison-heading">
      <div className={styles.header}>
        <div className={styles.headingBlock}>
          <div className={styles.eyebrowWrap}>
            <span className={styles.eyebrowBracketTL} />
            <span className={styles.eyebrowBracketTR} />
            <span className={styles.eyebrowBracketBL} />
            <span className={styles.eyebrowBracketBR} />
            <p className={styles.eyebrowText}>Growth Comparison</p>
          </div>

          <h2 id="growth-comparison-heading" className={styles.heading}>
            <span className={styles.headingLine1}>A Resale Market </span>
            <span className={styles.headingLine2}>That Hasn&apos;t Started Yet</span>
          </h2>
        </div>

        <p className={styles.description}>
          Domain resale took three decades to become a $290M-a-year market. Every measurable onchain identity namespace combined still clears less than $4M of
          that, which is the entire opportunity.
        </p>
      </div>

      <div
        className={styles.cardGroup}
        ref={groupRef}
        data-reduced-motion={reducedMotion || undefined}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div className={styles.card} data-variant="web2">
          <p className={styles.cardLabel}>
            <span className={styles.cardLabelBullet} aria-hidden="true" />
            Web2 domain resale &middot; mature market
          </p>

          <div className={styles.chartArea}>
            <BarChart active={active} />
          </div>
          <span className={styles.glowVeil} data-active={active || undefined} />

          <div className={styles.contentPanel}>
            <span className={styles.cardValue}>$290M</span>
            <p className={styles.cardDesc}>2026 full-year est., up from $244M in 2025. A liquid market, three decades in the making.</p>
            <div className={styles.ctaRow}>
              <button type="button" className={styles.ctaButton}>
                Visit Website
              </button>
              <a className={styles.ctaLink} href="https://namebio.com" target="_blank" rel="noreferrer">
                <span>NameBio 2025</span>
                <Image src="/landing/onchain-stats/arrow-up-right.svg" alt="" width={20} height={20} unoptimized />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.card} data-variant="web3">
          <span className={styles.lightStreak} data-position="a" />
          <span className={styles.lightStreak} data-position="b" />

          <p className={styles.cardLabel} data-on-blue>
            <span className={styles.cardLabelBullet} aria-hidden="true" />
            Web3 identity resale &middot; ground floor
          </p>

          <div className={styles.chartArea}>
            <GrowthLine active={active} />
          </div>
          <span className={styles.glowVeil} data-active={active || undefined} />

          <div className={styles.contentPanel}>
            <span className={styles.cardValue}>$3.86M</span>
            <p className={styles.cardDesc}>
              secondary volume in the trailing 365 days, across every measurable onchain identity namespace combined. ENS alone is 70% of it, and 99.9% of that
              routes through OpenSea.
            </p>
            <div className={styles.ctaRow}>
              <button type="button" className={styles.ctaButton}>
                Visit Website
              </button>
              <a className={styles.ctaLink} href="https://dune.com" target="_blank" rel="noreferrer">
                <span>Dune Analytics, July 2026 &middot; trailing 365 days</span>
                <Image src="/landing/onchain-stats/arrow-up-right.svg" alt="" width={20} height={20} unoptimized />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DomainGrowthComparison
