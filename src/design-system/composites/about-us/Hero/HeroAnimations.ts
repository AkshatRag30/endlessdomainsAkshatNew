import type { RefObject } from 'react'
import type { gsap as GsapType } from 'gsap'

export function runHeroEntrance(
  gsap: typeof GsapType,
  refs: {
    eyebrow: RefObject<HTMLElement>
    heading: RefObject<HTMLElement>
    description: RefObject<HTMLElement>
    ctaRow: RefObject<HTMLElement>
    glow: RefObject<HTMLElement>
  },
) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo(
    refs.eyebrow.current,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7 },
  )
    .fromTo(
      refs.heading.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1 },
      '-=0.4',
    )
    .fromTo(
      refs.description.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.6',
    )
    .fromTo(
      refs.ctaRow.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
      '-=0.5',
    )

  return tl
}

export function runGlowPulse(gsap: typeof GsapType, glowEl: HTMLElement | null) {
  if (!glowEl) return
  gsap.to(glowEl, {
    scale: 1.08,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
}

// All looping polygon animations removed — mouse interaction drives movement instead.
export function runMountainFlow(
  _gsap: typeof GsapType,
  _animator: HTMLElement | null,
  _polys: (HTMLElement | null)[],
) {}

export function bindParallax(
  gsap: typeof GsapType,
  refs: {
    arcLeft: RefObject<HTMLElement>
    arcRight: RefObject<HTMLElement>
    glow: RefObject<HTMLElement>
    mountain?: RefObject<HTMLElement>
  },
) {
  const handleMove = (e: MouseEvent) => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    // -1 to +1 normalised cursor position
    const dx = (e.clientX - cx) / cx
    const dy = (e.clientY - cy) / cy

    gsap.to(refs.arcLeft.current, {
      x: dx * -10,
      y: dy * -8,
      duration: 1.2,
      ease: 'power1.out',
    })

    gsap.to(refs.arcRight.current, {
      x: dx * 10,
      y: dy * -8,
      duration: 1.2,
      ease: 'power1.out',
    })

    gsap.to(refs.glow.current, {
      x: dx * 15,
      y: dy * 10,
      duration: 1.6,
      ease: 'power1.out',
    })

    // Mountain polygon follows cursor:
    //   x  — peak drifts left/right with the cursor (larger range for dramatic feel)
    //   y  — peak rises slightly when cursor is high, drops when low
    //   skewX — shape leans in the direction of horizontal movement
    if (refs.mountain?.current) {
      gsap.to(refs.mountain.current, {
        x: dx * 80,
        y: dy * 30,
        skewX: dx * 6,
        duration: 1.8,
        ease: 'power2.out',
      })
    }
  }

  window.addEventListener('mousemove', handleMove)
  return () => window.removeEventListener('mousemove', handleMove)
}
