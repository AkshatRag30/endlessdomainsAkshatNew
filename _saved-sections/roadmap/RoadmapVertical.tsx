import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'
import { MILESTONES } from './RoadmapCheckpoints'
import roadmapStyles from './Roadmap.module.scss'
import styles from './RoadmapVertical.module.scss'

gsap.registerPlugin(ScrollTrigger)

const VPATH = 'M 10 0 L 10 100'

interface Props {
  sectionRef: React.RefObject<HTMLElement>
}

export default function RoadmapVertical({ sectionRef }: Props) {
  const glowRef   = useRef<SVGPathElement>(null)
  const mainRef   = useRef<SVGPathElement>(null)
  const dotRefs   = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const glow = glowRef.current
    const main = mainRef.current
    if (!glow || !main || !sectionRef.current) return

    const len = main.getTotalLength()

    glow.setAttribute('stroke-dasharray', String(len))
    glow.setAttribute('stroke-dashoffset', String(len))
    main.setAttribute('stroke-dasharray', String(len))
    main.setAttribute('stroke-dashoffset', String(len))

    // Hide all dots to start
    dotRefs.current.forEach(d => d && gsap.set(d, { opacity: 0 }))

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
          start: 'top 80%',
          end: '95% 70%',
          scrub: 3,
        },
      })

      // Reveal each dot when the scroll reaches that checkpoint's position on the path
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return
        const m = MILESTONES[i]
        // map milestone progress (0–1) into the 0–90% scroll range used by the path animation
        const triggerPct = Math.round(m.progress * 90)
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: `${triggerPct}% 70%`,
          onEnter:     () => gsap.to(dot, { opacity: 1, duration: 0.5, ease: 'power1.out' }),
          onLeaveBack: () => gsap.to(dot, { opacity: 0, duration: 0.3, ease: 'power1.in' }),
        })
      })

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <div className={styles.wrap}>
      {/* Animated vertical path */}
      <div className={styles.lineWrap} aria-hidden="true">
        <svg
          className={styles.lineSvg}
          viewBox="0 0 20 100"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* design-specific: gradient + filter params tuned to this viewBox */}
            <linearGradient id="rmv_fade" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#6573ff" stopOpacity="0" />
              <stop offset="4%"   stopColor="#6573ff" stopOpacity="1" />
              <stop offset="96%"  stopColor="#6573ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#6573ff" stopOpacity="0" />
            </linearGradient>

            {/* design-specific: filter spans full viewBox width so glow spreads horizontally */}
            <filter id="rmv_glow" x="0" y="-2" width="20" height="104" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

          </defs>

          {/* Guide track */}
          <path d={VPATH} stroke="url(#rmv_fade)" strokeWidth="1.5" opacity="0.22" />

          {/* Glow layer */}
          <path
            ref={glowRef}
            d={VPATH}
            stroke="url(#rmv_fade)"
            strokeWidth="6"
            opacity="0.22"
            filter="url(#rmv_glow)"
          />

          {/* Main crisp stroke */}
          <path
            ref={mainRef}
            d={VPATH}
            stroke="url(#rmv_fade)"
            strokeWidth="2"
            opacity="0.35"
          />

        </svg>

      </div>

      {/* Checkpoint cards */}
      {MILESTONES.map((m, i) => (
        <div key={i} className={styles.item}>
          <div
            ref={el => { dotRefs.current[i] = el }}
            className={styles.pathDot}
            aria-hidden="true"
          />
          <div className={styles.card}>
            <span className={roadmapStyles.yearBadge}>{m.year}</span>
            <div className={roadmapStyles.cpContent}>
              <h3 className={styles.title}>{m.title}</h3>
              <p className={styles.desc}>{m.description}</p>
              <div className={roadmapStyles.tags}>
                {m.tags.map((tag, ti) => (
                  <span key={ti} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
