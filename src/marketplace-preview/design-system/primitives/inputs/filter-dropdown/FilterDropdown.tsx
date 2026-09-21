import React, { useState, useRef, useEffect } from 'react'
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
  options: FilterDropdownOption[]
  onChange: (value: string) => void
  className?: string
}

/**
 * Figma node 1:1048 — dark gradient pill trigger, rebuilt from
 * get_design_context after Phase 7's real data superseded the Phase 3
 * placeholder (which was a light bordered select showing the current
 * value). The trigger always shows `label`, not the current selection —
 * the panel below marks which option is picked.
 *
 * The panel is portaled to document.body instead of rendered inline —
 * ListingFilterBar's row of triggers scrolls horizontally on narrow
 * screens (`overflow-x: auto`), and that same rule clips anything that
 * tries to render outside the row's own box regardless of z-index, which
 * silently ate the dropdown panel every time. Portaling escapes that
 * clipped ancestor entirely, same fix used for the Live Activity tooltip.
 */
export const FilterDropdown = ({ label, value, options, onChange, className = '' }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; minWidth: number } | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLUListElement>(null)

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

  // Closes on scroll/resize rather than re-measuring — simplest way to
  // avoid a stale-positioned panel drifting away from its trigger.
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  const toggleOpen = () => {
    if (!open) {
      const rect = rootRef.current?.getBoundingClientRect()
      if (rect) setCoords({ top: rect.bottom + 6, left: rect.left, minWidth: rect.width })
    }
    setOpen((prev) => !prev)
  }

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
          <ul
            ref={panelRef}
            className={styles.panel}
            role="listbox"
            style={{ top: coords.top, left: coords.left, minWidth: Math.max(140, coords.minWidth) }}
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={`${styles.option} ${option.value === value ? styles.optionActive : ''}`}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  )
}

export default FilterDropdown
