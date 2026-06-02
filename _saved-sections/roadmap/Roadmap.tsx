import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'
import RoadmapCheckpoints, { MILESTONES } from './RoadmapCheckpoints'
import RoadmapMobileList from './RoadmapMobileList'
import RoadmapPath from './RoadmapPath'
import styles from './Roadmap.module.scss'

gsap.registerPlugin(ScrollTrigger)

export default function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const checkRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Use the snakeWrap (not the section) as the trigger so the trigger height equals
      // the SVG height. The section includes header + padding above the snake, which
      // inflates the trigger height and pushes the 84% mark beyond the reachable scroll
      // range on short mobile screens.
      checkRefs.current.forEach((el, i) => {
        if (!el) return

        const m = MILESTONES[i]
        const nextM = MILESTONES[i + 1]

        gsap.set(el, { opacity: 0 })

        const startPct = Math.round(m.progress * 100)
        const endPct = nextM ? Math.round(nextM.progress * 100) : startPct + 12

        ScrollTrigger.create({
          trigger: wrapRef.current,
          start: `${startPct}% 72%`,
          end: `${endPct}% 72%`,
          onEnter: () => gsap.to(el, { opacity: 1, duration: 0.9, ease: 'power1.out', overwrite: true }),
          onLeave: () => gsap.to(el, { opacity: 0, duration: 0.55, ease: 'power1.in', overwrite: true }),
          onEnterBack: () => gsap.to(el, { opacity: 1, duration: 0.9, ease: 'power1.out', overwrite: true }),
          onLeaveBack: () => gsap.to(el, { opacity: 0, duration: 0.55, ease: 'power1.in', overwrite: true }),
        })
      })

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.journeyLabel}>
          <span className={styles.bracket}>[</span>
          THE JOURNEY
          <span className={styles.bracket}>]</span>
        </div>
        <h2 className={styles.heading}>
          We started in 2020.<br />
          <span className={styles.headingBlue}>Here Is What We Built.</span>
        </h2>
        <p className={styles.subtext}>
          Your username on Instagram belongs to Instagram. They can delete it anytime.
          We are building a world where your name on the internet is yours forever.
        </p>
      </div>

      {/* ── Desktop/tablet: animated snake + checkpoints ─────────────── */}
      <div ref={wrapRef} className={styles.snakeWrap}>
        <RoadmapPath sectionRef={sectionRef} />
        <RoadmapCheckpoints onRef={(el, i) => { checkRefs.current[i] = el }} />
      </div>

      {/* ── Mobile: vertical timeline list ────────────────────────────── */}
      <RoadmapMobileList />

    </section>
  )
}
