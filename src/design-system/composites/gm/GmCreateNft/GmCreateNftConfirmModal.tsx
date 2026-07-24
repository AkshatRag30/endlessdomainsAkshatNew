import { useEffect, useRef } from 'react'
import { FiX, FiInfo } from 'react-icons/fi'
import styles from './GmCreateNftConfirmModal.module.scss'

interface GmCreateNftConfirmModalProps {
  onClose: () => void
}

export function GmCreateNftConfirmModal({ onClose }: GmCreateNftConfirmModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-wallet-heading"
        onClick={e => e.stopPropagation()}
      >
        <button ref={closeButtonRef} type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          <FiX size={20} aria-hidden="true" />
        </button>

        <div className={styles.iconRing}>
          <div className={styles.iconCircle}>
            <span className={styles.spinner} aria-hidden="true" />
          </div>
        </div>

        <h2 id="confirm-wallet-heading" className={styles.heading}>Confirm In Your Wallet</h2>
        <p className={styles.description}>
          A signature request was sent to your wallet. Nothing is submitted until you approve it.
        </p>

        <div className={styles.notice} role="status">
          <FiInfo size={18} aria-hidden="true" className={styles.noticeIcon} />
          <p className={styles.noticeText}>
            Complete this within 10 minutes of signing — after that the transaction can no longer be verified and you&apos;ll need to restart.
          </p>
        </div>
      </div>
    </div>
  )
}

export default GmCreateNftConfirmModal
