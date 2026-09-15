import { useEffect, useState } from 'react'

/**
 * This project has no shared useIsMobile hook yet — copied verbatim from
 * the marketplace preview's source project (src/utils/UseIsMobile.tsx).
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= breakpoint)

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [breakpoint])

  return isMobile
}
