import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './FadeScrollList.module.scss'

export interface FadeScrollListProps {
  children: React.ReactNode
  /** Accessible name; the region is focusable so keyboard users can scroll it. */
  ariaLabel?: string
  /** Must set the list's max-height — each caller's Figma frame fixes its own (e.g. 169px for Activity). */
  className?: string
}

/**
 * A scrolling list whose last visible rows fade out while there's more
 * below (Figma draws the domain overview's Activity and Comparable sales
 * lists clipped and fading, 5:4541). The fade is a CSS mask toggled by
 * `data-fade`, so it disappears once the list is scrolled to the end, or
 * never shows when everything already fits (design-system CLAUDE.md §4.5).
 */
export const FadeScrollList = ({ children, ariaLabel, className = '' }: FadeScrollListProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [fade, setFade] = useState(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setFade(el.scrollTop + el.clientHeight < el.scrollHeight - 1)
  }, [])

  useEffect(() => {
    update()
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => observer.disconnect()
  }, [update, children])

  return (
    <div
      ref={ref}
      className={[styles.list, className].filter(Boolean).join(' ')}
      data-fade={fade}
      onScroll={update}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel}
    >
      <div>{children}</div>
    </div>
  )
}

export default FadeScrollList
