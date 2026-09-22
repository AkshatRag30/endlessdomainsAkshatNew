import React from 'react'
import { FiCheck } from 'react-icons/fi'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import styles from './OneTimeApprovalStep.module.scss'

export interface OneTimeApprovalStepProps {
  approvalFeeEstimate: string // pre-formatted, e.g. "≈ 0.02 POL"
}

/** Figma node 1:8539 ("One time approval") — the body between the modal's header and pinned footer. */
export const OneTimeApprovalStep = ({ approvalFeeEstimate }: OneTimeApprovalStepProps) => (
  <div className={styles.wrap}>
    <div className={styles.iconCircle}>
      <FiCheck size={24} aria-hidden="true" />
    </div>
    <h3 className={styles.heading}>One approval, once ever</h3>
    <p className={styles.subtext}>
      Before your first listing, Seaport needs permission to move a domain when a sale settles. Your wallet will word this as
      permission to transfer your domains, which sounds broader than it is.
    </p>

    <div className={styles.infoCard}>
      <div className={styles.infoRow}>
        <FiCheck size={13} aria-hidden="true" className={styles.infoCheck} />
        <p><strong>You are approving Seaport,</strong> the open settlement contract, not Endless Domains.</p>
      </div>
      <div className={styles.infoRow}>
        <FiCheck size={13} aria-hidden="true" className={styles.infoCheck} />
        <p><strong>A transfer only happens on a completed sale</strong> at the price you set.</p>
      </div>
      <div className={styles.infoRow}>
        <FiCheck size={13} aria-hidden="true" className={styles.infoCheck} />
        <p><strong>You are asked once.</strong> Every listing after this is a signature and nothing else.</p>
      </div>
    </div>

    <div className={styles.feeRow}>
      <span>One time approval, network fee</span>
      <strong>{approvalFeeEstimate}</strong>
    </div>
    <div className={`${styles.feeRow} ${styles.feeRowFree}`}>
      <span>Listing itself, now and forever</span>
      <strong>Free</strong>
    </div>
  </div>
)

export default OneTimeApprovalStep

export interface OneTimeApprovalFooterProps {
  onApprove: () => void
  onBack: () => void
  submitting?: boolean
}

export const OneTimeApprovalFooter = ({ onApprove, onBack, submitting = false }: OneTimeApprovalFooterProps) => (
  <div className={styles.footer}>
    <PrimaryButton fullWidth loading={submitting} onClick={onApprove}>
      Approve in wallet
    </PrimaryButton>
    <button type="button" className={styles.backLink} onClick={onBack}>
      Back to the form
    </button>
  </div>
)
