import React from 'react'
import { FiEdit3 } from 'react-icons/fi'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { formatExpiry, formatToken } from '../format'
import TokenSuffix from '../TokenSuffix'
import styles from './ConfirmToSignStep.module.scss'

export interface ConfirmToSignStepProps {
  domainLabel: string // e.g. "future.xyz"
  buyerPaysUsd: number
  feeUsd: number
  youReceiveUsd: number
  expiresAt: number
}

/**
 * Figma node 1:7791 ("Sign to go live") — only reached from the form when
 * the wallet is already approved (implementation plan §5's "already
 * approved shortcut"). The linked Figma frame shows "Platform fee" equal to
 * "Buyer pays" (a copy/paste placeholder, not a real 2.5% figure — "You
 * receive" in that same frame is correctly 2,096.25 against a 2,150 buyer
 * price, which only works out if the fee is 53.75, not 2,150), so the real
 * 2.5% fee computed by computeFeeBreakdown is used here instead of
 * reproducing that inconsistency.
 */
export const ConfirmToSignStep = ({ domainLabel, buyerPaysUsd, feeUsd, youReceiveUsd, expiresAt }: ConfirmToSignStepProps) => (
  <div className={styles.wrap}>
    <div className={styles.iconCircle}>
      <FiEdit3 size={24} aria-hidden="true" />
    </div>
    <h3 className={styles.heading}>Sign to go live</h3>
    <p className={styles.subtext}>
      A signature, not a transaction. It costs nothing, and {domainLabel} is on the marketplace the moment you sign.
    </p>

    <div className={styles.summaryCard}>
      <div className={styles.summaryRow}>
        <span>Domain</span>
        <strong>{domainLabel}</strong>
      </div>
      <div className={styles.summaryRow}>
        <span>Buyer pays</span>
        <strong>
          {formatToken(buyerPaysUsd)} <TokenSuffix />
        </strong>
      </div>
      <div className={styles.summaryRow}>
        <span>Platform fee · 2.5%</span>
        <strong>
          {formatToken(feeUsd)} <TokenSuffix />
        </strong>
      </div>
      <div className={`${styles.summaryRow} ${styles.summaryRowEmphasis}`}>
        <span>You receive</span>
        <strong>
          {formatToken(youReceiveUsd)} <TokenSuffix />
        </strong>
      </div>
      <div className={styles.summaryRow}>
        <span>Expires</span>
        <strong>{formatExpiry(expiresAt)}</strong>
      </div>
    </div>

    <div className={styles.feePill}>
      <span>Network fee for signing</span>
      <strong>None</strong>
    </div>
  </div>
)

export default ConfirmToSignStep

export interface ConfirmToSignFooterProps {
  onSign: () => void
  onBack: () => void
  submitting?: boolean
}

export const ConfirmToSignFooter = ({ onSign, onBack, submitting = false }: ConfirmToSignFooterProps) => (
  <div className={styles.footer}>
    <PrimaryButton fullWidth loading={submitting} onClick={onSign}>
      Sign to list
    </PrimaryButton>
    <button type="button" className={styles.backLink} onClick={onBack}>
      Back to the form
    </button>
  </div>
)
