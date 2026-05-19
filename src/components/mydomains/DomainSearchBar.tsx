import React, { useCallback, useRef } from 'react'
import { IoClose } from 'react-icons/io5'

import type { ViewMode } from '@/design-system/composites/mydomains/types'
import styles from './DomainSearchBar.module.scss'

interface DomainSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
}

export function DomainSearchBar({ value, onChange, onSearch, viewMode, onViewChange }: DomainSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') onSearch()
    },
    [onSearch],
  )

  const handleClear = useCallback(() => {
    onChange('')
    inputRef.current?.focus()
  }, [onChange])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  )

  return (
    <div className={styles.bar}>
      <div className={styles.inputWrap}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Search"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Search domains"
        />
        {value && (
          <button
            className={styles.clearBtn}
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <IoClose aria-hidden="true" />
          </button>
        )}
      </div>

      <button
        className={styles.searchBtn}
        type="button"
        onClick={onSearch}
        aria-label="Search domain"
      >
        <svg
          className={styles.searchIcon}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span>Search Domain</span>
      </button>

      <div className={styles.viewToggle} role="group" aria-label="View mode">
        <button
          className={[styles.toggleBtn, viewMode === 'grid' ? styles.toggleActive : ''].filter(Boolean).join(' ')}
          type="button"
          onClick={() => onViewChange('grid')}
          aria-label="Grid view"
          aria-pressed={viewMode === 'grid'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
        <button
          className={[styles.toggleBtn, viewMode === 'list' ? styles.toggleActive : ''].filter(Boolean).join(' ')}
          type="button"
          onClick={() => onViewChange('list')}
          aria-label="List view"
          aria-pressed={viewMode === 'list'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
