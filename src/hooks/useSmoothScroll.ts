import { useEffect } from 'react'

export function useSmoothScroll() {
  useEffect(() => {
    let rafId: number
    let lenis: import('@studio-freight/lenis').default | null = null
    let destroyed = false

    const init = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('@studio-freight/lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (destroyed) return

      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      })

      ;(window as any).__lenis = lenis

      // Drive Lenis through gsap.ticker so ScrollTrigger and Lenis share one clock.
      // This is the canonical integration — Lenis position stays in sync with ScrollTrigger.
      gsap.ticker.add((time: number) => {
        lenis!.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)

      // ScrollerProxy: tell ScrollTrigger to read Lenis's virtual scroll position
      // instead of native window.scrollY. This makes scrub animations track the
      // smoothed position exactly — no drift between Lenis and ScrollTrigger.
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value?: number) {
          if (arguments.length && value !== undefined) {
            lenis!.scrollTo(value, { immediate: true })
          }
          return lenis!.scroll
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
        },
        pinType: document.body.style.transform ? 'transform' : 'fixed',
      })

      lenis.on('scroll', ScrollTrigger.update)
      ScrollTrigger.addEventListener('refresh', () => lenis!.resize())
      ScrollTrigger.refresh()
    }

    init()

    return () => {
      destroyed = true
      cancelAnimationFrame(rafId)
      lenis?.destroy()
      ;(window as any).__lenis = null
    }
  }, [])
}
