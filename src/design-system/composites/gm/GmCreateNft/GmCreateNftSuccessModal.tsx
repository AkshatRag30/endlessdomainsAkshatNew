import { useEffect, useRef } from 'react'
import { FiX, FiCheck } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { GmCreateNftFormState } from './gmCreateNft.data'
import styles from './GmCreateNftSuccessModal.module.scss'

interface GmCreateNftSuccessModalProps {
  form: GmCreateNftFormState
  onClose: () => void
}

export function GmCreateNftSuccessModal({ form, onClose }: GmCreateNftSuccessModalProps) {
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
        aria-labelledby="create-nft-success-heading"
        onClick={e => e.stopPropagation()}
      >
        <button ref={closeButtonRef} type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          <FiX size={20} aria-hidden="true" />
        </button>

        <div className={styles.iconRing}>
          <div className={styles.iconCircle}>
            <FiCheck size={24} aria-hidden="true" className={styles.checkIcon} />
          </div>
        </div>

        <h2 id="create-nft-success-heading" className={styles.heading}>Collection Deployed</h2>
        <p className={styles.description}>
          {(form.collectionName.trim() || 'Your collection')} has been created and deployed on chain. It&apos;s ready to mint from.
        </p>

        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Symbol</span>
          <span className={styles.summaryValue}>{form.symbol.trim() || '-'}</span>
        </div>

        <PrimaryButton type="button" shape="octagon" fullWidth onClick={onClose}>
          Done
        </PrimaryButton>
      </div>
    </div>
  )
}

export default GmCreateNftSuccessModal
