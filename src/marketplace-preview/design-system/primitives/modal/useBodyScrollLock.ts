import { useEffect } from 'react'

/**
 * Locks page scroll while `locked` is true, restoring the exact prior state
 * (including scroll offset) on unlock/unmount. Extracted from
 * MarketplacePageShell's mobile-sidebar effect (same iOS rubber-band bug,
 * same fix: pin the body via position: fixed rather than relying on
 * overflow: hidden alone, which mouse-wheel/keyboard scrolling respects but
 * iOS Safari's touch-drag scroll does not) so Modal and that shell's drawer
 * share one implementation instead of two copies of the same effect.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const { body } = document
    const scrollY = window.scrollY
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    }
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    return () => {
      body.style.overflow = previous.overflow
      body.style.position = previous.position
      body.style.top = previous.top
      body.style.width = previous.width
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}

export default useBodyScrollLock
