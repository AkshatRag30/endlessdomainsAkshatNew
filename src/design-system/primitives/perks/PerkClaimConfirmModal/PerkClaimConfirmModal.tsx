import { useCallback, useEffect } from 'react'
import { GoAlert } from 'react-icons/go'
import { FiArrowRight, FiX } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import styles from './PerkClaimConfirmModal.module.scss'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PerkClaimConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  perkTitle: string
  partnerName: string
  perkType: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PerkClaimConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  perkTitle,
  partnerName,
  perkType,
}: PerkClaimConfirmModalProps) {

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  const handleConfirm = useCallback(() => {
    onConfirm()
  }, [onConfirm])

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
        aria-labelledby="perk-confirm-title"
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

        {/* Title + meta */}
        <div className={styles.textBlock}>
          <h3 className={styles.title} id="perk-confirm-title">{perkTitle}</h3>
          <p className={styles.meta}>By {partnerName}&nbsp;·&nbsp;{perkType}</p>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton
            onClick={handleConfirm}
            icon={<FiArrowRight aria-hidden="true" />}
            iconPosition="right"
          >
            Claim Now
          </PrimaryButton>
        </div>

        {/* Warning */}
        <p className={styles.warning} role="alert">
          <GoAlert className={styles.warningIcon} aria-hidden="true" />
          This Action Cannot Be Undone
        </p>

      </div>
    </div>
  )
}

export default PerkClaimConfirmModal
