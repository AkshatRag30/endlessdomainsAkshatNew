import type { gsap as GsapType } from 'gsap'

export const STATE_COUNT = 4
const SEGMENTS = STATE_COUNT - 1

// Outward resting/exit offsets for the dimmed card in each side's stack — tuned
// against the Figma frame, where the queued card sits closer + smaller than a
// fully-exited one so only one dim card ever reads clearly at a time.
// ACTIVE_OFFSET pulls the active card inward, toward the identity core — this both
// tightens the whitespace either side of the core and, since it doesn't move the
// queued card, widens the reveal gap so the next translucent card shows more of itself
// instead of sitting fully behind the active one.
const QUEUE_OFFSET = 56
const QUEUE_SCALE = 0.74
const QUEUE_OPACITY = 0.42
const QUEUE_Y = 10
const ACTIVE_OFFSET = -52
const EXIT_OFFSET = 88
const EXIT_SCALE = 0.85

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export interface CardTransform {
  opacity: number
  scale: number
  x: number
  y: number
  zIndex: number
}

// side: -1 for the left stack (offsets go negative/outward-left), 1 for the right stack
export function getCardTransform(progress: number, index: number, side: -1 | 1): CardTransform {
  const d = progress * SEGMENTS - index

  let opacity = 0
  let scale = QUEUE_SCALE
  let outward = QUEUE_OFFSET
  let y = QUEUE_Y

  if (d <= -1) {
    opacity = 0
  } else if (d <= 0) {
    const t = d + 1 // 0 → 1, queued → active
    opacity = lerp(QUEUE_OPACITY, 1, t)
    scale = lerp(QUEUE_SCALE, 1, t)
    outward = lerp(QUEUE_OFFSET, ACTIVE_OFFSET, t)
    y = lerp(QUEUE_Y, 0, t)
  } else if (d <= 1) {
    const t = d // 0 → 1, active → exited
    opacity = lerp(1, 0, t)
    scale = lerp(1, EXIT_SCALE, t)
    outward = lerp(ACTIVE_OFFSET, EXIT_OFFSET, t)
    y = 0
  } else {
    opacity = 0
    outward = EXIT_OFFSET
    scale = EXIT_SCALE
  }

  const zIndex = Math.max(1, Math.round(20 - Math.abs(d) * 10))

  return { opacity, scale, x: outward * side, y, zIndex }
}

// 0 → 1 pulse energy, peaking mid-transition between two states, resting at the poles
export function getCenterEnergy(progress: number): number {
  const segProgress = progress * SEGMENTS
  const frac = segProgress - Math.floor(segProgress)
  const withinBounds = progress > 0 && progress < 1
  return withinBounds ? Math.sin(frac * Math.PI) : 0
}

// Handoff into the next section: over the final stretch of this section's scroll, the
// identity mark spins a full turn on the z-axis and physically travels downward, so it
// reads as descending toward the next section's core. It only fades in the very last
// sliver of the window, right before the sticky stage unpins, rather than shrinking
// away in place.
const EXIT_WINDOW_START = 0.85

export interface ExitSpinState {
  active: boolean
  rotation: number
  scale: number
  y: number
  opacity: number
}

export function getExitSpin(progress: number): ExitSpinState {
  if (progress < EXIT_WINDOW_START) return { active: false, rotation: 0, scale: 1, y: 0, opacity: 1 }
  const t = clamp((progress - EXIT_WINDOW_START) / (1 - EXIT_WINDOW_START), 0, 1)
  return {
    active: true,
    rotation: t * 360,
    scale: lerp(1, 0.8, t),
    y: lerp(0, 260, t),
    opacity: lerp(1, 0, Math.max(0, (t - 0.75) / 0.25)),
  }
}

export function getActiveIndex(progress: number): number {
  return clamp(Math.round(progress * SEGMENTS), 0, SEGMENTS)
}

interface ProgressRefs {
  leftCards: (HTMLElement | null)[]
  rightCards: (HTMLElement | null)[]
  centerFrame: HTMLElement | null
  centerGlow: HTMLElement | null
  thumb: HTMLElement | null
  track: HTMLElement | null
}

interface ProgressControllerOptions {
  sectionEl: HTMLElement
  refs: ProgressRefs
  reducedMotion: boolean
  onActiveIndexChange: (index: number) => void
}

export function createProgressController(gsap: typeof GsapType, { sectionEl, refs, reducedMotion, onActiveIndexChange }: ProgressControllerOptions) {
  let sectionTop = 0
  let scrollLength = 1
  let lastActiveIndex = -1
  let dragging = false

  const centerPulse = gsap.quickTo(refs.centerFrame, 'scale', { duration: 0.5, ease: 'power2.out' })
  const glowPulse = gsap.quickTo(refs.centerGlow, 'opacity', { duration: 0.5, ease: 'power2.out' })

  function measure() {
    const rect = sectionEl.getBoundingClientRect()
    sectionTop = window.scrollY + rect.top
    scrollLength = Math.max(1, sectionEl.offsetHeight - window.innerHeight)
  }

  function applyCard(el: HTMLElement | null, progress: number, index: number, side: -1 | 1) {
    if (!el) return
    const t = getCardTransform(progress, index, side)
    if (reducedMotion) {
      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: t.opacity > 0.05 ? 1 : 0, scale: 1, x: 0, y: 0, zIndex: t.zIndex })
      return
    }
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: t.opacity, scale: t.scale, x: t.x, y: t.y, zIndex: t.zIndex })
  }

  function applyProgress(progress: number) {
    const p = clamp(progress, 0, 1)

    refs.leftCards.forEach((el, i) => applyCard(el, p, i, -1))
    refs.rightCards.forEach((el, i) => applyCard(el, p, i, 1))

    if (!reducedMotion) {
      const exitSpin = getExitSpin(p)
      if (exitSpin.active) {
        gsap.set(refs.centerFrame, { rotationZ: exitSpin.rotation, scale: exitSpin.scale, y: exitSpin.y, opacity: exitSpin.opacity })
        glowPulse(exitSpin.opacity * 0.5)
      } else {
        gsap.set(refs.centerFrame, { rotationZ: 0, y: 0, opacity: 1 })
        const energy = getCenterEnergy(p)
        centerPulse(1 + energy * 0.045)
        glowPulse(0.45 + energy * 0.4)
      }
    }

    if (refs.track && refs.thumb) {
      const trackWidth = refs.track.clientWidth
      const thumbWidth = refs.thumb.offsetWidth || 41
      const travel = Math.max(0, trackWidth - thumbWidth - 16)
      gsap.set(refs.thumb, { x: 8 + p * travel })
    }

    const activeIndex = getActiveIndex(p)
    if (activeIndex !== lastActiveIndex) {
      lastActiveIndex = activeIndex
      onActiveIndexChange(activeIndex)
    }
  }

  function progressFromScroll() {
    const raw = window.scrollY - sectionTop
    return raw / scrollLength
  }

  // Applied synchronously inside Lenis's own scroll callback — Lenis is already driven
  // by gsap.ticker, so it fires at most once per animation frame. Wrapping this in an
  // extra requestAnimationFrame added a full frame of lag behind the smoothed scroll
  // position, which read as a stutter specifically during the fast-changing deceleration
  // tail at the end of a scroll gesture.
  function onScroll() {
    if (dragging) return
    applyProgress(progressFromScroll())
  }

  function scrollToProgress(p: number) {
    const targetY = sectionTop + clamp(p, 0, 1) * scrollLength
    const lenis = (window as any).__lenis
    if (lenis) lenis.scrollTo(targetY, { immediate: true })
    else window.scrollTo(0, targetY)
  }

  function onResize() {
    measure()
    applyProgress(progressFromScroll())
  }

  measure()
  applyProgress(progressFromScroll())

  const lenis = (window as any).__lenis
  if (lenis) lenis.on('scroll', onScroll)
  else window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)

  return {
    setDragging(value: boolean) {
      dragging = value
    },
    setProgressFromPointer(clientX: number) {
      if (!refs.track) return
      const rect = refs.track.getBoundingClientRect()
      const thumbWidth = refs.thumb?.offsetWidth || 41
      const usable = Math.max(1, rect.width - thumbWidth - 16)
      const local = clamp(clientX - rect.left - 8 - thumbWidth / 2, 0, usable)
      const p = local / usable
      scrollToProgress(p)
      applyProgress(p)
    },
    stepProgress(direction: 1 | -1) {
      const current = progressFromScroll()
      const next = clamp(current + direction / SEGMENTS, 0, 1)
      scrollToProgress(next)
      applyProgress(next)
    },
    refresh: onResize,
    destroy() {
      if (lenis) lenis.off('scroll', onScroll)
      else window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    },
  }
}
