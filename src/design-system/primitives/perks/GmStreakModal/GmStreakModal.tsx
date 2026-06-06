import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { FiX, FiCopy, FiShare2 } from 'react-icons/fi'
import TierBadge from '@/design-system/composites/reputation/TierBadge/TierBadge'
import bronzeEmblemSvg from '../../../../../public/reputation/bronzeembelem.svg'
import silverEmblemSvg from '../../../../../public/reputation/silverembelem.svg'
import goldEmblemSvg from '../../../../../public/reputation/goldembelem.svg'
import platinumEmblemSvg from '../../../../../public/reputation/platinumembelem.svg'
import fireGif from '../../../../../public/reputation/fire.gif'
import styles from './GmStreakModal.module.scss'

// ── Types ─────────────────────────────────────────────────────────────────────

export type GmStreakTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface GmStreakModalProps {
  isOpen: boolean
  onClose: () => void
  username?: string
  tier?: GmStreakTier
  streakDays?: number
  ptsToNextTier?: number
  nextTierLabel?: string
  chain?: string
  walletAddress?: string
  onViewTx?: () => void
  onShare?: () => void
}

// ── Tier config ───────────────────────────────────────────────────────────────

const TIER_EMBLEMS: Record<GmStreakTier, string> = {
  bronze:   bronzeEmblemSvg,
  silver:   silverEmblemSvg,
  gold:     goldEmblemSvg,
  platinum: platinumEmblemSvg,
}

// TODO: replace with per-tier chain icons when other tier designs are provided
const CHAIN_ICON = 'https://www.figma.com/api/mcp/asset/69f7c5df-c88b-43af-969c-d7809c11c991'

// ── Component ─────────────────────────────────────────────────────────────────

export function GmStreakModal({
  isOpen,
  onClose,
  username = 'myname.ud',
  tier = 'bronze',
  streakDays = 13,
  ptsToNextTier = 340,
  nextTierLabel = 'Gold',
  chain = 'Polygon',
  walletAddress = '0x723FE05c...30446DfEdD',
  onViewTx,
  onShare,
}: GmStreakModalProps) {

  const [copied, setCopied] = useState(false)

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  useEffect(() => {
    if (isOpen) setCopied(false)
  }, [isOpen])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(walletAddress).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [walletAddress])

  const handleViewTx = useCallback(() => { onViewTx?.() }, [onViewTx])
  const handleShare = useCallback(() => { onShare?.() }, [onShare])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modalWrap}>

        {/* Close button — right: -2px top: -1px (Figma spec, hangs just outside border) */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={16} aria-hidden="true" />
        </button>

        <div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gm-streak-title"
          onClick={e => e.stopPropagation()}
        >
          {/* Stripe background overlay */}
          <div className={styles.stripe} aria-hidden="true" />

          {/* ── Tier emblem + fire gif inside CSS ring ────────────────── */}
          <div className={styles.emblemWrap} aria-hidden="true">
            <div className={styles.emblemRing}>
              <Image className={styles.emblemSvg} src={TIER_EMBLEMS[tier]} alt="" width={132} height={164} />
              <Image className={styles.emblemFire} src={fireGif} alt="" width={52} height={52} unoptimized />
            </div>
          </div>

          {/* ── "GM" gradient text ─────────────────────────────────────── */}
          <p className={styles.gmText} id="gm-streak-title" aria-label="GM">GM</p>

          {/* ── User row: avatar + username + tier badge ───────────────── */}
          <div className={styles.userRow}>
            <div className={styles.avatarRing}>
              <div className={styles.avatarInner} aria-hidden="true" />
            </div>
            <span className={styles.username}>{username}</span>
            <TierBadge tier={tier} size="md" />
          </div>

          {/* ── Streak section ─────────────────────────────────────────── */}
          <div className={styles.streakSection}>
            <div className={styles.streakNumRow}>
              <span className={styles.streakNum}>{streakDays}</span>
              <span className={styles.streakLabel}>Day Streak</span>
            </div>
            <p className={styles.streakPts}>
              {ptsToNextTier} pts to{' '}
              <span className={styles.nextTierName}>{nextTierLabel}</span>
            </p>
          </div>

          {/* ── Chain + wallet info ────────────────────────────────────── */}
          <div className={styles.chainSection}>
            <div className={styles.chainDivider} aria-hidden="true" />
            <div className={styles.chainRow}>
              <div className={styles.chainInfo}>
                <img src={CHAIN_ICON} alt={chain} className={styles.chainIcon} />
                <span className={styles.chainName}>{chain}</span>
              </div>
              <div className={styles.chainVertDivider} aria-hidden="true" />
              <div className={styles.addressRow}>
                <span className={styles.walletAddress}>{walletAddress}</span>
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={handleCopy}
                  aria-label={copied ? 'Copied' : 'Copy wallet address'}
                >
                  <FiCopy size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className={styles.chainDivider} aria-hidden="true" />
          </div>

          {/* ── Bottom actions: share + view TX ───────────────────────── */}
          <div className={styles.bottomActions}>
            <button
              type="button"
              className={styles.shareBtn}
              onClick={handleShare}
              aria-label="Share GM"
            >
              <FiShare2 size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.viewTxBtn}
              onClick={handleViewTx}
              aria-label="View transaction on explorer"
            >
              <span className={styles.viewTxText}>View TX&nbsp;&nbsp;↗</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default GmStreakModal
