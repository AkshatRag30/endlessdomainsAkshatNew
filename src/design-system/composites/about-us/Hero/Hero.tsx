import { useEffect, useRef } from 'react'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import { runHeroEntrance, runGlowPulse, runMountainFlow, bindParallax } from './HeroAnimations'
import styles from './Hero.module.scss'

export default function Hero() {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const ctaRowRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const mountainAnimatorRef = useRef<HTMLDivElement>(null)
  const arcLeftRef = useRef<HTMLDivElement>(null)
  const arcRightRef = useRef<HTMLDivElement>(null)
  const poly1Ref = useRef<HTMLDivElement>(null)
  const poly2Ref = useRef<HTMLDivElement>(null)
  const poly3Ref = useRef<HTMLDivElement>(null)
  const poly4Ref = useRef<HTMLDivElement>(null)
  const poly5Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cleanupParallax: (() => void) | undefined

    const init = async () => {
      const { gsap } = await import('gsap')

      runHeroEntrance(gsap, {
        eyebrow: eyebrowRef,
        heading: headingRef,
        description: descriptionRef,
        ctaRow: ctaRowRef,
        glow: glowRef,
      })

      runGlowPulse(gsap, glowRef.current)

      runMountainFlow(gsap, mountainAnimatorRef.current, [
        poly1Ref.current,
        poly2Ref.current,
        poly3Ref.current,
        poly4Ref.current,
        poly5Ref.current,
      ])

      cleanupParallax = bindParallax(gsap, {
        arcLeft: arcLeftRef,
        arcRight: arcRightRef,
        glow: glowRef,
        mountain: mountainAnimatorRef,
      })
    }

    init()

    return () => {
      cleanupParallax?.()
    }
  }, [])

  return (
    <section className={styles.hero} aria-label="About Endless Domains">

      {/* Grid overlay */}
      <div className={styles.gridOverlay} aria-hidden="true">
        <div className={styles.hLine} data-pos="top" />
        <div className={styles.hLine} data-pos="bottom" />
        <div className={styles.vLine} data-pos="left" />
        <div className={styles.vLine} data-pos="right" />
      </div>

      {/* Dot texture */}
      <div className={styles.dotTexture} aria-hidden="true" />

      {/* Side arcs */}
      <div className={styles.arcLeft} ref={arcLeftRef} aria-hidden="true">
        <div className={styles.arc} />
        <div className={styles.arc} />
      </div>
      <div className={styles.arcRight} ref={arcRightRef} aria-hidden="true">
        <div className={styles.arc} />
        <div className={styles.arc} />
      </div>

      {/* Bottom mountain glow — animator has no filter so GSAP transforms are GPU-composited */}
      <div className={styles.mountainAnimator} ref={mountainAnimatorRef} aria-hidden="true">
        {/* Inner wrap holds the blur — never animated directly */}
        <div className={styles.mountainWrap} ref={glowRef}>
          <div className={`${styles.poly} ${styles.poly1}`} ref={poly1Ref} />
          <div className={`${styles.poly} ${styles.poly2}`} ref={poly2Ref} />
          <div className={`${styles.poly} ${styles.poly3}`} ref={poly3Ref} />
          <div className={`${styles.poly} ${styles.poly4}`} ref={poly4Ref} />
          <div className={`${styles.poly} ${styles.poly5}`} ref={poly5Ref} />
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>

        {/* Eyebrow */}
        <div className={styles.eyebrow} ref={eyebrowRef}>
          <span className={styles.eyebrowBracketTL} aria-hidden="true" />
          <span className={styles.eyebrowBracketTR} aria-hidden="true" />
          <span className={styles.eyebrowText}>IDENTITY OS · THE PEOPLE BEHIND THE PROTOCOL</span>
          <span className={styles.eyebrowBracketBL} aria-hidden="true" />
          <span className={styles.eyebrowBracketBR} aria-hidden="true" />
        </div>

        {/* Heading */}
        <h1 className={styles.heading} ref={headingRef}>
          <span className={styles.headingLine1}>We Did Not Build A Platform.</span>
          <span className={styles.headingLine2}>We Built The OS.</span>
        </h1>

        {/* Description */}
        <p className={styles.description} ref={descriptionRef}>
          Endless Domains is the OS powering the next generation of on-chain identity. Your identity lives
          on-chain, belongs to no one but you, and works across every wallet, application, and protocol that
          matters.
        </p>

        {/* CTAs */}
        <div className={styles.ctaRow} ref={ctaRowRef}>
          <SecondaryButton onClick={() => {}} transparent>Explore The Stack</SecondaryButton>
          <PrimaryButton icon={<span aria-hidden="true">→</span>} iconPosition="right" onClick={() => {}}>
            Claim Your Identity
          </PrimaryButton>
        </div>

      </div>
    </section>
  )
}
