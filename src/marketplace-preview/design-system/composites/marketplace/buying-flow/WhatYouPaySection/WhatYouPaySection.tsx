import React from 'react'
import Image from 'next/image'
import KeyValueRows from '@/marketplace-preview/design-system/primitives/cards/key-value-rows'
import TokenSuffix from '@/marketplace-preview/design-system/primitives/token-suffix'
import { formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './WhatYouPaySection.module.scss'

export interface WhatYouPaySectionProps {
  priceUsd: number
  networkFeeUsd: number
  balanceUsd: number
}

/**
 * Figma node 1:718 ("What you pay"). "Your balance after" is balance minus
 * the listing price only, not minus the Total: the reference frame shows
 * 41,200.00 − 8,460.00 = 32,740.00 against a Total of 8,460.42, i.e. the
 * network fee is treated as paid in the chain's gas token rather than from
 * the USDT balance. Kept as drawn; worth confirming with design once the
 * real payment rail (plan §8) is decided.
 */
export const WhatYouPaySection = ({ priceUsd, networkFeeUsd, balanceUsd }: WhatYouPaySectionProps) => {
  const suffix = <TokenSuffix iconSize={15} className={styles.suffix} />

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>What you pay</h3>
      <KeyValueRows
        className={styles.rows}
        rows={[
          { label: 'Listing price', value: <>{formatToken(priceUsd)} {suffix}</> },
          { label: 'Marketplace fee', value: 'Paid by the seller', valueColor: 'success' },
          { label: 'Network fee, estimated', value: <>≈ {formatToken(networkFeeUsd)} {suffix}</> },
          { label: 'Total', value: formatToken(priceUsd + networkFeeUsd), emphasis: true },
        ]}
      />
      <div className={styles.balanceRow}>
        <span>Your balance after</span>
        <strong>
          {formatToken(balanceUsd - priceUsd)} {suffix}
        </strong>
      </div>
      <div className={styles.callout}>
        <Image src="/assets/img/buying-flow/shield.svg" alt="" aria-hidden="true" width={15} height={15} className={styles.calloutIcon} />
        <p>Payment and transfer happen in the same transaction. There is no escrow and no moment where your money has left but the domain has not arrived.</p>
      </div>
    </section>
  )
}

export default WhatYouPaySection
