import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Tooltip.module.scss'

export interface TooltipProps {
  /** Plain-text tooltip via CSS content: attr() — no extra DOM needed for a single string. */
  label?: string
  /** Rich tooltip content (multiple differently-styled spans) — rendered as a real child element instead, since attr() can't carry markup. Takes precedence over `label` when both are given. */
  content?: React.ReactNode
  /** 'dark' (default) is the plain-text tooltip's look. 'light' is a white card that doesn't impose its own text color, so `content`'s own colors/weights (e.g. Live Activity's colored price and bold domain name) read exactly like they do in place. */
  variant?: 'dark' | 'light'
  /** Which side of the trigger the bubble opens toward. Only matters for the CSS-only (non-portal) mode's up/down direction. */
  placement?: 'top' | 'bottom'
  /**
   * Renders the bubble into a portal at document.body, positioned from the
   * trigger's live bounding box, instead of `position: absolute` inside the
   * trigger. Needed when the trigger sits inside an ancestor with
   * `overflow: hidden` (e.g. Live Activity's scrolling list) — a CSS-absolute
   * bubble is clipped by that ancestor's own box no matter its z-index or
   * placement, since overflow clipping is about the ancestor's box, not
   * stacking order.
   */
  portal?: boolean
  /** Portal mode only. 'center' (default) centers the bubble under/over the trigger — right for most triggers. 'right' anchors it to the trigger's right edge instead, growing leftward — needed for Live Activity, which sits in the narrow right rail close to the screen's right edge, where a centered bubble would still run off-screen. */
  portalAlign?: 'center' | 'right'
  children: React.ReactNode
  className?: string
}

/**
 * CSS-only tooltip (no JS state, no mouseenter/leave listeners) — a themed
 * replacement for the browser's native title="" tooltip, which renders in
 * plain OS chrome and has a slow, browser-controlled delay before it shows.
 * Two modes: `label` (a plain string, shown via attr()) for a truncated
 * domain name's full text; `content` (real JSX) for anything that needs its
 * own styled spans, like Live Activity's full sentence.
 *
 * `portal` opts into a JS-positioned variant for triggers that live inside
 * a clipped/scrolling ancestor, where the CSS-only mode can't escape.
 */
export const Tooltip = ({
  label,
  content,
  variant = 'dark',
  placement = 'top',
  portal = false,
  portalAlign = 'center',
  children,
  className = '',
}: TooltipProps) => {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [coords, setCoords] = useState<{ top?: number; bottom?: number; left?: number; right?: number } | null>(null)

  // Hide on scroll/resize rather than re-measuring — simplest way to avoid a
  // stale-positioned tooltip drifting away from its trigger, and matches how
  // native title="" tooltips behave (they also dismiss on scroll).
  useEffect(() => {
    if (!portal || !coords) return
    const hide = () => setCoords(null)
    window.addEventListener('scroll', hide, true)
    window.addEventListener('resize', hide)
    return () => {
      window.removeEventListener('scroll', hide, true)
      window.removeEventListener('resize', hide)
    }
  }, [portal, coords])

  if (!portal) {
    const shellClass = [
      styles.wrap,
      variant === 'light' ? styles.light : '',
      placement === 'bottom' ? styles.placementBottom : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    if (content) {
      return (
        <span className={shellClass}>
          {children}
          <span className={styles.bubble}>{content}</span>
        </span>
      )
    }

    return (
      <span className={shellClass} data-tooltip={label}>
        {children}
      </span>
    )
  }

  const show = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    const vertical =
      placement === 'bottom'
        ? { top: rect.bottom + 8 }
        : { bottom: window.innerHeight - rect.top + 8 }
    const horizontal =
      portalAlign === 'right'
        ? { right: window.innerWidth - rect.right }
        : { left: rect.left + rect.width / 2 }
    setCoords({ ...vertical, ...horizontal })
  }
  const hide = () => setCoords(null)

  return (
    <span
      ref={triggerRef}
      className={[styles.wrap, className].filter(Boolean).join(' ')}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {coords &&
        typeof document !== 'undefined' &&
        createPortal(
          <span
            className={[
              styles.portalBubble,
              variant === 'light' ? styles.light : '',
              !content ? styles.portalBubbleWrap : '',
            ].filter(Boolean).join(' ')}
            style={{
              top: coords.top,
              bottom: coords.bottom,
              left: coords.left,
              right: coords.right,
              // Read by the fade-in keyframes below, not set as `transform`
              // directly — a CSS animation takes over the whole `transform`
              // property while it runs, so a plain inline transform here
              // would be dropped for the animation's duration and then snap
              // back in the instant it finished (the visible left-jump this
              // was fixed for).
              ['--tt-tx' as string]: coords.left !== undefined ? 'translateX(-50%)' : 'translateX(0)',
            } as React.CSSProperties}
          >
            {content ?? label}
          </span>,
          document.body
        )}
    </span>
  )
}

export default Tooltip
