import { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdLockOutline } from 'react-icons/md'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { TierBadge } from '@/design-system/composites/reputation/TierBadge'
import endlessLogo from '../../../../../public/user-profile/endlessnewlogo.svg'
import silverTierIcon from '../../../../../public/reputation/silvertier.svg'
import goldTierIcon from '../../../../../public/reputation/goldtier.svg'
import fireGif from '../../../../../public/reputation/fire.gif'
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
  {
    id: '7',
    status: 'claimable',
    tier: 'gold',
    type: 'Discount',
    title: 'Lorem Ipsum',
    description: 'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of',
    partnerName: 'Endless Domains',
    partnerLogo: endlessLogo as unknown as string,
    claimedCount: 7,
    totalCount: 30,
  },
  {
    id: '8',
    status: 'available',
    tier: 'gold',
    type: 'Whitelist',
    title: 'Lorem Ipsum',
    description: 'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority',
    partnerName: 'Endless Domains',
    partnerLogo: endlessLogo as unknown as string,
    claimedCount: 3,
    totalCount: 20,
  },
  {
    id: '9',
    status: 'locked',
    tier: 'gold',
    type: 'NFT',
    title: 'Lorem Ipsum',
    description: 'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority',
    partnerName: 'Endless Domains',
    partnerLogo: endlessLogo as unknown as string,
    claimedCount: 0,
    totalCount: 25,
    pointsRequired: 750,
    currentPoints: 312,
  },
  {
    id: '10',
    status: 'claimable',
    tier: 'platinum',
    type: 'Access',
    title: 'Lorem Ipsum',
    description: 'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of',
    partnerName: 'Endless Domains',
    partnerLogo: endlessLogo as unknown as string,
    claimedCount: 2,
    totalCount: 10,
  },
  {
    id: '11',
    status: 'locked',
    tier: 'platinum',
    type: 'NFT',
    title: 'Lorem Ipsum',
    description: 'here are many variations of passages of Lorem Ipsum available, but the majority here are many variations of passages of Lorem Ipsum available, but the majority',
    partnerName: 'Endless Domains',
    partnerLogo: endlessLogo as unknown as string,
    claimedCount: 0,
    totalCount: 5,
    pointsRequired: 1000,
    currentPoints: 312,
  },
]

const FILTER_TIERS: FilterTier[] = ['all', 'bronze', 'silver', 'gold', 'platinum']

// ── Nav bar ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Marketplace', href: '/' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Perks Catalog', href: '#' },
  { label: 'Parked Domains', href: '/parked-domains' },
]

const ArrowUpRight = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
    <path d="M1.5 6.5L6.5 1.5M6.5 1.5H2.5M6.5 1.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const HamburgerIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
    <rect y="0" width="20" height="2" rx="1" fill="white" />
    <rect y="7" width="20" height="2" rx="1" fill="white" />
    <rect y="14" width="20" height="2" rx="1" fill="white" />
  </svg>
)

const PerksNavBar = () => (
  <nav className={styles.perksNav} aria-label="Perks page navigation">
    <div className={styles.perksNavInner}>

      {/* Logo */}
      <Link href="/" className={styles.perksNavLogo} aria-label="Endless Domains home">
        <Image src={endlessLogo} alt="Endless Domains" width={112} height={40} />
      </Link>

      {/* Nav links */}
      <ul className={styles.perksNavLinks} role="list">
        {NAV_LINKS.map(link => (
          <li key={link.label}>
            <Link href={link.href} className={styles.perksNavLink}>
              <span className={styles.perksNavBracket} aria-hidden="true">[</span>
              <span className={styles.perksNavLinkText}>{link.label}</span>
              <ArrowUpRight />
              <span className={styles.perksNavBracket} aria-hidden="true">]</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Right actions */}
      <div className={styles.perksNavActions}>

        {/* Gold counter */}
        <div className={styles.perksNavGold} aria-label="12 Gold">
          <Image src={fireGif} alt="" width={24} height={24} aria-hidden="true" unoptimized />
          <span className={styles.perksNavGoldNum}>12</span>
          <span className={styles.perksNavGoldLabel}>Gold</span>
        </div>

        {/* Menu button */}
        <PrimaryButton variant="dark" icon={<HamburgerIcon />} iconPosition="right" aria-label="Open menu">
          Menu
        </PrimaryButton>

        {/* Cart */}
        <button type="button" className={styles.perksNavCart} aria-label="Open cart">
          <HiOutlineShoppingCart className={styles.perksNavCartIcon} />
        </button>

      </div>
    </div>
  </nav>
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
      <TierBadge tier="silver" />
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
    <TierBadge tier="gold">
      <Image
        src={goldTierIcon}
        alt=""
        width={22}
        height={22}
        aria-hidden="true"
      />
      <span>188 to gold</span>
    </TierBadge>

  </header>
)

// ── Individual perk card ───────────────────────────────────────────────────────

const PerkCard = ({ perk }: { perk: PerkItem }) => {
  const { status, tier, type, title, description, partnerName, partnerLogo, claimedCount, totalCount, pointsRequired, currentPoints } = perk

  const isBlurred = status === 'sold-out' || status === 'expired'
  const isLocked = status === 'locked'
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
              <TierBadge tier={tier} size="sm" showDot />
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

      {/* ── Page navigation ──────────────────────────────────────────────── */}
      <PerksNavBar />

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
