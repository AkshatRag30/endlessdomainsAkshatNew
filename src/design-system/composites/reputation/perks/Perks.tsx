import { useCallback, useState } from 'react'
import Image from 'next/image'
import { MdLockOutline } from 'react-icons/md'
import endlessLogo from '../../../../../public/user-profile/endlessnewlogo.svg'
import silverTierIcon from '../../../../../public/reputation/silvertier.svg'
import goldTierIcon from '../../../../../public/reputation/goldtier.svg'
import styles from './Perks.module.scss'

// ── Types ──────────────────────────────────────────────────────────────────────

type PerkStatus = 'claimable' | 'available' | 'locked' | 'sold-out' | 'expired'
type PerkTier = 'bronze' | 'silver' | 'gold' | 'platinum'
type FilterTier = 'all' | PerkTier

interface PerkItem {
  id: string
  status: PerkStatus
  tier: PerkTier
  type: string
  title: string
  description: string
  partnerName: string
  partnerLogo: string
  claimedCount: number
  totalCount: number
  pointsRequired?: number
  currentPoints?: number
}

// ── Mock data (replace with API on integration) ────────────────────────────────

const MOCK_PERKS: PerkItem[] = [
  {
    id: '1',
    status: 'claimable',
    tier: 'bronze',
    type: 'NFT',
    title: 'Lorem Ipsum',
    description: 'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of',
    partnerName: 'Endless Domains',
    partnerLogo: endlessLogo as unknown as string,
    claimedCount: 14,
    totalCount: 50,
  },
  {
    id: '2',
    status: 'available',
    tier: 'silver',
    type: 'NFT',
    title: 'Lorem Ipsum',
    description: 'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority',
    partnerName: 'Endless Domains',
    partnerLogo: endlessLogo as unknown as string,
    claimedCount: 14,
    totalCount: 50,
  },
  {
    id: '3',
    status: 'locked',
    tier: 'silver',
    type: 'NFT',
    title: 'Lorem Ipsum',
    description: 'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority',
    partnerName: 'Endless Domains',
    partnerLogo: endlessLogo as unknown as string,
    claimedCount: 14,
    totalCount: 50,
    pointsRequired: 500,
    currentPoints: 312,
  },
  {
    id: '4',
    status: 'sold-out',
    tier: 'bronze',
    type: 'NFT',
    title: 'Lorem Ipsum',
    description: 'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of',
    partnerName: 'Endless Domains',
    partnerLogo: endlessLogo as unknown as string,
    claimedCount: 14,
    totalCount: 50,
  },
  {
    id: '5',
    status: 'expired',
    tier: 'bronze',
    type: 'NFT',
    title: 'Lorem Ipsum',
    description: 'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of',
    partnerName: 'Endless Domains',
    partnerLogo: endlessLogo as unknown as string,
    claimedCount: 14,
    totalCount: 50,
  },
  {
    id: '6',
    status: 'expired',
    tier: 'bronze',
    type: 'NFT',
    title: 'Lorem Ipsum',
    description: 'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of',
    partnerName: 'Endless Domains',
    partnerLogo: endlessLogo as unknown as string,
    claimedCount: 14,
    totalCount: 50,
  },
]

const FILTER_TIERS: FilterTier[] = ['all', 'bronze', 'silver', 'gold', 'platinum']

// ── Inner decorative frame (notch SVG border) ──────────────────────────────────
// design-specific: Figma Content Container with boolean-op notch at top-center.
// viewBox 0 0 429 128 matches inner frame proportions (449px card - 10px inset, ~128px tall).
// vectorEffect non-scaling-stroke keeps 1px line regardless of scale.

const CardFrame = ({ muted }: { muted: boolean }) => (
  <svg
    className={styles.frameSvg}
    viewBox="0 0 429 128"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M 272.5 0 L 429 0 L 429 128 L 0 128 L 0 0 L 156.5 0 L 167 22 L 262 22 L 272.5 0 Z"
      fill="none"
      stroke={muted ? 'rgba(0,0,0,0.07)' : 'rgba(38,57,237,0.18)'}
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
)

// ── Progress segments (locked state) ───────────────────────────────────────────

const TOTAL_SEGMENTS = 6

const ProgressSegments = ({ current, required }: { current: number; required: number }) => {
  const ratio = Math.min(current / required, 1)
  const filled = Math.floor(ratio * TOTAL_SEGMENTS)

  return (
    <div className={styles.progressSegs}>
      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
        let cls = styles.segmentEmpty
        if (i < filled) cls = styles.segmentFull
        else if (i === filled && ratio > 0) cls = styles.segmentPartial
        return <div key={i} className={`${styles.segment} ${cls}`} />
      })}
    </div>
  )
}

// ── Tier progress header bar ───────────────────────────────────────────────────
// design-specific: 79px white stripe bar showing current tier, progress, and next tier target.
// Segment widths and diamond position match Figma mock: 4 full / 1 partial / 1 empty (Silver → Gold).

const TierProgressHeader = () => (
  <header className={styles.tierProgressBar}>

    {/* Left: current tier icon + silver badge + points */}
    <div className={styles.tierLeft}>
      <Image
        src={silverTierIcon}
        alt="Silver tier"
        width={43}
        height={43}
        className={styles.tierIcon}
      />
      <div className={styles.tierCurrentBadge}>Silver</div>
      <div className={styles.tierPoints}>
        <span className={styles.tierPointsValue}>12</span>
        <span className={styles.tierPointsLabel}>/pts</span>
      </div>
    </div>

    {/* Center: segmented progress bar + diamond indicator */}
    <div className={styles.tierProgressCenter}>
      <div className={styles.tierSegs} role="presentation" aria-hidden="true">
        <div className={`${styles.tierSeg} ${styles.tierSegFull}`} />
        <div className={`${styles.tierSeg} ${styles.tierSegFull}`} />
        <div className={`${styles.tierSeg} ${styles.tierSegFull}`} />
        <div className={`${styles.tierSeg} ${styles.tierSegFull}`} />
        <div className={`${styles.tierSeg} ${styles.tierSegPartial}`} />
        <div className={`${styles.tierSeg} ${styles.tierSegEmpty}`} />
      </div>
      <div className={styles.tierDiamond} aria-hidden="true" />
    </div>

    {/* Right: gold tier badge with icon + "188 to gold" */}
    <div className={styles.tierNextBadge}>
      <Image
        src={goldTierIcon}
        alt=""
        width={22}
        height={22}
        aria-hidden="true"
      />
      <span>188 to gold</span>
    </div>

  </header>
)

// ── Individual perk card ───────────────────────────────────────────────────────

const PerkCard = ({ perk }: { perk: PerkItem }) => {
  const { status, tier, type, title, description, partnerName, partnerLogo, claimedCount, totalCount, pointsRequired, currentPoints } = perk

  const isBlurred = status === 'sold-out' || status === 'expired'
  const isLocked = status === 'locked'
  const isMuted = isBlurred || isLocked
  const headerClass = isLocked ? styles.header_locked : styles[`header_${tier}`]

  const pointsNeeded = (pointsRequired ?? 0) - (currentPoints ?? 0)

  return (
    <div className={styles.cardOuter}>

      {/* Status badge — top-right, outside the clip-path so it's not cut */}
      {status !== 'locked' && (
        <div className={`${styles.statusBadge} ${styles[`badge_${status.replace('-', '_')}`]}`} aria-label={`Status: ${status}`}>
          {(status === 'claimable' || status === 'available') && (
            <span className={styles.badgeStatusDot} aria-hidden="true" />
          )}
          {status === 'claimable' && 'Claim'}
          {status === 'available' && 'Available'}
          {status === 'sold-out' && 'Sold Out'}
          {status === 'expired' && 'EXPIRED'}
        </div>
      )}

      <div className={styles.cardWrap}>
        <article className={styles.card} aria-label={title}>

          {/* ── Image / logo header ─────────────────────────────────────── */}
          <div className={`${styles.cardHeader} ${headerClass}`}>
            <CardFrame muted={isMuted} />

            <Image
              src={partnerLogo}
              alt={partnerName}
              width={146}
              height={47}
              className={`${styles.logo} ${isBlurred ? styles.logoBlurred : ''}`}
            />

            {isLocked && (
              <div className={styles.lockCircle} aria-hidden="true">
                <MdLockOutline className={styles.lockIcon} />
              </div>
            )}
          </div>

          {/* ── Tier / type / claimed row ───────────────────────────────── */}
          <div className={styles.badgeRow}>
            <div className={styles.tierBadgesGroup}>
              <div className={`${styles.tierBadge} ${styles[`tier_${tier}`]}`} aria-label={`${tier} tier`}>
                <span className={styles.tierDot} aria-hidden="true" />
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </div>
              <div className={styles.typeBadge}>
                <span className={styles.typeDot} aria-hidden="true" />
                {type}
              </div>
            </div>
            <div className={styles.claimedPill} aria-label={`${claimedCount} of ${totalCount} claimed`}>
              {claimedCount}/{totalCount} Claimed
            </div>
          </div>

          {/* ── Text content ────────────────────────────────────────────── */}
          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDesc}>{description}</p>
          </div>

          {/* ── Footer: button or locked progress ───────────────────────── */}
          <div className={styles.cardFooter}>
            {isLocked ? (
              <div className={styles.lockedFooter}>
                <p className={styles.lockedText}>Need {pointsNeeded} more pts</p>
                <ProgressSegments current={currentPoints ?? 0} required={pointsRequired ?? 1} />
              </div>
            ) : (
              <button type="button" className={styles.ctaBtn}>
                <span>{status === 'available' ? 'Claim' : 'View'}</span>
              </button>
            )}
          </div>

        </article>
      </div>
    </div>
  )
}

// ── Perks catalog main component ───────────────────────────────────────────────

export default function Perks() {
  const [activeFilter, setActiveFilter] = useState<FilterTier>('all')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  const handleFilterChange = useCallback((tier: FilterTier) => {
    setActiveFilter(tier)
  }, [])

  const handleAvailableToggle = useCallback(() => {
    setShowAvailableOnly(prev => !prev)
  }, [])

  const displayedPerks = MOCK_PERKS.filter(p => {
    const tierMatch = activeFilter === 'all' || p.tier === activeFilter
    const availableMatch = !showAvailableOnly || p.status === 'available' || p.status === 'claimable'
    return tierMatch && availableMatch
  })

  return (
    <section className={styles.root} aria-label="Perks Catalog">

      {/* ── Tier progress header ─────────────────────────────────────────── */}
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

    </section>
  )
}
