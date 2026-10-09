import React from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import styles from './SearchInput.module.scss'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/**
 * Every search bar using this (Live Listings, My Domains, Watchlist) matches
 * the text against domain names, so anything a domain name can never
 * contain is dropped as it's typed or pasted: whitespace, control
 * characters, invisible zero-width/bidi characters, and punctuation like
 * < > " ' ; / \ @ # % & *. Letters in any script, digits, emoji, "-", "_"
 * and "." stay, so unicode/emoji web3 names can still be searched. The
 * zero-width joiner (U+200D) is deliberately kept: compound
 * emoji like 👨‍👩‍👧 are built from it. Capped at 64 characters (a domain
 * label's own 63 plus room for a stray dot).
 */
const MAX_SEARCH_LENGTH = 64
const DISALLOWED = /[\s\p{Cc}\u200B\u200C\u200E\u200F\u202A-\u202E\u2060\uFEFF<>"'`;:{}()[\]\\/|!@#$%^&*=+,?~]/gu

export function sanitizeSearch(raw: string): string {
  return raw.replace(DISALLOWED, '').slice(0, MAX_SEARCH_LENGTH)
}

/** Figma node 1:1049 — rebuilt from get_design_context after Phase 7's real data superseded the Phase 3 placeholder (which had a leading icon and no clear/submit buttons). */
export const SearchInput = ({ value, onChange, placeholder = 'Search', className = '' }: SearchInputProps) => {
  const shellClass = [styles.field, className].filter(Boolean).join(' ')

  return (
    <div className={shellClass}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(sanitizeSearch(e.target.value))}
        placeholder={placeholder}
        className={styles.input}
      />
      {value && (
        <button type="button" className={styles.clear} onClick={() => onChange('')} aria-label="Clear search">
          <FiX size={15} aria-hidden="true" />
        </button>
      )}
      <span className={styles.divider} aria-hidden="true" />
      <button type="button" className={styles.submit} aria-label="Search">
        <FiSearch size={15} aria-hidden="true" />
      </button>
    </div>
  )
}

export default SearchInput
