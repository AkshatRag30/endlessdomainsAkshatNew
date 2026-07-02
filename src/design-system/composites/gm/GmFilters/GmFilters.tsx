import { useCallback } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import styles from './GmFilters.module.scss'

export type GmFilterTab = 'all' | 'hot' | 'favorites'

interface GmFiltersProps {
  activeTab: GmFilterTab
  onTabChange: (tab: GmFilterTab) => void
  search: string
  onSearchChange: (value: string) => void
}

const TABS: { key: GmFilterTab; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'hot',       label: 'Hot'       },
  { key: 'favorites', label: 'Favorites' },
]

export function GmFilters({ activeTab, onTabChange, search, onSearchChange }: GmFiltersProps) {
  const handleClear = useCallback(() => onSearchChange(''), [onSearchChange])

  return (
    <div className={styles.filtersBar}>

      {/* ── Tabs ── */}
      <div className={styles.tabs} role="tablist" aria-label="Filter chains">
        {TABS.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`${styles.tab} ${styles[`tab_${tab.key}`]} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div className={styles.searchForm}>
        <div className={styles.searchInputWrap}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Search chains"
          />
          {search && (
            <div className={styles.clearWrap}>
              <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
                <FiX size={14} />
              </button>
            </div>
          )}
        </div>
        <div className={styles.divider} aria-hidden="true" />
        <button className={styles.searchBtn} aria-label="Search chain">
          <FiSearch size={18} aria-hidden="true" />
          <span>Search chain</span>
        </button>
      </div>

    </div>
  )
}

export default GmFilters
