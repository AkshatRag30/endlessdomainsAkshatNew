import React from 'react'
import Image from 'next/image'
import { formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './ApprovalExplainerStep.module.scss'

export interface ApprovalExplainerStepProps {
  priceUsd: number
  approvalFeeUsd: number
  purchaseFeeUsd: number
}

const INFO_ROWS = [
  { key: 'exact', lead: (price: string) => `Approving exactly ${price} USDT,`, rest: ' not your whole balance.' },
  { key: 'nothing-moves', lead: () => 'Nothing moves until you confirm the purchase', rest: ' in the next step.' },
  { key: 'two-prompts', lead: () => 'Two wallet prompts,', rest: ' then the domain is yours.' },
]

/**
 * Figma node 1:812 — reached from Review purchase when the wallet's USDT
 * allowance can't cover this exact price (plan §6.2). The drawer header
 * deliberately stays "Review purchase" here (unlike the listing flow's own
 * dedicated "One time approval" header) — consistent in the one frame that
 * shows it, so kept as drawn rather than "fixed".
 */
export const ApprovalExplainerStep = ({ priceUsd, approvalFeeUsd, purchaseFeeUsd }: ApprovalExplainerStepProps) => (
  <div className={styles.wrap}>
    <div className={styles.iconTile}>
      <Image src="/assets/img/buying-flow/gas-pump.svg" alt="" aria-hidden="true" width={25} height={25} />
    </div>
    <h3 className={styles.heading}>One approval before your first buy</h3>
    <p className={styles.subtext}>
      USDT is a token contract, so it has to be told that the marketplace may move the exact amount you are spending. This is standard for
      any token purchase.
    </p>

    <ul className={styles.infoCard}>
      {INFO_ROWS.map((row) => (
        <li key={row.key} className={styles.infoRow}>
          <Image src="/assets/img/buying-flow/info-check.svg" alt="" aria-hidden="true" width={14} height={14} className={styles.infoCheck} />
          <p>
            <strong>{row.lead(formatToken(priceUsd))}</strong>
            {row.rest}
          </p>
        </li>
      ))}
    </ul>

    <div className={styles.feeRow}>
      <span>Approval network fee</span>
      <strong>≈ {formatToken(approvalFeeUsd)} USDT</strong>
    </div>
    <div className={styles.feeRow}>
      <span>Purchase network fee</span>
      <strong>≈ {formatToken(purchaseFeeUsd)} USDT</strong>
    </div>
  </div>
)

export default ApprovalExplainerStep
