import { useEffect } from 'react'

export function useSmoothScroll() {
  useEffect(() => {
    let lenis: import('@studio-freight/lenis').default | null = null

    const init = async () => {
      const { default: Lenis } = await import('@studio-freight/lenis')

      lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      })

      const raf = (time: number) => {
        lenis?.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }

    init()

    return () => {
      lenis?.destroy()
    }
  }, [])
}
