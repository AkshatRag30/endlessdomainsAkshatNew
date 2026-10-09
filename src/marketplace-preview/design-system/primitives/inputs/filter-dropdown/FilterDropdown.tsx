import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { createPortal } from 'react-dom'
import styles from './FilterDropdown.module.scss'

export interface FilterDropdownOption {
  value: string
  label: string
}

export interface FilterDropdownProps {
  label: string
  value?: string
  options?: FilterDropdownOption[]
  onChange?: (value: string) => void
  className?: string
  /**
   * Custom panel content (e.g. a range slider) in place of the default
   * option list — when set, options/onChange aren't used to render the
   * panel at all; the caller owns its own value/onChange via closure
   * (ListingFilterBar's Price control does this for its slider).
   */
  children?: React.ReactNode
}

/**
 * Figma node 1:1048 — dark gradient pill trigger, rebuilt from
 * get_design_context after Phase 7's real data superseded the Phase 3
 * placeholder (which was a light bordered select showing the current
 * value). The trigger always shows `label` verbatim — it's up to the
 * caller to compute a label that reflects the current selection when that's
 * wanted (see MyDomainsFilterBar's own file comment, and
 * ListingFilterBar's matching selectedXLabel variables) — this primitive
 * itself doesn't special-case `value` against `options` for the trigger.
 *
 * The panel is portaled to document.body instead of rendered inline —
 * ListingFilterBar's row of triggers scrolls horizontally on narrow
 * screens (`overflow-x: auto`), and that same rule clips anything that
 * tries to render outside the row's own box regardless of z-index, which
 * silently ate the dropdown panel every time. Portaling escapes that
 * clipped ancestor entirely, same fix used for the Live Activity tooltip.
 */
export const FilterDropdown = ({ label, value, options, onChange, className = '', children }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; minWidth: number } | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (rootRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Recomputes the trigger's live position and clamps the panel back onto
  // the viewport (see the comment on the scroll/resize effect below for
  // why this replaced closing on scroll). Panel dimensions are only
  // available once it's actually mounted (panelRef is still null the very
  // first time this runs, from toggleOpen, before the portal has rendered
  // at all) — left/top are just the trigger's own edges until then, the
  // same starting point as before; the mount effect right after calls this
  // again once the panel exists, which is what actually clamps it.
  const reposition = () => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (!rect) return
    const panelRect = panelRef.current?.getBoundingClientRect()
    const margin = 8

    let left = rect.left
    if (panelRect && left + panelRect.width > window.innerWidth - margin) {
      left = Math.max(margin, rect.right - panelRect.width)
    }

    let top = rect.bottom + 6
    if (panelRect && top + panelRect.height > window.innerHeight - margin) {
      // Flips above the trigger instead when there's more room there —
      // falls back to clamping against the bottom edge (scrollable panel
      // content still reaches everything via .panel's own overflow-y)
      // rather than flipping into even less room above.
      const spaceAbove = rect.top - margin
      const spaceBelow = window.innerHeight - rect.bottom - margin
      top = spaceAbove > spaceBelow ? Math.max(margin, rect.top - panelRect.height - 6) : Math.min(top, window.innerHeight - panelRect.height - margin)
    }

    setCoords({ top, left, minWidth: rect.width })
  }

  // Used to just close on any scroll/resize instead of tracking the
  // trigger — simplest to write, but it meant opening the Extension
  // filter (or any dropdown) and then so much as scrolling the page a
  // pixel made it vanish instead of staying open and following its
  // trigger, which reads as broken rather than intentional. Repositioning
  // (not closing) on both is the actual fix; `true` still catches scroll
  // on any nested scrollable ancestor, not just the window.
  useEffect(() => {
    if (!open) return
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open])

  const toggleOpen = () => {
    if (!open) reposition()
    setOpen((prev) => !prev)
  }

  // Clamps the just-opened panel back onto the viewport now that it's
  // actually mounted and its real rendered size (which can be wider than
  // the trigger, see `minWidth` below) is measurable — toggleOpen's own
  // call above only had the trigger's own edges to go on.
  useLayoutEffect(() => {
    if (!open) return
    reposition()
  }, [open])

  const shellClass = [styles.root, className].filter(Boolean).join(' ')

  return (
    <div className={shellClass} ref={rootRef}>
      <button type="button" className={styles.trigger} onClick={toggleOpen} aria-expanded={open}>
        {label}
        <FiChevronDown size={9} aria-hidden="true" className={styles.chevron} />
      </button>

      {open &&
        coords &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={panelRef}
            className={styles.panel}
            role={children ? undefined : 'listbox'}
            style={{ top: coords.top, left: coords.left, minWidth: Math.max(140, coords.minWidth) }}
          >
            {children ?? (
              <ul className={styles.optionList}>
                {options?.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option.value === value}
                      className={`${styles.option} ${option.value === value ? styles.optionActive : ''}`}
                      onClick={() => {
                        onChange?.(option.value)
                        setOpen(false)
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}

export default FilterDropdown
