import React, { useState, useCallback, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'

import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import { FilterSidebar } from '@/design-system/composites/mydomains/FilterSidebar'
import { DomainCollection } from '@/design-system/composites/mydomains/DomainCollection'
import { StatsBar } from '@/design-system/composites/mydomains/StatsBar'
import { SyncBanner } from '@/design-system/composites/mydomains/SyncBanner'
import { DomainSearchBar } from '@/design-system/composites/mydomains/DomainSearchBar'
import { DomainPagination } from '@/design-system/composites/mydomains/DomainPagination'
import type {
  DomainChain,
  DomainFilter,
  DomainItem,
  DomainStats,
  DomainStatus,
  ViewMode,
} from '@/design-system/composites/mydomains/types'
import styles from './mydomains.module.scss'

// FilterToggleSwitch uses GSAP which must only run client-side
const FilterToggleSwitch = dynamic(
  () =>
    import('@/design-system/composites/mydomains/FilterToggleSwitch').then(m => ({
      default: m.FilterToggleSwitch,
    })),
  { ssr: false },
)

// ── Placeholder data ───────────────────────────────────────────────────────────

const PLACEHOLDER_STATS: DomainStats = {
  total: 50,
  expiringSoon: 20,
  listedOnMarketplace: 25,
  notConfigured: 10,
}

const CHAINS: DomainChain[] = ['polygon', 'ethereum', 'solana', 'tezos', 'aptos']
const STATUSES: DomainStatus[] = ['unstoppable', 'ens', 'arbitrum', 'bonfida', 'tezos', 'aptos']

const PLACEHOLDER_DOMAINS: DomainItem[] = Array.from({ length: 120 }, (_, i) => ({
  id: `domain-${i + 1}`,
  name: 'theforceisunstoppcdzcasxassable',
  tld: '.ud',
  chain: CHAINS[i % CHAINS.length],
  status: STATUSES[i % STATUSES.length],
  expiryDate: i % 3 === 0 ? 'lifetime' : '12/12/2039',
  isListed: i % 4 === 0,
  isConfigured: i % 2 === 0,
}))

const TLD_PILLS: DomainStatus[][] = [
  ['unstoppable', 'ens'],
  ['arbitrum', 'bonfida'],
  ['tezos', 'aptos'],
]

const ITEMS_PER_PAGE = 12

// ── Page ───────────────────────────────────────────────────────────────────────

export default function MyDomainsPage() {
  const [domains] = useState<DomainItem[]>(PLACEHOLDER_DOMAINS)
  const [stats] = useState<DomainStats>(PLACEHOLDER_STATS)
  const [filters, setFilters] = useState<DomainFilter>({ search: '', tlds: [] })
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) setViewMode('grid')
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const [lastSynced] = useState('2 Hours Ago')
  const [syncBannerVisible, setSyncBannerVisible] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [tldFilterText, setTldFilterText] = useState('')

  const handleToggleFilters = useCallback(() => setFiltersOpen(prev => !prev), [])

  const handleReset = useCallback(() => {
    setFilters({ search: '', tlds: [] })
    setTldFilterText('')
    setCurrentPage(1)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
    setCurrentPage(1)
  }, [])

  const handleSearch = useCallback(() => setCurrentPage(1), [])

  const handleViewChange = useCallback((mode: ViewMode) => setViewMode(mode), [])

  const handleAddTld = useCallback((tld: string) => {
    setFilters(prev => ({
      ...prev,
      tlds: prev.tlds.includes(tld as DomainStatus) ? prev.tlds : [...prev.tlds, tld as DomainStatus],
    }))
    setCurrentPage(1)
  }, [])

  const handleRemoveTld = useCallback((tld: string) => {
    setFilters(prev => ({
      ...prev,
      tlds: prev.tlds.filter(t => t !== tld),
    }))
    setCurrentPage(1)
  }, [])

  const handleManage = useCallback((id: string) => {
    // TODO: route to domain detail page once route is defined
    console.info('Manage domain', id)
  }, [])

  const handleSync = useCallback(() => {
    setSyncBannerVisible(true)
    // TODO: trigger re-fetch from API
    console.info('Syncing domains…')
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const filteredDomains = useMemo(() => {
    let result = domains
    if (filters.tlds.length > 0) {
      result = result.filter(d => filters.tlds.includes(d.status))
    }
    if (filters.search.trim()) {
      const query = filters.search.trim().toLowerCase()
      result = result.filter(d => `${d.name}${d.tld}`.toLowerCase().includes(query))
    }
    return result
  }, [domains, filters])

  const totalPages = Math.max(1, Math.ceil(filteredDomains.length / ITEMS_PER_PAGE))

  const pagedDomains = useMemo(
    () => filteredDomains.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredDomains, currentPage],
  )

  return (
    <div className={styles.shell}>
      <TopNavBar
        logoSrc="/user-profile/endlessnewlogo.svg"
        avatarSrc="/user-profile/userpfp.png"
        avatarAlt="User avatar"
      />
      <DashboardTabBar />
      <StatsBar stats={stats} />
      <main className={styles.mainArea}>
        {loading ? (
          <div className={styles.page}>
            <p>Loading domains&hellip;</p>
          </div>
        ) : (
          <div className={styles.page}>
            {syncBannerVisible && <SyncBanner lastSynced={lastSynced} onSync={handleSync} />}

            <div className={styles.controlBar}>
              <div className={styles.filterToggleGroup}>
                <button
                  className={styles.filterToggleBtn}
                  type="button"
                  onClick={handleToggleFilters}
                  aria-expanded={filtersOpen}
                  aria-controls="filter-panel"
                >
                  <FilterToggleSwitch isOpen={filtersOpen} />
                  <span className={styles.filterLabel}>Filters</span>
                </button>
                <button
                  className={styles.resetBtn}
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset all filters"
                >
                  Reset
                </button>
              </div>

              <div className={styles.searchBarWrap}>
                <DomainSearchBar
                  value={filters.search}
                  onChange={handleSearchChange}
                  onSearch={handleSearch}
                  viewMode={viewMode}
                  onViewChange={handleViewChange}
                  onSync={handleSync}
                />
              </div>
            </div>

            <div className={styles.contentArea}>
              {filtersOpen && (
                <div id="filter-panel" className={styles.filterPanel}>
                  <FilterSidebar
                    endings={filters.tlds}
                    onRemoveEnding={handleRemoveTld}
                    onAddEnding={handleAddTld}
                    tldPills={TLD_PILLS}
                    filterText={tldFilterText}
                    onFilterText={setTldFilterText}
                  />
                </div>
              )}

              <div className={styles.mainContent}>
                <DomainCollection domains={pagedDomains} viewMode={viewMode} onManage={handleManage} />
                <DomainPagination current={currentPage} total={totalPages} onPageChange={handlePageChange} />
              </div>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
