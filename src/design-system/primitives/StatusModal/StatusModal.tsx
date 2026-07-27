import { useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'
import styles from './StatusModal.module.scss'

export type StatusModalTone = 'success' | 'error' | 'pending'

export interface StatusModalProps {
  tone: StatusModalTone
  icon: React.ReactNode
  heading: string
  description: React.ReactNode
  ariaLabelledBy: string
  onClose: () => void
  /** Narrows the description's max-width to match the original confirm-modal copy measure (284px vs the 320px default). */
  narrowDescription?: boolean
  ariaLive?: 'polite' | 'assertive'
  children?: React.ReactNode
}

const TONE_RING_CLASS: Record<StatusModalTone, string> = {
  success: styles.modalSuccess,
  error: styles.modalError,
  pending: styles.modalPending,
}

const TONE_ICON_RING_CLASS: Record<StatusModalTone, string> = {
  success: styles.iconRingSuccess,
  error: styles.iconRingError,
  pending: styles.iconRingPending,
}

const TONE_ICON_CIRCLE_CLASS: Record<StatusModalTone, string> = {
  success: styles.iconCircleSuccess,
  error: styles.iconCircleError,
  pending: styles.iconCirclePending,
}

// Shared shell for the small centered "here's what happened" status modals
// (success / error / pending confirmations) used across the GM create-nft and
// deploy-contract flows. Body content — buttons, hash rows, summary rows,
// notice banners — is passed as children so each call site only supplies the
// parts that differ.
export function StatusModal({
  tone,
  icon,
  heading,
  description,
  ariaLabelledBy,
  onClose,
  narrowDescription,
  ariaLive,
  children,
}: StatusModalProps) {
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
        className={`${styles.modal} ${TONE_RING_CLASS[tone]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-live={ariaLive}
        onClick={e => e.stopPropagation()}
      >
        <button ref={closeButtonRef} type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          <FiX size={20} aria-hidden="true" />
        </button>

        <div className={`${styles.iconRing} ${TONE_ICON_RING_CLASS[tone]}`}>
          <div className={`${styles.iconCircle} ${TONE_ICON_CIRCLE_CLASS[tone]}`}>
            {icon}
          </div>
        </div>

        <h2 id={ariaLabelledBy} className={styles.heading}>{heading}</h2>
        <p className={`${styles.description} ${narrowDescription ? styles.descriptionNarrow : ''}`}>
          {description}
        </p>

        {children}
      </div>
    </div>
  )
}

export default StatusModal
