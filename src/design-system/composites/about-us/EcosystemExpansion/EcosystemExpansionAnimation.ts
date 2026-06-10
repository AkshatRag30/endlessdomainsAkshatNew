import type { RefObject } from 'react'
import type { gsap as GsapType } from 'gsap'

export function runOrbitRotation(gsap: typeof GsapType, ringEl: HTMLElement | null) {
  if (!ringEl) return
  gsap.to(ringEl, {
    rotation: 360,
    duration: 36,
    repeat: -1,
    ease: 'none',
    transformOrigin: '50% 50%',
  })
}

// Counter-rotate each module label so the text stays upright as the ring spins
export function runCounterRotation(gsap: typeof GsapType, labelEls: (HTMLElement | null)[]) {
  labelEls.forEach(el => {
    if (!el) return
    gsap.to(el, {
      rotation: -360,
      duration: 36,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%',
    })
  })
}

// Subtle parallax shift on the glow and concentric rings in response to mouse movement
export function bindEcosystemParallax(
  gsap: typeof GsapType,
  refs: {
    glow: RefObject<HTMLElement>
    rings: RefObject<HTMLElement>
    dotGrid: RefObject<HTMLElement>
  },
) {
  const handleMove = (e: MouseEvent) => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const dx = (e.clientX - cx) / cx
    const dy = (e.clientY - cy) / cy

    gsap.to(refs.glow.current, {
      x: dx * 18,
      y: dy * 12,
      duration: 1.8,
      ease: 'power1.out',
    })
    gsap.to(refs.rings.current, {
      x: dx * 6,
      y: dy * 4,
      duration: 2.2,
      ease: 'power1.out',
    })
    gsap.to(refs.dotGrid.current, {
      x: dx * -5,
      y: dy * -3,
      duration: 2.0,
      ease: 'power1.out',
    })
  }

  window.addEventListener('mousemove', handleMove)
  return () => window.removeEventListener('mousemove', handleMove)
}

// Entrance: fade-in the whole section from below
export function runEcosystemEntrance(
  gsap: typeof GsapType,
  refs: {
    eyebrow: RefObject<HTMLElement>
    heading: RefObject<HTMLElement>
    description: RefObject<HTMLElement>
    ring: RefObject<HTMLElement>
  },
) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo(refs.ring.current, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 1.2 }, 0)
    .fromTo(refs.eyebrow.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3)
    .fromTo(refs.heading.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9 }, 0.5)
    .fromTo(refs.description.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.75)

  return tl
}
