import { RxCross2 } from 'react-icons/rx'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import styles from './DisableModal.module.scss'

const REASSURANCES = [
  'Your GM history is kept',
  'Previously claimed perks are still yours',
  'You can re-enable anytime',
]

export interface DisableModalProps {
  onConfirm: () => void
  onClose: () => void
}

export default function DisableModal({ onConfirm, onClose }: DisableModalProps) {
  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Disable reputation tracking"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.card}>
        {/* decorative corner marks — same as Step 3 of ReputationModal */}
        {/* <div className={styles.cornerTL} aria-hidden="true" />
        <div className={styles.cornerTR} aria-hidden="true" /> */}
        {/* <div className={styles.cornerBL} aria-hidden="true" /> */}
        {/* <div className={styles.cornerBR} aria-hidden="true" /> */}

        {/* decorative dot pattern at top */}
        <div className={styles.dotPattern} aria-hidden="true" />

        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <RxCross2 size={12} aria-hidden="true" />
        </button>

        <div className={styles.body}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>Disable Reputation?</h2>
            <p className={styles.subtitle}>
              This will hide your score, remove you from public views, and disable perk claiming.
            </p>
          </div>

          <div className={styles.infoBox}>
            <ul className={styles.checkList}>
              {REASSURANCES.map(text => (
                <li key={text} className={styles.checkItem}>
                  <span className={styles.checkMark} aria-hidden="true">✓</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.actions}>
            <SecondaryButton
              danger
              className={styles.disableBtn}
              onClick={onConfirm}
            >
              Disable
            </SecondaryButton>

            <button
              type="button"
              className={`${styles.btn} ${styles.cancelBtn}`}
              onClick={onClose}
              aria-label="Cancel"
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
