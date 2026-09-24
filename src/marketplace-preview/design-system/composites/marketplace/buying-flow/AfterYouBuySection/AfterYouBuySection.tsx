import React from 'react'
import KeyValueRows from '@/marketplace-preview/design-system/primitives/cards/key-value-rows'
import { formatDate } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './AfterYouBuySection.module.scss'

export interface AfterYouBuySectionProps {
  sellerAddress: string
  expiresAt: string
}

/** Figma node 1:770 ("After you buy"). */
export const AfterYouBuySection = ({ sellerAddress, expiresAt }: AfterYouBuySectionProps) => (
  <section className={styles.section}>
    <h3 className={styles.heading}>After you buy</h3>
    <KeyValueRows
      className={styles.rows}
      rows={[
        { label: 'Ownership', value: 'transfers on chain instantly', valueColor: 'muted' },
        { label: 'Visible in your account', value: '10 to 15 minutes', valueColor: 'muted' },
        { label: 'Seller', value: sellerAddress, valueColor: 'muted' },
      ]}
    />
    <p className={styles.note}>
      This listing expires {formatDate(expiresAt)}. If the seller cancels or someone else buys first, the purchase will fail and nothing is
      charged.
    </p>
  </section>
)

export default AfterYouBuySection
