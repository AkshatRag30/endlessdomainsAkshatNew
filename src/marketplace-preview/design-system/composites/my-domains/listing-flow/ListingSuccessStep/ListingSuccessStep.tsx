import React from 'react'
import { FiCheck } from 'react-icons/fi'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { formatExpiry, formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import TokenSuffix from '@/marketplace-preview/design-system/primitives/token-suffix'
import styles from './ListingSuccessStep.module.scss'

export interface ListingSuccessStepProps {
  domainLabel: string // e.g. "future.xyz"
  listedAtUsd: number
  youReceiveUsd: number
  expiresAt: number
}

/** Figma node 1:8453 ("Sign to list" success frame) — body between the modal's header and pinned footer. */
export const ListingSuccessStep = ({ domainLabel, listedAtUsd, youReceiveUsd, expiresAt }: ListingSuccessStepProps) => (
  <div className={styles.wrap}>
    <div className={styles.iconCircle}>
      <FiCheck size={26} aria-hidden="true" />
    </div>
    <h3 className={styles.heading}>{domainLabel} is live.</h3>
    <p className={styles.subtext}>On the marketplace right now. No pending state, nothing to wait for.</p>

    <div className={styles.summaryCard}>
      <div className={styles.summaryRow}>
        <span>Listed at</span>
        <strong>
          {formatToken(listedAtUsd)} <TokenSuffix />
        </strong>
      </div>
      <div className={styles.summaryRow}>
        <span>You receive on sale</span>
        <strong>
          {formatToken(youReceiveUsd)} <TokenSuffix />
        </strong>
      </div>
      <div className={styles.summaryRow}>
        <span>Expires</span>
        <strong>{formatExpiry(expiresAt)}</strong>
      </div>
    </div>

    <p className={styles.note}>
      Cancel any time, free and instant. Worth knowing: cancelling stops us serving the listing immediately, but the signature you
      created still exists until the expiry above.
    </p>
  </div>
)

export default ListingSuccessStep

export interface ListingSuccessFooterProps {
  onListAnother: () => void
}

export const ListingSuccessFooter = ({ onListAnother }: ListingSuccessFooterProps) => (
  <div className={styles.footer}>
    <PrimaryButton fullWidth onClick={onListAnother}>
      List another
    </PrimaryButton>
  </div>
)
