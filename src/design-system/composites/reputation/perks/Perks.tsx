import { useCallback, useState } from 'react'
import { GmModal } from '@/design-system/primitives/perks/GmModal'
import { GmStreakModal } from '@/design-system/primitives/perks/GmStreakModal'
import { MOCK_PERKS, FILTER_TIERS } from './perks.data'
import type { FilterTier } from './perks.data'
import { PerksNavBar } from './PerksNavBar'
import { TierProgressHeader } from './TierProgressHeader'
import { PerkCard } from './PerkCard'
import styles from './Perks.module.scss'

// ── Perks catalog ──────────────────────────────────────────────────────────────

export default function Perks() {
  const [activeFilter, setActiveFilter] = useState<FilterTier>('all')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [showGmModal, setShowGmModal] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)

  // TODO: replace with real "has user already GM'd today?" check from API/redux
  const alreadyGmd = true

  const handleFilterChange = useCallback((tier: FilterTier) => setActiveFilter(tier), [])

  const handleAvailableToggle = useCallback(() => setShowAvailableOnly(prev => !prev), [])

  const handleGoldClick = useCallback(() => {
    if (alreadyGmd) setShowStreakModal(true)
    else setShowGmModal(true)
  }, [alreadyGmd])

  const handleGmModalClose = useCallback(() => setShowGmModal(false), [])
  const handleStreakModalClose = useCallback(() => setShowStreakModal(false), [])

  const displayedPerks = MOCK_PERKS.filter(p => {
    const tierMatch = activeFilter === 'all' || p.tier === activeFilter
    const availableMatch = !showAvailableOnly || p.status === 'available' || p.status === 'claimable'
    return tierMatch && availableMatch
  })

  return (
    <section className={styles.root} aria-label="Perks Catalog">

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <PerksNavBar onGoldClick={handleGoldClick} />

      {/* ── Tier progress bar ────────────────────────────────────────────── */}
      <TierProgressHeader />

      {/* ── Filter bar ──────────────────────────────────────────────────── */}
      <nav className={styles.filterBar} aria-label="Filter perks">

        <div className={styles.filterTabs} role="tablist">
          {FILTER_TIERS.map(tier => {
            const isActive = activeFilter === tier
            const isAll = tier === 'all'
            return (
              <button
                key={tier}
                role="tab"
                type="button"
                aria-selected={isActive}
                className={[
                  styles.filterTab,
                  isAll ? styles.filterTabAll : '',
                  isActive ? styles.filterTabActive : '',
                ].join(' ')}
                onClick={() => handleFilterChange(tier)}
              >
                {tier === 'all' ? 'All' : tier.charAt(0).toUpperCase() + tier.slice(1)}
              </button>
            )
          })}
        </div>

        <div className={styles.filterRight}>
          <button
            type="button"
            className={`${styles.availableFilter} ${showAvailableOnly ? styles.availableFilterOn : ''}`}
            onClick={handleAvailableToggle}
            aria-pressed={showAvailableOnly}
          >
            <span className={styles.availableDot} aria-hidden="true" />
            Available
          </button>

          <button type="button" className={styles.sortBtn}>
            Nearest Unlock
            <span className={styles.addedBadge}>Added</span>
          </button>
        </div>

      </nav>

      {/* ── Perks grid ──────────────────────────────────────────────────── */}
      <div className={styles.grid}>
        {displayedPerks.map(perk => (
          <PerkCard key={perk.id} perk={perk} />
        ))}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <GmModal isOpen={showGmModal} onClose={handleGmModalClose} />
      <GmStreakModal isOpen={showStreakModal} onClose={handleStreakModalClose} />

    </section>
  )
}
