import { useCallback, useEffect, useState } from 'react'
import { FiX, FiCopy, FiCheck, FiArrowRight } from 'react-icons/fi'
import { BsCheck2 } from 'react-icons/bs'
import { PrimaryButton } from '@/design-system/primitives/button'
import styles from './PerkClaimSuccessModal.module.scss'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PerkClaimSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  promoCode?: string
  onViewPerks?: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PerkClaimSuccessModal({
  isOpen,
  onClose,
  promoCode = 'SAVE20NOW',
  onViewPerks,
}: PerkClaimSuccessModalProps) {

  const [copied, setCopied] = useState(false)

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  // Reset copied state when modal reopens
  useEffect(() => {
    if (isOpen) setCopied(false)
  }, [isOpen])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(promoCode).catch(() => {})
    setCopied(true)
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [promoCode])

  const handleViewPerks = useCallback(() => {
    onViewPerks?.()
    onClose()
  }, [onViewPerks, onClose])

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="perk-success-title"
      >

        {/* Close button */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={18} aria-hidden="true" />
        </button>

        {/* Green check icon — same structure as UDReverseNew */}
        <div className={styles.iconWrap} aria-hidden="true">
          <div className={styles.iconOuter}>
            <div className={styles.iconInner}>
              <BsCheck2 className={styles.checkIcon} aria-hidden="true" />
            </div>
          </div>
          <div className={styles.iconShadow} aria-hidden="true" />
        </div>

        {/* Title + subtitle */}
        <div className={styles.textBlock}>
          <p className={styles.title} id="perk-success-title">Perk Claimed!</p>
          <p className={styles.subtitle}>Also saved in My Perks</p>
        </div>

        {/* Promo code bar */}
        {promoCode && (
          <div className={styles.promoRow}>
            <span className={styles.promoCode}>{promoCode}</span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy promo code'}
            >
              {copied
                ? <FiCheck size={16} aria-hidden="true" />
                : <FiCopy size={16} aria-hidden="true" />
              }
            </button>
          </div>
        )}

        {/* View in My Perks button */}
        <PrimaryButton
          fullWidth
          onClick={handleViewPerks}
          icon={<FiArrowRight aria-hidden="true" />}
          iconPosition="right"
        >
          View In My Perks
        </PrimaryButton>

      </div>
    </div>
  )
}

export default PerkClaimSuccessModal
