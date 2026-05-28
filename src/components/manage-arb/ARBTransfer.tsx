import { useState, useCallback } from 'react'
import { GoArrowSwitch, GoAlert } from 'react-icons/go'
import { TbMoodSad } from 'react-icons/tb'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { FiArrowRight, FiX } from 'react-icons/fi'

import { PrimaryButton } from '@/design-system/primitives/button'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import styles from './ARBTransfer.module.scss'

interface ARBTransferProps {
  domain: string
}

export function ARBTransfer({ domain }: ARBTransferProps) {
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
          <h2 className={styles.title}>Transfer Identity Ownership</h2>
        </div>

        <p className={styles.subtitle}>Link payment addresses</p>

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
          <h2 className={styles.title}>Transfer Identity Ownership</h2>
        </div>

        <p className={styles.subtitle}>Link payment addresses</p>

        <div className={styles.warningBanner} role="alert">
          <GoAlert className={styles.warningIcon} aria-hidden="true" />
          <p className={styles.warningText}>
            You are about to permanently transfer this identity to another wallet. This action cannot be undone.
          </p>
        </div>

        <div className={styles.body}>
          <div className={styles.fieldGroup}>
            <label htmlFor="arb-recipient-address" className={styles.fieldLabel}>
              Recipient Address
            </label>
            <input
              id="arb-recipient-address"
              type="text"
              className={[styles.input, recipient.length > 0 && recipient.length !== 42 ? styles.inputError : ''].filter(Boolean).join(' ')}
              placeholder="Enter the wallet address of the new owner"
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
              I understand this transfer is permanent and cannot be reversed.
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
              Transfer Identity
            </PrimaryButton>
          )}
        </div>
      </section>

      {showConfirmModal && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="arb-transfer-modal-title"
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
              <h3 id="arb-transfer-modal-title" className={styles.modalTitle}>
                Are you sure you want this Transfer Permanently?
              </h3>
              <p className={styles.modalSubtitle}>
                This identity will be removed from your wallet and ownership will pass to the recipient address. You cannot undo this.
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
                Go Back
              </SecondaryButton>
              <PrimaryButton
                variant="error"
                className={styles.confirmBtnFill}
                onClick={handleConfirm}
                icon={<FiArrowRight aria-hidden="true" />}
                iconPosition="right"
              >
                Yes, Transfer
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ARBTransfer
