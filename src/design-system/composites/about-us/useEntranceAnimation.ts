import { useEffect } from 'react'
import type { RefObject } from 'react'

export function useEntranceAnimation(elements: RefObject<HTMLElement>[]) {
  useEffect(() => {
    let gsapInstance: typeof import('gsap').gsap | null = null

    const getGsap = async () => {
      if (!gsapInstance) {
        const mod = await import('gsap')
        gsapInstance = mod.gsap
      }
      return gsapInstance
    }

    // Track which elements have entered at least once
    const entered = new Set<HTMLElement>()

    // Hide everything before paint
    elements.forEach((ref, i) => {
      if (ref.current) {
        ref.current.style.opacity = '0'
        ref.current.style.transform = 'translateY(40px)'
        ref.current.dataset.staggerIndex = String(i)
      }
    })

    // ── Entrance: IntersectionObserver fires once when element scrolls in ──────
    const entranceObserver = new IntersectionObserver(
      entries => {
        entries.forEach(async entry => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          if (entered.has(el)) return
          entered.add(el)
          const gsap = await getGsap()
          const delay = Number(el.dataset.staggerIndex ?? 0) * 0.12
          gsap.to(el, { opacity: 1, y: 0, duration: 1.0, delay, ease: 'power3.out', clearProps: 'transform' })
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    elements.forEach(ref => {
      if (ref.current) entranceObserver.observe(ref.current)
    })

    // ── Exit: rAF loop continuously maps scroll position to opacity/y ─────────
    // fadeZone: how many px from the top edge of the viewport the fade covers
    const FADE_ZONE = 260
    let rafId: number

    const tick = async () => {
      const gsap = await getGsap()
      const vh = window.innerHeight

      elements.forEach(ref => {
        const el = ref.current
        if (!el || !entered.has(el)) return

        const rect = el.getBoundingClientRect()
        // elementBottom relative to viewport — negative means fully above viewport
        const bottom = rect.bottom

        if (bottom > FADE_ZONE) {
          // Fully visible — ensure it's shown (handles scroll-back-down reset)
          gsap.set(el, { opacity: 1, y: 0 })
        } else if (bottom > 0) {
          // Partially exiting upward — lerp opacity and y based on how far it's gone
          const progress = 1 - bottom / FADE_ZONE   // 0 at start of fade, 1 when fully gone
          gsap.set(el, {
            opacity: 1 - progress,
            y: -30 * progress,
          })
        } else if (rect.top > vh) {
          // Element is below viewport (user scrolled back up past it) — reset to entrance state
          gsap.set(el, { opacity: 0, y: 40 })
          entered.delete(el)
          // Re-observe so entrance fires again on scroll down
          entranceObserver.observe(el)
        }
      })

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      entranceObserver.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
