import { useState, useCallback } from 'react'
import { GoArrowSwitch, GoAlert } from 'react-icons/go'
import { TbMoodSad } from 'react-icons/tb'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { FiArrowRight, FiX } from 'react-icons/fi'

import { PrimaryButton } from '@/design-system/primitives/button'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import styles from './BNBTransfer.module.scss'

interface BNBTransferProps {
  domain: string
}

export function BNBTransfer({ domain }: BNBTransferProps) {
  const [recipient, setRecipient] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [transferred, setTransferred] = useState(false)

  const canTransfer = agreed && recipient.length > 0

  const handleTransferClick = useCallback(() => {
    setShowConfirmModal(true)
  }, [])

  const handleConfirm = useCallback(() => {
    setShowConfirmModal(false)
    setTransferred(true)
  }, [])

  const handleCancel = useCallback(() => {
    setShowConfirmModal(false)
  }, [])

  if (transferred) {
    return (
      <section className={styles.section}>
        <div className={styles.titleRow}>
          <GoArrowSwitch className={styles.titleIcon} aria-hidden="true" />
          <h2 className={styles.title}>Transfer Domain Ownership</h2>
        </div>

        <p className={styles.subtitle}>Permanently transfer this BNB domain to another BSC address.</p>

        <div className={styles.transferredBanner} role="alert">
          <GoAlert className={styles.transferredIcon} aria-hidden="true" />
          <p className={styles.transferredText}>
            You can not manage this domain since you do not own this domain
          </p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className={styles.section}>
        <div className={styles.titleRow}>
          <GoArrowSwitch className={styles.titleIcon} aria-hidden="true" />
          <h2 className={styles.title}>Transfer Domain Ownership</h2>
        </div>

        <p className={styles.subtitle}>Permanently transfer this BNB domain to another BSC address.</p>

        <div className={styles.warningBanner} role="alert">
          <GoAlert className={styles.warningIcon} aria-hidden="true" />
          <p className={styles.warningText}>
            Transferring This Domain Permanently Removes Your Ownership. You Will Lose All Management Access.
          </p>
        </div>

        <div className={styles.body}>
          <div className={styles.fieldGroup}>
            <label htmlFor="bnb-recipient-address" className={styles.fieldLabel}>
              Recipient Address:
            </label>
            <input
              id="bnb-recipient-address"
              type="text"
              className={[styles.input, recipient.length > 0 && recipient.length !== 42 ? styles.inputError : ''].filter(Boolean).join(' ')}
              placeholder="Enter Recipient BSC/ETH Address (0x...)"
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
          aria-labelledby="bnb-transfer-modal-title"
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
              <h3 id="bnb-transfer-modal-title" className={styles.modalTitle}>
                Are You Sure You Want To Transfer This Domain?
              </h3>
              <p className={styles.modalSubtitle}>
                This action is permanent and cannot be undone. The domain will be transferred to the recipient address.
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

export default BNBTransfer
