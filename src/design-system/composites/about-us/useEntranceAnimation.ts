import { useEffect } from 'react'
import type { RefObject } from 'react'

export function useEntranceAnimation(elements: RefObject<HTMLElement>[]) {
  useEffect(() => {
    // Track which elements have entered at least once
    const entered = new Set<HTMLElement>()
    let rafId: number
    let gsap: typeof import('gsap').gsap | null = null

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
        entries.forEach(entry => {
          if (!entry.isIntersecting || !gsap) return
          const el = entry.target as HTMLElement
          if (entered.has(el)) return
          entered.add(el)
          entranceObserver.unobserve(el)
          const delay = Number(el.dataset.staggerIndex ?? 0) * 0.12
          gsap.to(el, { opacity: 1, y: 0, duration: 1.0, delay, ease: 'power3.out', clearProps: 'transform' })
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    // ── Exit: rAF loop continuously maps scroll position to opacity/y ─────────
    // fadeZone: how many px from the top edge of the viewport the fade covers
    const FADE_ZONE = 260

    const tick = () => {
      if (gsap) {
        const vh = window.innerHeight

        elements.forEach(ref => {
          const el = ref.current
          if (!el || !entered.has(el)) return

          const rect = el.getBoundingClientRect()
          const bottom = rect.bottom

          if (bottom > FADE_ZONE) {
            // Fully visible — no-op (entrance tween handles bringing it in)
          } else if (bottom > 0) {
            // Partially exiting upward — lerp opacity and y based on how far it's gone
            const progress = 1 - bottom / FADE_ZONE
            gsap!.set(el, { opacity: 1 - progress, y: -30 * progress })
          } else if (rect.top > vh) {
            // Element is below viewport (user scrolled back up past it) — reset to entrance state
            gsap!.set(el, { opacity: 0, y: 40 })
            entered.delete(el)
            // Re-observe so entrance fires again on scroll down
            entranceObserver.observe(el)
          }
        })
      }

      rafId = requestAnimationFrame(tick)
    }

    // Load GSAP once, then start observing and the rAF loop
    import('gsap').then(mod => {
      gsap = mod.gsap
      elements.forEach(ref => {
        if (ref.current) entranceObserver.observe(ref.current)
      })
      rafId = requestAnimationFrame(tick)
    })

    return () => {
      entranceObserver.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
