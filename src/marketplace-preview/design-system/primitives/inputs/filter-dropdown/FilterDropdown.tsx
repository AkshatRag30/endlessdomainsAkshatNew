import React, { useState, useRef, useEffect } from 'react'
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

/** Figma node 1:1048 — dark gradient pill trigger, rebuilt from get_design_context after Phase 7's real data superseded the Phase 3 placeholder (which was a light bordered select showing the current value). The trigger always shows `label`, not the current selection — the panel below marks which option is picked. */
export const FilterDropdown = ({ label, value, options, onChange, className = '' }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const shellClass = [styles.root, className].filter(Boolean).join(' ')

  return (
    <div className={shellClass} ref={rootRef}>
      <button type="button" className={styles.trigger} onClick={() => setOpen((prev) => !prev)} aria-expanded={open}>
        {label}
        <img src="/assets/img/marketplace/filter-chevron.svg" alt="" aria-hidden="true" className={styles.chevron} />
      </button>

      {open && (
        <ul className={styles.panel} role="listbox">
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
        </ul>
      )}
    </div>
  )
}

export default FilterDropdown
