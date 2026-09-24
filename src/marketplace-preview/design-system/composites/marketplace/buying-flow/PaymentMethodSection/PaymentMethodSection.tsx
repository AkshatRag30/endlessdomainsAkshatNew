import React from 'react'
import PaymentMethodCard from '@/marketplace-preview/design-system/primitives/cards/payment-method-card'
import { formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './PaymentMethodSection.module.scss'

export interface PaymentMethodSectionProps {
  balanceUsd: number
  /** Lowercase chain name as Figma writes it, e.g. "polygon". */
  chainName: string
}

/**
 * Figma node 1:698 ("Pay with"). "USDT from your wallet" is the only live
 * method, always selected; "Card" is permanently disabled for this phase
 * (plan §1.2). The Card sublabel's Figma *layer name* is a stale copy of the
 * listing flow's Auction option ("Timed bidding. In the contract, not yet in
 * the int…") — the rendered text below is the frame's actual copy.
 */
export const PaymentMethodSection = ({ balanceUsd, chainName }: PaymentMethodSectionProps) => (
  <section className={styles.section}>
    <h3 className={styles.heading} id="buy-pay-with-heading">
      Pay with
    </h3>
    <div className={styles.grid} role="radiogroup" aria-labelledby="buy-pay-with-heading">
      <PaymentMethodCard label="USDT from your wallet" sublabel={`Balance ${formatToken(balanceUsd)} USDT on ${chainName}`} selected />
      <PaymentMethodCard label="Card" sublabel="Not enabled for domain purchases yet" selected={false} disabled />
    </div>
  </section>
)

export default PaymentMethodSection
