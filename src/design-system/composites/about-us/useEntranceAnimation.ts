import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

// Triggers the same opacity+y entrance used on the hero, but scroll-driven.
// Each element passed in animates when it enters the viewport.
export function useEntranceAnimation(elements: RefObject<HTMLElement>[]) {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    let gsapInstance: typeof import('gsap').gsap | null = null

    const animate = async (el: HTMLElement) => {
      if (!gsapInstance) {
        const mod = await import('gsap')
        gsapInstance = mod.gsap
      }
      gsapInstance.fromTo(
        el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      )
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animate(entry.target as HTMLElement)
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.35 },
    )

    elements.forEach(ref => {
      if (ref.current) {
        // start hidden — GSAP will reveal on scroll-in
        ref.current.style.opacity = '0'
        observerRef.current?.observe(ref.current)
      }
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
