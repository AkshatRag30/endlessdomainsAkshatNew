import { useCallback, useState } from 'react'
import Image from 'next/image'
import { MdLockOutline } from 'react-icons/md'
import TierBadge from '@/design-system/composites/reputation/TierBadge/TierBadge'
import { PerkClaimConfirmModal } from '@/design-system/primitives/perks/PerkClaimConfirmModal'
import { PerkClaimSuccessModal } from '@/design-system/primitives/perks/PerkClaimSuccessModal'
import type { PerkItem } from '../perks.data'
import styles from './PerkCard.module.scss'

// ── Progress segments (locked state) ─────────────────────────────────────────

const TOTAL_SEGMENTS = 6

function ProgressSegments({ current, required }: { current: number; required: number }) {
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

// ── Perk card ─────────────────────────────────────────────────────────────────

interface PerkCardProps {
  perk: PerkItem
}

export function PerkCard({ perk }: PerkCardProps) {
  const {
    status, tier, type, title, description,
    partnerName, partnerLogo, claimedCount, totalCount,
    pointsRequired, currentPoints, expiredAt,
  } = perk

  const [showConfirm, setShowConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleClaimClick = useCallback(() => setShowConfirm(true), [])
  const handleConfirm = useCallback(() => { setShowConfirm(false); setShowSuccess(true) }, [])
  const handleConfirmClose = useCallback(() => setShowConfirm(false), [])
  const handleSuccessClose = useCallback(() => setShowSuccess(false), [])

  const isClaimable = status === 'available' || status === 'claimable'
  const isBlurred = status === 'sold-out' || status === 'expired'
  const isLocked = status === 'locked'
  const isAuthGated = status === 'login' || status === 'get-domain' || status === 'enable-rep'
  const headerClass = (isLocked || isAuthGated) ? styles.header_locked : styles[`header_${tier}`]
  const pointsNeeded = (pointsRequired ?? 0) - (currentPoints ?? 0)

  return (
    <>
      <div className={`${styles.cardOuter} ${status === 'expired' ? styles.cardOuter_expired : ''}`}>

        {/* Status badge — top-right, outside the clip-path so it's not cut */}
        {status !== 'locked' && !isAuthGated && (
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

            {/* ── Polygon header ──────────────────────────────────────────── */}
            <div className={`${styles.cardHeader} ${headerClass}`} />

            {/* ── Partner logo — sits between header polygon and badge row ─── */}
            <div className={styles.logoWrap}>
              <Image
                src={partnerLogo}
                alt={partnerName}
                width={146}
                height={47}
                className={`${styles.logo} ${isBlurred || isLocked ? styles.logoBlurred : ''}`}
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
              <div className={styles.cardTitleRow}>
                <h3 className={styles.cardTitle}>{title}</h3>
                {status === 'expired' && expiredAt && (
                  <span className={styles.expiredDatePill}>{expiredAt}</span>
                )}
              </div>
              <p className={styles.cardDesc}>{description}</p>
            </div>

            {/* ── Footer: button or locked progress ───────────────────────── */}
            <div className={styles.cardFooter}>
              {isLocked ? (
                <div className={styles.lockedFooter}>
                  <p className={styles.lockedText}>Need {pointsNeeded} more pts</p>
                  <ProgressSegments current={currentPoints ?? 0} required={pointsRequired ?? 1} />
                </div>
              ) : status === 'login' ? (
                <button type="button" className={styles.ctaBtn}>
                  <span>Log In To Claim</span>
                </button>
              ) : status === 'get-domain' ? (
                <button type="button" className={styles.ctaBtn}>
                  <span>Get A .Og Domain</span>
                </button>
              ) : status === 'enable-rep' ? (
                <button type="button" className={`${styles.ctaBtn} ${styles.ctaBtnDark}`}>
                  <span>Enable Reputation</span>
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.ctaBtn}
                  onClick={isClaimable ? handleClaimClick : undefined}
                  aria-haspopup={isClaimable ? 'dialog' : undefined}
                >
                  <span>{status === 'available' ? 'Claim' : 'View'}</span>
                </button>
              )}
            </div>

          </article>
        </div>
      </div>

      <PerkClaimConfirmModal
        isOpen={showConfirm}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        perkTitle={title}
        partnerName={partnerName}
        perkType={type}
      />

      <PerkClaimSuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
      />
    </>
  )
}

export default PerkCard
