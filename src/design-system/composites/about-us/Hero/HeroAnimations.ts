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

export function runMountainFlow(
  gsap: typeof GsapType,
  animator: HTMLElement | null,
  polys: (HTMLElement | null)[],
) {
  if (!animator) return

  // Animate the filter-free animator element — pure transform, fully GPU-composited
  const tl = gsap.timeline({ repeat: -1, yoyo: true, ease: 'sine.inOut' })
  tl.to(animator, { y: -24, duration: 7 }, 0)
  tl.to(animator, { scaleY: 1.08, duration: 9 }, 0)
  tl.to(animator, { scaleX: 1.04, duration: 11 }, 0)

  // Each poly opacity cross-fades independently — colour-shift flowing look
  // opacity is cheap to animate and does not trigger repaint
  const opacityConfigs = [
    { from: 0.9,  to: 0.45, duration: 8,  delay: 0   },
    { from: 0.85, to: 0.35, duration: 10, delay: 1.8 },
    { from: 0.75, to: 0.3,  duration: 7,  delay: 3.2 },
    { from: 0.9,  to: 0.4,  duration: 12, delay: 0.6 },
    { from: 0.7,  to: 0.2,  duration: 9,  delay: 2.5 },
  ]

  polys.forEach((el, i) => {
    if (!el) return
    const c = opacityConfigs[i]
    gsap.fromTo(
      el,
      { opacity: c.from },
      { opacity: c.to, duration: c.duration, delay: c.delay, repeat: -1, yoyo: true, ease: 'sine.inOut' },
    )
  })
}

export function bindParallax(
  gsap: typeof GsapType,
  refs: {
    arcLeft: RefObject<HTMLElement>
    arcRight: RefObject<HTMLElement>
    glow: RefObject<HTMLElement>
  },
) {
  const handleMove = (e: MouseEvent) => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
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
  }

  window.addEventListener('mousemove', handleMove)
  return () => window.removeEventListener('mousemove', handleMove)
}
