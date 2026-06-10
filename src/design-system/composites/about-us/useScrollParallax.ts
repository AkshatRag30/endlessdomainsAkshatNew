import { useEffect } from 'react'
import type { RefObject } from 'react'

export function useScrollParallax(refs: {
  hero: RefObject<HTMLElement>
  about: RefObject<HTMLElement>
}) {
  useEffect(() => {
    const hero = refs.hero.current
    if (!hero) return

    // Hero becomes sticky — it pins in place while the about section scrolls over it
    hero.style.position = 'sticky'
    hero.style.top = '0'
    hero.style.zIndex = '0'

    return () => {
      if (hero) {
        hero.style.position = ''
        hero.style.top = ''
        hero.style.zIndex = ''
      }
    }
  }, [refs.hero])
}
