import { useCallback, useState } from 'react'
import { GmModal } from '@/design-system/primitives/perks/GmModal'
import { GmStreakModal } from '@/design-system/primitives/perks/GmStreakModal'
import { MOCK_PERKS, FILTER_TIERS } from './perks.data'
import type { FilterTier, PerkStatus } from './perks.data'
import { PerksNavBar } from './PerksNavBar'
import type { GoldButtonVariant } from './PerksNavBar'
import { TierProgressHeader } from './TierProgressHeader'
import { PerkCard } from './PerkCard'
import styles from './Perks.module.scss'

// ── Perks catalog ──────────────────────────────────────────────────────────────

export default function Perks() {
  const [activeFilter, setActiveFilter] = useState<FilterTier>('all')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [showGmModal, setShowGmModal] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)

  // TODO: replace with real wallet/reputation checks from API/redux
  // 'gold' = wallet connected + reputation enabled (default)
  // 'enable-rep' = wallet connected but reputation NOT enabled
  // 'connect-wallet' = wallet not connected
  const [goldButtonVariant, setGoldButtonVariant] = useState<GoldButtonVariant>('gold')

  // TODO: replace with real "has user already GM'd today?" check from API/redux
  const alreadyGmd = true

  const handleFilterChange = useCallback((tier: FilterTier) => setActiveFilter(tier), [])

  const handleAvailableToggle = useCallback(() => setShowAvailableOnly(prev => !prev), [])

  const handleGoldClick = useCallback(() => {
    if (goldButtonVariant !== 'gold') return
    if (alreadyGmd) setShowStreakModal(true)
    else setShowGmModal(true)
  }, [goldButtonVariant, alreadyGmd])

  const handleGmModalClose = useCallback(() => setShowGmModal(false), [])
  const handleStreakModalClose = useCallback(() => setShowStreakModal(false), [])

  // Dev preview — state declared unconditionally (React hook rule); panel only renders in development
  const [devPanelOpen, setDevPanelOpen] = useState(true)
  const [devGmStatus, setDevGmStatus] = useState<'idle' | 'pending' | 'failed'>('idle')
  const [devStreakTier, setDevStreakTier] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('bronze')
  const [devCardState, setDevCardState] = useState<PerkStatus | null>(null)

  const handleDevOpenGm = useCallback((status: 'idle' | 'pending' | 'failed') => {
    setDevGmStatus(status)
    setShowGmModal(true)
  }, [])

  const handleDevOpenStreak = useCallback((tier: 'bronze' | 'silver' | 'gold' | 'platinum') => {
    setDevStreakTier(tier)
    setShowStreakModal(true)
  }, [])

  const AUTH_GATED_IDS = ['12', '13', '14']
  const displayedPerks = MOCK_PERKS
    .filter(p => {
      if (AUTH_GATED_IDS.includes(p.id)) return devCardState !== null
      const tierMatch = activeFilter === 'all' || p.tier === activeFilter
      const availableMatch = !showAvailableOnly || p.status === 'available' || p.status === 'claimable'
      return tierMatch && availableMatch
    })
    .map(p => {
      if (AUTH_GATED_IDS.includes(p.id) && devCardState !== null) return { ...p, status: devCardState }
      return p
    })

  return (
    <section className={styles.root} aria-label="Perks Catalog">

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <PerksNavBar onGoldClick={handleGoldClick} goldButtonVariant={goldButtonVariant} />

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
      <GmModal key={devGmStatus} isOpen={showGmModal} onClose={handleGmModalClose} initialStatus={devGmStatus} />
      <GmStreakModal isOpen={showStreakModal} onClose={handleStreakModalClose} tier={devStreakTier} />

      {/* ── Dev preview panel — bottom-right fixed, development only ─────── */}
      {process.env.NODE_ENV === 'development' && (
        <div className={`${styles.devPanel} ${devPanelOpen ? '' : styles.devPanelCollapsed}`} aria-label="Dev modal preview panel">
          <button
            type="button"
            className={styles.devPanelTitle}
            onClick={() => setDevPanelOpen(prev => !prev)}
            aria-expanded={devPanelOpen}
          >
            <span>Dev Preview</span>
            <span className={styles.devPanelChevron} aria-hidden="true">{devPanelOpen ? '▲' : '▼'}</span>
          </button>

          {devPanelOpen && (
            <>
              <div className={styles.devPanelGroup}>
                <span className={styles.devPanelGroupLabel}>GM Modal</span>
                <div className={styles.devPanelBtns}>
                  <button type="button" className={styles.devPanelBtn} onClick={() => handleDevOpenGm('idle')}>GM</button>
                  <button type="button" className={styles.devPanelBtn} onClick={() => handleDevOpenGm('pending')}>Pending</button>
                  <button type="button" className={styles.devPanelBtn} onClick={() => handleDevOpenGm('failed')}>Failed</button>
                </div>
              </div>

              <div className={styles.devPanelGroup}>
                <span className={styles.devPanelGroupLabel}>Streak Modal</span>
                <div className={styles.devPanelBtns}>
                  {(['bronze', 'silver', 'gold', 'platinum'] as const).map(tier => (
                    <button key={tier} type="button" className={styles.devPanelBtn} onClick={() => handleDevOpenStreak(tier)}>
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.devPanelGroup}>
                <span className={styles.devPanelGroupLabel}>Gold Button</span>
                <div className={styles.devPanelBtns}>
                  {(['gold', 'enable-rep', 'connect-wallet'] as const).map(v => (
                    <button
                      key={v}
                      type="button"
                      className={`${styles.devPanelBtn} ${goldButtonVariant === v ? styles.devPanelBtnActive : ''}`}
                      onClick={() => setGoldButtonVariant(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.devPanelGroup}>
                <span className={styles.devPanelGroupLabel}>Card State</span>
                <div className={styles.devPanelBtns}>
                  {(['login', 'get-domain', 'enable-rep'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`${styles.devPanelBtn} ${devCardState === s ? styles.devPanelBtnActive : ''}`}
                      onClick={() => setDevCardState(prev => prev === s ? null : s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.devPanelGroup}>
                <span className={styles.devPanelGroupLabel}>Claim Modals</span>
                <div className={styles.devPanelBtns}>
                  <span className={styles.devPanelGroupLabel}>Click any Claim card ↑</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

    </section>
  )
}
