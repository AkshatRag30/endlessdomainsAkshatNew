import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'

import type { ViewMode } from './types'
import styles from './DomainSearchBar.module.scss'

interface DomainSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
  onSync?: () => void
}

export function DomainSearchBar({ value, onChange, onSearch, viewMode, onViewChange, onSync }: DomainSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [spinDone, setSpinDone] = useState(false)

  const handleSyncClick = useCallback(() => {
    if (isSyncing) return
    setSpinDone(false)
    setIsSyncing(true)
    onSync?.()
  }, [isSyncing, onSync])

  const handleSpinEnd = useCallback(() => setSpinDone(true), [])

  useEffect(() => {
    if (!isSyncing) return
    const t = setTimeout(() => setIsSyncing(false), 45_000)
    return () => clearTimeout(t)
  }, [isSyncing])

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
      <div className={styles.formWrap}>
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
        <div className={styles.formRight}>
          {value && (
            <div className={styles.clearArea}>
              <button
                className={styles.clearBtn}
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <IoClose aria-hidden="true" />
              </button>
            </div>
          )}
          <button
            className={styles.searchBtn}
            type="button"
            onClick={onSearch}
            aria-label="Search domain"
          >
            <svg
              className={styles.searchIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
        </div>
      </div>

      <div className={styles.viewToggle} role="group" aria-label="View mode">
        <button
          className={[styles.toggleBtn, viewMode === 'grid' ? styles.toggleActive : ''].filter(Boolean).join(' ')}
          type="button"
          onClick={() => onViewChange('grid')}
          aria-label="Grid view"
          aria-pressed={viewMode === 'grid'}
        >
          <span className={styles.iconWrap}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M104,32H56A24,24,0,0,0,32,56v48a24,24,0,0,0,24,24h48a24,24,0,0,0,24-24V56A24,24,0,0,0,104,32Zm8,72a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Zm88-72H152a24,24,0,0,0-24,24v48a24,24,0,0,0,24,24h48a24,24,0,0,0,24-24V56A24,24,0,0,0,200,32Zm8,72a8,8,0,0,1-8,8H152a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Zm-96,64H56a24,24,0,0,0-24,24v48a24,24,0,0,0,24,24h48a24,24,0,0,0,24-24V192A24,24,0,0,0,104,168Zm8,72a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V192a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Zm88-72H152a24,24,0,0,0-24,24v48a24,24,0,0,0,24,24h48a24,24,0,0,0,24-24V192A24,24,0,0,0,200,168Zm8,72a8,8,0,0,1-8,8H152a8,8,0,0,1-8-8V192a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z" />
            </svg>
          </span>
        </button>
        <button
          className={[styles.toggleBtn, viewMode === 'list' ? styles.toggleActive : ''].filter(Boolean).join(' ')}
          type="button"
          onClick={() => onViewChange('list')}
          aria-label="List view"
          aria-pressed={viewMode === 'list'}
        >
          <span className={styles.iconWrap}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M224,120H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16Zm0-64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16Zm0,128H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16Z" />
            </svg>
          </span>
        </button>
      </div>

      {onSync && (
        <button
          className={[styles.syncNowBtn, isSyncing ? styles.syncNowBtn_syncing : ''].filter(Boolean).join(' ')}
          type="button"
          onClick={handleSyncClick}
          disabled={isSyncing}
          aria-label={isSyncing ? 'Syncing domains' : 'Sync domains now'}
        >
          <span className={styles.syncPill}>
            <span className={styles.syncLabel}>{isSyncing ? 'Sync again in 45s' : 'Sync Now'}</span>
            {(!isSyncing || !spinDone) && (
              <svg
                className={isSyncing && !spinDone ? styles.syncIconSpin : undefined}
                onAnimationEnd={handleSpinEnd}
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            )}
            {isSyncing && (
              <img
                src="/animation/clockgif.gif"
                alt=""
                aria-hidden="true"
                className={styles.syncGif}
              />
            )}
          </span>
        </button>
      )}
    </div>
  )
}
