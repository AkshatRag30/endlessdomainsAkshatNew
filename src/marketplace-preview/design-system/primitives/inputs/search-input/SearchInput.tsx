import React from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import styles from './SearchInput.module.scss'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/** Figma node 1:1049 — rebuilt from get_design_context after Phase 7's real data superseded the Phase 3 placeholder (which had a leading icon and no clear/submit buttons). */
export const SearchInput = ({ value, onChange, placeholder = 'Search', className = '' }: SearchInputProps) => {
  const shellClass = [styles.field, className].filter(Boolean).join(' ')

  return (
    <div className={shellClass}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
      <button type="button" className={styles.clear} onClick={() => onChange('')} aria-label="Clear search">
        <FiX size={15} aria-hidden="true" />
      </button>
      <span className={styles.divider} aria-hidden="true" />
      <button type="button" className={styles.submit} aria-label="Search">
        <FiSearch size={15} aria-hidden="true" />
      </button>
    </div>
  )
}

export default SearchInput
