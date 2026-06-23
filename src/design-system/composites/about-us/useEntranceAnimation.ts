import { useEffect } from 'react'
import type { RefObject } from 'react'

// Injected once globally — avoids duplicating the style block per hook instance
let styleInjected = false
function injectStyle() {
  if (styleInjected || typeof document === 'undefined') return
  styleInjected = true
  const s = document.createElement('style')
  s.textContent = `
    .entrance-hidden {
      opacity: 0;
      transform: translateY(32px);
    }
    .entrance-visible {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `
  document.head.appendChild(s)
}

// Shared observer instance across all hook calls — one observer for the whole page
let sharedObserver: IntersectionObserver | null = null
const observedEls = new WeakMap<HTMLElement, number>() // el → stagger index

function getObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver
  sharedObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement
        if (entry.isIntersecting) {
          const delay = (observedEls.get(el) ?? 0) * 0.1
          el.style.transitionDelay = `${delay}s`
          el.classList.remove('entrance-hidden')
          el.classList.add('entrance-visible')
          sharedObserver!.unobserve(el)
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
  )
  return sharedObserver
}

export function useEntranceAnimation(elements: RefObject<HTMLElement>[]) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    injectStyle()
    const observer = getObserver()

    elements.forEach((ref, i) => {
      const el = ref.current
      if (!el) return
      el.classList.add('entrance-hidden')
      observedEls.set(el, i)
      observer.observe(el)
    })

    return () => {
      elements.forEach(ref => {
        const el = ref.current
        if (!el) return
        observer.unobserve(el)
        observedEls.delete(el)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
