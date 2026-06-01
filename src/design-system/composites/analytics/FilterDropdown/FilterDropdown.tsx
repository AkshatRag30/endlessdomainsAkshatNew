import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import styles from './FilterDropdown.module.scss'

interface FilterDropdownProps {
  id?: string
  value: string
  options: string[]
  onChange: (value: string) => void
  className?: string
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ id, value, options, onChange, className }) => {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen(prev => !prev), [])

  const select = useCallback(
    (opt: string) => {
      onChange(opt)
      close()
    },
    [onChange, close],
  )

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, close])

  return (
    <div ref={wrapRef} className={`${styles.wrap}${className ? ` ${className}` : ''}`}>
      <button
        id={id}
        type="button"
        className={styles.trigger}
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={styles.triggerText}>{value}</span>
        <FiChevronDown
          className={open ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul className={styles.panel} role="listbox" aria-label="Filter options">
          {options.map(opt => (
            <li key={opt} role="option" aria-selected={opt === value}>
              <button
                type="button"
                className={opt === value ? `${styles.option} ${styles.optionSelected}` : styles.option}
                onClick={() => select(opt)}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FilterDropdown
