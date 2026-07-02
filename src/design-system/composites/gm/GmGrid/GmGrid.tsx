import { useState, useCallback, useMemo } from 'react'
import { GM_CHAINS, GmChain } from '../gm.data'
import { GmFilters, GmFilterTab } from '../GmFilters/GmFilters'
import { GmChainCard } from '../GmChainCard/GmChainCard'
import { GmSidebar } from '../GmSidebar/GmSidebar'
import styles from './GmGrid.module.scss'

export function GmGrid() {
  const [activeTab, setActiveTab] = useState<GmFilterTab>('hot')
  const [search, setSearch] = useState('')
  const [chains, setChains] = useState<GmChain[]>(GM_CHAINS)

  const handleSayGm = useCallback((id: string) => {
    // Integrate real on-chain GM call here
    console.log('Said GM on chain:', id)
  }, [])

  const handleToggleFavorite = useCallback((id: string) => {
    setChains(prev => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c))
  }, [])

  const filtered = useMemo(() => {
    let list = chains
    if (activeTab === 'hot')       list = list.filter(c => c.hot)
    if (activeTab === 'favorites') list = list.filter(c => c.favorite)
    if (search.trim())             list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [chains, activeTab, search])

  return (
    <section className={styles.section} aria-label="GM chains">
      <GmFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearchChange={setSearch}
      />

      <div className={styles.layout}>

        {/* ── Cards grid ── */}
        <div className={styles.gridWrap}>
          {filtered.length > 0 ? (
            <ul className={styles.grid} aria-label="Chain list">
              {filtered.map(chain => (
                <li key={chain.id}>
                  <GmChainCard
                    chain={chain}
                    onSayGm={handleSayGm}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty} role="status">
              <p className={styles.emptyText}>No chains match your search.</p>
            </div>
          )}
        </div>

        {/* ── Sidebar — hidden on mobile ── */}
        <div className={styles.sidebarWrap}>
          <GmSidebar />
        </div>

      </div>
    </section>
  )
}

export default GmGrid
