import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'
import styles from './Roadmap.module.scss'

gsap.registerPlugin(ScrollTrigger)

// ─── Coordinate system ───────────────────────────────────────────────────────
// ViewBox: 0 0 100 198.8  (same aspect ratio as 1297 × 2578 from milestone data)
// y = (milestone.py / 2578) * 198.8
// x = 10 for left checkpoints, 90 for right checkpoints
//     (year badges sit at left:1% / right:1% of the container;
//      10 and 90 out of 100 viewBox units map to ~10% and ~90% of container width)
//
// Checkpoint peaks (start → end of drawn path):
//   1. 2020   left  (10, 10.02)  ← path starts here
//   2. 2022   right (90, 32.74)
//   3. 2024   left  (10, 51.83)
//   4. Q22026 right (90, 74.49)
//   5. Q32026 left  (10, 118.78)
//   6. Q42026 right (90, 142.59)
//   7. 2027   left  (10, 167.37) ← path ends here
//
// Control points use 45 % of the y-delta on each side for smooth S-curves.

const PATH =
  'M 10 10.02 ' +
  'C 10 21.38 90 21.38 90 32.74 ' +
  'C 90 45.50 10 39.00 10 51.83 ' +
  'C 10 67.00 90 58.80 90 74.49 ' +
  'C 90 96.64 10 96.63 10 118.78 ' +
  'C 10 130.69 90 130.68 90 142.59 ' +
  'C 90 154.98 10 154.98 10 167.37'

interface Props {
  sectionRef: React.RefObject<HTMLElement>
}

export default function RoadmapPath({ sectionRef }: Props) {
  const glowRef = useRef<SVGPathElement>(null)
  const mainRef = useRef<SVGPathElement>(null)
  useLayoutEffect(() => {
    const glow = glowRef.current
    const main = mainRef.current
    if (!glow || !main || !sectionRef.current) return

    const len = main.getTotalLength()

    // Start fully hidden — dashoffset = full length means nothing is drawn yet
    glow.setAttribute('stroke-dasharray', String(len))
    glow.setAttribute('stroke-dashoffset', String(len))
    main.setAttribute('stroke-dasharray', String(len))
    main.setAttribute('stroke-dashoffset', String(len))

    const state = { progress: 0 }

    const ctx = gsap.context(() => {
      gsap.to(state, {
        progress: 1,
        ease: 'none',
        onUpdate() {
          const drawn = state.progress * len
          const offset = String(len - drawn)
          glow.setAttribute('stroke-dashoffset', offset)
          main.setAttribute('stroke-dashoffset', offset)
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          // section-relative percentages so the range scales with section height on every screen size
          // end matches when the 7th checkpoint (py=2173, progress=0.84) enters the viewport
          start: 'top 80%',
          end: '84% 70%',
          scrub: 1.8,
        },
      })

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    // viewBox matches the coordinate system above; height:auto lets intrinsic ratio size the container
    <svg
      className={styles.snake}
      viewBox="0 0 100 198.8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* design-specific: all params below are tuned to viewBox dimensions, do not tokenise */}

        {/* Fade gradient — offsets are fractions (0–1) of the gradient line y1=0 → y2=198.8
            checkpoint 1 sits at y=10.02 → 10.02/198.8 = 5.04%
            checkpoint 7 sits at y=167.37 → 167.37/198.8 = 84.19% */}
        <linearGradient id="rm_fade" x1="0" y1="0" x2="0" y2="198.8" gradientUnits="userSpaceOnUse">
          <stop offset="0%"      stopColor="#6573ff" stopOpacity="0" />
          <stop offset="5.04%"   stopColor="#6573ff" stopOpacity="0" />
          <stop offset="14%"     stopColor="#6573ff" stopOpacity="1" />
          <stop offset="74%"     stopColor="#6573ff" stopOpacity="1" />
          <stop offset="84.19%"  stopColor="#6573ff" stopOpacity="0" />
          <stop offset="100%"    stopColor="#6573ff" stopOpacity="0" />
        </linearGradient>

        <filter id="rm_glow" x="-60%" y="-2%" width="220%" height="104%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Guide track — faint ghost of the full path so users can read the shape before scrolling */}
      <path
        d={PATH}
        stroke="url(#rm_fade)"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.22"
      />

      {/* Glow layer — soft bloom, animates with main stroke */}
      <path
        ref={glowRef}
        d={PATH}
        stroke="url(#rm_fade)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.22"
        filter="url(#rm_glow)"
      />

      {/* Main crisp stroke */}
      <path
        ref={mainRef}
        d={PATH}
        stroke="url(#rm_fade)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.35"
      />

    </svg>
  )
}
