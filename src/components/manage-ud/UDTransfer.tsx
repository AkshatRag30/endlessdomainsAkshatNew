import { useState, useCallback } from 'react'
import { GoArrowSwitch, GoAlert } from 'react-icons/go'
import { TbMoodSad } from 'react-icons/tb'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { FiArrowRight, FiX } from 'react-icons/fi'

import { PrimaryButton } from '@/design-system/primitives/button'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import styles from './UDTransfer.module.scss'

interface UDTransferProps {
  domain: string
}

export function UDTransfer({ domain }: UDTransferProps) {
  const [recipient, setRecipient] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const canTransfer = agreed && recipient.length > 0

  const handleTransferClick = useCallback(() => {
    setShowConfirmModal(true)
  }, [])

  const handleConfirm = useCallback(() => {
    setShowConfirmModal(false)
  }, [])

  const handleCancel = useCallback(() => {
    setShowConfirmModal(false)
  }, [])

  return (
    <>
      <section className={styles.section}>
        <div className={styles.titleRow}>
          <GoArrowSwitch className={styles.titleIcon} aria-hidden="true" />
          <h2 className={styles.title}>Transfer Domain Ownership</h2>
        </div>

        <p className={styles.subtitle}>Link payment addresses</p>

        <div className={styles.warningBanner} role="alert">
          <GoAlert className={styles.warningIcon} aria-hidden="true" />
          <p className={styles.warningText}>
            Transferring This Domain Permanently Removes Your Ownership. You Will Lose All Management Access.&quot;
          </p>
        </div>

        <div className={styles.body}>
          <div className={styles.fieldGroup}>
            <label htmlFor="recipient-address" className={styles.fieldLabel}>
              Recipient Address:
            </label>
            <input
              id="recipient-address"
              type="text"
              className={[styles.input, recipient.length > 0 && recipient.length !== 42 ? styles.inputError : ''].filter(Boolean).join(' ')}
              placeholder="Enter Your ETH/Polygon Address Here"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
          </div>

          <label className={styles.agreementItem}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={agreed}
              onChange={() => setAgreed(prev => !prev)}
            />
            <span className={[styles.agreementLabel, agreed ? styles.agreementLabelChecked : ''].filter(Boolean).join(' ')}>
              I understand this transfer is permanent and cannot be undone
            </span>
          </label>

          {canTransfer && (
            <PrimaryButton
              variant="error"
              className={styles.actionBtn}
              onClick={handleTransferClick}
              icon={<FiArrowRight aria-hidden="true" />}
              iconPosition="right"
            >
              Transfer Domain
            </PrimaryButton>
          )}
        </div>
      </section>

      {showConfirmModal && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="transfer-modal-title"
          onClick={e => { if (e.target === e.currentTarget) handleCancel() }}
        >
          <div className={styles.modal}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleCancel}
              aria-label="Close"
            >
              <FiX size={18} />
            </button>

            <div className={styles.iconCircle} aria-hidden="true">
              <TbMoodSad className={styles.sadIcon} />
            </div>

            <div className={styles.modalText}>
              <h3 id="transfer-modal-title" className={styles.modalTitle}>
                Are You Sure You Want This Domain Permanently
              </h3>
              <p className={styles.modalSubtitle}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </div>

            <div className={styles.modalActions}>
              <SecondaryButton
                danger
                className={styles.cancelBtnFill}
                onClick={handleCancel}
                icon={<MdKeyboardDoubleArrowRight aria-hidden="true" />}
                iconPosition="right"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                className={styles.confirmBtnFill}
                onClick={handleConfirm}
                icon={<FiArrowRight aria-hidden="true" />}
                iconPosition="right"
              >
                Confirm
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UDTransfer
