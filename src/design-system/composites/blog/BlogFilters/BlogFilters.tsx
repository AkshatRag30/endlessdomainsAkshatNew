import React, { useCallback, useState, useRef, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import styles from './BlogFilters.module.scss'
import type { Category } from '@/data/categories'

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Feeds' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
]

export interface BlogFiltersProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (slug: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy?: string
  onSortChange?: (value: string) => void
}

export function BlogFilters({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy = 'newest',
  onSortChange,
}: BlogFiltersProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value),
    [onSearchChange]
  )

  const handleClear = useCallback(() => {
    onSearchChange('')
    inputRef.current?.focus()
  }, [onSearchChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') inputRef.current?.blur()
    },
    []
  )

  const handleSortSelect = useCallback(
    (value: string) => {
      onSortChange?.(value)
      setSortOpen(false)
    },
    [onSortChange]
  )

  useEffect(() => {
    if (!sortOpen) return
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [sortOpen])

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Newest Feeds'

  return (
    <div className={styles.wrapper} role="search" aria-label="Filter and search blog posts">
      <div className={styles.inner}>

        {/* Left — category label + sharp pills */}
        <div className={styles.leftGroup}>
          <span className={styles.filterLabel}>Filter by category:</span>
          <nav className={styles.tabs} aria-label="Blog categories">
            <ul className={styles.tabList}>
              {categories.map(cat => (
                <li key={cat.id} className={styles.tabItem}>
                  <button
                    type="button"
                    className={styles.tab}
                    aria-pressed={activeCategory === cat.slug}
                    data-active={activeCategory === cat.slug}
                    onClick={() => onCategoryChange(cat.slug)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right — MyDomains-style search form + sort dropdown */}
        <div className={styles.rightGroup}>
          <div className={styles.formWrap}>
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              aria-label="Search blog articles"
            />
            <div className={styles.formRight}>
              {searchQuery && (
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
                aria-label="Search articles"
              >
                <svg
                  className={styles.searchIcon}
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
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span>Search Article</span>
              </button>
            </div>
          </div>

          {/* Sort dropdown */}
          <div className={styles.sortWrap} ref={sortRef}>
            <button
              type="button"
              className={styles.sortTrigger}
              aria-expanded={sortOpen}
              aria-haspopup="listbox"
              onClick={() => setSortOpen(v => !v)}
            >
              <span>{activeSortLabel}</span>
              <svg
                className={styles.sortChevron}
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {sortOpen && (
              <ul className={styles.sortPanel} role="listbox" aria-label="Sort order">
                {SORT_OPTIONS.map(opt => (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={sortBy === opt.value}
                    className={styles.sortOption}
                    data-selected={sortBy === opt.value}
                    onClick={() => handleSortSelect(opt.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSortSelect(opt.value)}
                    tabIndex={0}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default BlogFilters
