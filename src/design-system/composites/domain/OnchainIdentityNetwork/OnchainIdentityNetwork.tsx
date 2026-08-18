import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { PiWalletBold, PiShareNetworkBold, PiPlugsConnectedBold, PiEnvelopeBold, PiKeyholeBold, PiSealCheckBold } from 'react-icons/pi'

import { createProgressController, PHASES } from './OnchainIdentityNetworkAnimation'
import styles from './OnchainIdentityNetwork.module.scss'

interface Point {
  x: number
  y: number
}

interface IdentityNode {
  id: string
  title: string
  desc: string
  Icon: typeof PiWalletBold
  xPercent: number
  yPercent: number
  side: 'left' | 'right'
  row: 'top' | 'mid' | 'bottom'
  windowStart: number
  windowEnd: number
}

// Rows spaced 32 percentage points apart (18/50/82) — generous enough that a two-line
// description in one row never runs into the next row's title, with the core aligned
// on the middle row per the original design intent.
const NODES: IdentityNode[] = [
  {
    id: 'wallet',
    title: 'Wallet Identity',
    desc: 'Replace 0x7f3c9a2… with one human-readable name.',
    Icon: PiWalletBold,
    xPercent: 9,
    yPercent: 18,
    side: 'left',
    row: 'top',
    windowStart: PHASES[0].start,
    windowEnd: PHASES[0].end,
  },
  {
    id: 'social',
    title: 'Social Identity',
    desc: 'One verified handle across every social. Your reputation follows you.',
    Icon: PiShareNetworkBold,
    xPercent: 91,
    yPercent: 18,
    side: 'right',
    row: 'top',
    windowStart: PHASES[0].start,
    windowEnd: PHASES[0].end,
  },
  {
    id: 'dapp',
    title: 'DApp Identity',
    desc: 'Your passport into DeFi, DAOs and games. Connect once, known everywhere.',
    Icon: PiPlugsConnectedBold,
    xPercent: 9,
    yPercent: 50,
    side: 'left',
    row: 'mid',
    windowStart: PHASES[1].start,
    windowEnd: PHASES[1].end,
  },
  {
    id: 'mail',
    title: 'Mail Identity',
    desc: 'Send and receive mail at your name. No Gmail landlord.',
    Icon: PiEnvelopeBold,
    xPercent: 91,
    yPercent: 50,
    side: 'right',
    row: 'mid',
    windowStart: PHASES[1].start,
    windowEnd: PHASES[1].end,
  },
  {
    id: 'login',
    title: 'Login Identity',
    desc: 'Passwordless sign-in. Your identity is the key.',
    Icon: PiKeyholeBold,
    xPercent: 9,
    yPercent: 82,
    side: 'left',
    row: 'bottom',
    windowStart: PHASES[2].start,
    windowEnd: PHASES[2].end,
  },
  {
    id: 'brand',
    title: 'Brand Identity',
    desc: 'Your name is your brand. Own it outright, no landlord.',
    Icon: PiSealCheckBold,
    xPercent: 91,
    yPercent: 82,
    side: 'right',
    row: 'bottom',
    windowStart: PHASES[2].start,
    windowEnd: PHASES[2].end,
  },
]

// The top/bottom connector shape is reverse-engineered from the exported topconnector.svg
// / bottomconnector.svg: each is M(core) → L(diagonal launch) → C(bend that arrives dead
// flat) → L(horizontal run to the hex). These fractions are that exact curve's proportions
// (measured off its own path data). Everything here runs on REAL, MEASURED pixel
// coordinates — core and hex centers read straight from the DOM via getBoundingClientRect
// — instead of assumed positions in an abstract coordinate system, so there is no unit
// mismatch left to produce a gap: the path always starts and ends exactly where the core
// and hex actually are, at any screen size.
const LAUNCH_FRACTION = { x: 0.598, y: 0.7834 }
const CURVE_C1_FRACTION = { x: 0.263, y: 0.6396 }
const CURVE_C2_FRACTION_X = 0.6237
const BEND_X_FRACTION = 0.72 // how far across the real core→hex distance the curve straightens out

interface CurveGeometry {
  launch: Point
  control1: Point
  control2: Point
  bend: Point
}

function buildCurveGeometry(core: Point, hex: Point): CurveGeometry {
  const dx = hex.x - core.x
  const bend = { x: core.x + dx * BEND_X_FRACTION, y: hex.y }

  const launch = {
    x: core.x + LAUNCH_FRACTION.x * (bend.x - core.x),
    y: core.y + LAUNCH_FRACTION.y * (bend.y - core.y),
  }
  const control1 = {
    x: launch.x + CURVE_C1_FRACTION.x * (bend.x - launch.x),
    y: launch.y + CURVE_C1_FRACTION.y * (bend.y - launch.y),
  }
  const control2 = {
    x: launch.x + CURVE_C2_FRACTION_X * (bend.x - launch.x),
    y: bend.y, // matches the reference exactly: arrives perfectly flat
  }

  return { launch, control1, control2, bend }
}

function pathFromGeometry(core: Point, geo: CurveGeometry, hex: Point) {
  return `M ${core.x} ${core.y} L ${geo.launch.x} ${geo.launch.y} C ${geo.control1.x} ${geo.control1.y} ${geo.control2.x} ${geo.control2.y} ${geo.bend.x} ${geo.bend.y} L ${hex.x} ${hex.y}`
}

export function OnchainIdentityNetwork() {
  const sectionRef = useRef<HTMLElement>(null)
  const networkRef = useRef<HTMLDivElement>(null)
  const coreMarkRef = useRef<HTMLDivElement>(null)
  const nodeHexRefs = useRef<(HTMLElement | null)[]>([])
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const glowPathRefs = useRef<(SVGPathElement | null)[]>([])
  const dashPathRefs = useRef<(SVGPathElement | null)[]>([])
  const nodeRefs = useRef<(HTMLElement | null)[]>([])
  const nodeTextRefs = useRef<(HTMLElement | null)[]>([])

  const [activePhase, setActivePhase] = useState(-1)
  const [canvas, setCanvas] = useState({ width: 1000, height: 430 })
  const [paths, setPaths] = useState<string[]>(() => NODES.map(() => ''))

  // Measures the real, rendered positions of the core and every hex icon and rebuilds
  // every path from those exact points — see the comment above buildCurveGeometry.
  useEffect(() => {
    if (typeof window === 'undefined' || !networkRef.current || !coreMarkRef.current) return
    const networkEl = networkRef.current

    function recompute() {
      const containerRect = networkEl.getBoundingClientRect()
      const coreEl = coreMarkRef.current
      if (!coreEl || containerRect.width === 0 || containerRect.height === 0) return

      const coreRect = coreEl.getBoundingClientRect()
      const core: Point = {
        x: coreRect.left + coreRect.width / 2 - containerRect.left,
        y: coreRect.top + coreRect.height / 2 - containerRect.top,
      }

      function hexCenter(index: number): Point | null {
        const el = nodeHexRefs.current[index]
        if (!el) return null
        const r = el.getBoundingClientRect()
        return { x: r.left + r.width / 2 - containerRect.left, y: r.top + r.height / 2 - containerRect.top }
      }

      const nextPaths: string[] = NODES.map(() => '')
      const rows: IdentityNode['row'][] = ['top', 'mid', 'bottom']

      rows.forEach(row => {
        const leftIndex = NODES.findIndex(n => n.row === row && n.side === 'left')
        const rightIndex = NODES.findIndex(n => n.row === row && n.side === 'right')
        const leftHex = hexCenter(leftIndex)
        const rightHex = hexCenter(rightIndex)
        if (!leftHex || !rightHex) return

        if (row === 'mid') {
          nextPaths[leftIndex] = `M ${core.x} ${core.y} L ${leftHex.x} ${leftHex.y}`
          nextPaths[rightIndex] = `M ${core.x} ${core.y} L ${rightHex.x} ${rightHex.y}`
          return
        }

        // Each side builds its own curve from its own real hex position, so it always
        // arrives dead flat exactly at that hex with no seam. (Mirroring one side's
        // shape onto the other was tried and reverted — it copied the left side's bend
        // height onto a curve that still had to end at the right hex's own, slightly
        // different, real Y, which showed up as a visible kink right before the hex.)
        nextPaths[leftIndex] = pathFromGeometry(core, buildCurveGeometry(core, leftHex), leftHex)
        nextPaths[rightIndex] = pathFromGeometry(core, buildCurveGeometry(core, rightHex), rightHex)
      })

      setCanvas({ width: containerRect.width, height: containerRect.height })
      setPaths(nextPaths)
    }

    recompute()
    const ro = new ResizeObserver(recompute)
    ro.observe(networkEl)
    window.addEventListener('resize', recompute)
    // Catches a late reflow from web font swap-in, which can shift text (and therefore
    // hex) positions slightly after the very first measurement.
    const raf = requestAnimationFrame(recompute)
    // On a cold hard refresh, the very first recompute above can run before the custom
    // web fonts and the window's own 'load' event have settled, so it measures against
    // not-yet-final layout — the geometry only gets corrected once something else (like
    // toggling DevTools) fires a resize. Re-measuring once fonts finish loading and once
    // the whole page has fully loaded closes that gap without waiting on an unrelated event.
    let cancelled = false
    window.addEventListener('load', recompute)
    if (document.fonts?.ready) document.fonts.ready.then(() => !cancelled && recompute())

    return () => {
      cancelled = true
      ro.disconnect()
      window.removeEventListener('resize', recompute)
      window.removeEventListener('load', recompute)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cleanup: (() => void) | undefined

    import('gsap').then(({ gsap }) => {
      if (!sectionRef.current) return

      const pathLengths = pathRefs.current.map(el => el?.getTotalLength() ?? 0)
      pathRefs.current.forEach((el, i) => {
        if (!el) return
        el.style.strokeDasharray = `${pathLengths[i]}`
      })
      glowPathRefs.current.forEach((el, i) => {
        if (!el) return
        el.style.strokeDasharray = `${pathLengths[i]}`
      })

      const controller = createProgressController(gsap, {
        sectionEl: sectionRef.current,
        refs: {
          coreMark: coreMarkRef.current,
          paths: pathRefs.current,
          glowPaths: glowPathRefs.current,
          dashPaths: dashPathRefs.current,
          pathLengths,
          nodes: nodeRefs.current,
          nodeTexts: nodeTextRefs.current,
        },
        nodeWindows: NODES.map(n => ({ start: n.windowStart, end: n.windowEnd })),
        reducedMotion,
        onPhaseChange: setActivePhase,
      })
      cleanup = controller.destroy
    })

    return () => cleanup?.()
    // Re-runs whenever the measured paths change (initial measurement, resize, or the
    // font-swap re-measurement) — the path 'd' strings change with them, so pathLengths
    // has to be re-measured too or the stroke-dashoffset reveal scrubs against a stale
    // length.
  }, [paths])

  return (
    <section className={styles.section} ref={sectionRef} aria-labelledby="onchain-identity-heading">
      <div className={styles.sticky}>
        <div className={styles.stage}>
          <header className={styles.header}>
            <div className={styles.eyebrowWrap}>
              <span className={styles.eyebrowBracketL} aria-hidden="true" />
              <span className={styles.eyebrowText}>One Domain, Every Identity</span>
              <span className={styles.eyebrowBracketR} aria-hidden="true" />
            </div>
            <h2 id="onchain-identity-heading" className={styles.heading}>
              <span className={styles.headingLine1}>One Domain Becomes Your</span>
              <span className={styles.headingLine2}>Whole Onchain Identity</span>
            </h2>
            <p className={styles.description}>
              Your onchain domain sits at the center. Every ray is something it becomes: one name radiating out into your whole
              presence on the internet.
            </p>
          </header>

          <div className={styles.network} ref={networkRef}>
            <svg className={styles.connections} viewBox={`0 0 ${canvas.width} ${canvas.height}`} aria-hidden="true">
              <defs>
                {/* Matches topconnector.svg / bottomconnector.svg's own gradient stops exactly */}
                <linearGradient id="identityPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-blue-primary-alpha-70)" />
                  <stop offset="30.9%" stopColor="var(--color-blue-primary-alpha-25)" />
                  <stop offset="100%" stopColor="var(--color-purple-glow-0)" />
                </linearGradient>
              </defs>
              {NODES.map((node, i) => (
                <g key={node.id}>
                  <path
                    ref={el => {
                      pathRefs.current[i] = el
                    }}
                    d={paths[i]}
                    fill="none"
                    stroke="url(#identityPathGradient)"
                    strokeWidth={9}
                    strokeLinecap="round"
                    className={styles.connectionPath}
                  />
                  <path
                    ref={el => {
                      glowPathRefs.current[i] = el
                    }}
                    d={paths[i]}
                    fill="none"
                    stroke="var(--color-white-alpha-70)"
                    strokeWidth={4.5}
                    strokeLinecap="round"
                    className={styles.connectionPath}
                  />
                  <path
                    ref={el => {
                      dashPathRefs.current[i] = el
                    }}
                    d={paths[i]}
                    fill="none"
                    stroke="var(--color-white-primary)"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    className={styles.connectionDash}
                  />
                </g>
              ))}
            </svg>

            <div className={styles.core}>
              <div className={styles.coreMark} ref={coreMarkRef}>
                <Image
                  src="/landing/centerlogo2.svg"
                  alt="Onchain Domains identity mark"
                  width={560}
                  height={560}
                  className={styles.coreLogo}
                  unoptimized
                />
              </div>
            </div>

            {NODES.map((node, i) => (
              <div
                key={node.id}
                className={styles.node}
                data-side={node.side}
                style={{ left: `${node.xPercent}%`, top: `${node.yPercent}%` }}
                ref={el => {
                  nodeRefs.current[i] = el
                }}
              >
                <span
                  className={styles.nodeHex}
                  aria-hidden="true"
                  ref={el => {
                    nodeHexRefs.current[i] = el
                  }}
                >
                  <span className={styles.nodeHexGlow} />
                  <node.Icon size={20} />
                </span>
                <div
                  className={styles.nodeText}
                  ref={el => {
                    nodeTextRefs.current[i] = el
                  }}
                >
                  <h3 className={styles.nodeTitle}>{node.title}</h3>
                  <p className={styles.nodeDesc}>{node.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* <div className={styles.statusReadout}>
            <span className={styles.statusDot} data-live={activePhase >= 0 || undefined} aria-hidden="true" />
            <span>Identity network &middot; {Math.max(0, activePhase + 1) * 2}/6 connected</span>
          </div> */}
        </div>
      </div>
    </section>
  )
}

export default OnchainIdentityNetwork
