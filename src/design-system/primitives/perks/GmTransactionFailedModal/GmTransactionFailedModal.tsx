import { useCallback, useEffect } from 'react'
import { IoWarning } from 'react-icons/io5'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import styles from './GmTransactionFailedModal.module.scss'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GmTransactionFailedModalProps {
  isOpen: boolean
  onClose: () => void
  chainName?: string
  onTryAgain?: () => void
  onPickChain?: () => void
}

// ── Icon sub-components ───────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ── Component ─────────────────────────────────────────────────────────────────

export function GmTransactionFailedModal({
  isOpen,
  onClose,
  chainName = 'Polygon',
  onTryAgain,
  onPickChain,
}: GmTransactionFailedModalProps) {

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  const handleTryAgain = useCallback(() => {
    onTryAgain?.()
  }, [onTryAgain])

  const handlePickChain = useCallback(() => {
    onPickChain?.()
  }, [onPickChain])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gm-failed-title"
        onClick={e => e.stopPropagation()}
      >

        {/* Close button */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {/* Icon + text */}
        <div className={styles.content}>
          <div className={styles.iconWrap} aria-hidden="true">
            <div className={styles.outerRing}>
              <div className={styles.innerCircle}>
                <IoWarning size={34} color="white" aria-hidden="true" />
              </div>
            </div>
            <div className={styles.shadowEllipse} aria-hidden="true" />
          </div>

          <div className={styles.textBlock}>
            <h2 className={styles.title} id="gm-failed-title">Transaction Failed</h2>
            <p className={styles.subtitle}>
              Gas was insufficient on {chainName}. Try again or pick a different chain.
            </p>
          </div>
        </div>

        {/* Footer action bar */}
        <div className={styles.footer}>
          <SecondaryButton onClick={handleTryAgain}>Try Again ↗</SecondaryButton>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handlePickChain}
            aria-label="Pick Another Chain"
          >
            <span className={styles.primaryBtnText}>Pick Another Chain&nbsp;&nbsp;↗</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default GmTransactionFailedModal
