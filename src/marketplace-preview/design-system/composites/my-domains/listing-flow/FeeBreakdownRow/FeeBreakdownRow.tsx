import React from 'react'
import { FiLock } from 'react-icons/fi'
import { computeFeeBreakdown, formatToken, PLATFORM_FEE_RATE } from '../format'
import TokenSuffix from '../TokenSuffix'
import styles from './FeeBreakdownRow.module.scss'

export interface FeeBreakdownRowProps {
  priceUsd: number
  className?: string
}

/** Figma node 1:8779/1:8780 — the 3-column "Buyer pays − Fee = You receive" breakdown pinned above the form's primary CTA. */
export const FeeBreakdownRow = ({ priceUsd, className = '' }: FeeBreakdownRowProps) => {
  const { buyerPays, feeAmount, youReceive } = computeFeeBreakdown(priceUsd)
  const shellClass = [styles.wrap, className].filter(Boolean).join(' ')

  return (
    <div className={shellClass}>
      <div className={styles.row}>
        <div className={styles.item}>
          <span className={styles.label}>Buyer pays</span>
          <span className={styles.value}>
            {formatToken(buyerPays)} <TokenSuffix />
          </span>
        </div>
        <span className={styles.operator}>−</span>
        <div className={styles.item}>
          <span className={styles.label}>Fee {(PLATFORM_FEE_RATE * 100).toFixed(1)}%</span>
          <span className={styles.value}>
            {formatToken(feeAmount)} <TokenSuffix />
          </span>
        </div>
        <span className={styles.operator}>=</span>
        <div className={styles.item}>
          <span className={styles.label}>You receive</span>
          <span className={styles.valueEmphasis}>
            {formatToken(youReceive)} <TokenSuffix />
          </span>
        </div>
      </div>
      <p className={styles.note}>
        <FiLock size={13} aria-hidden="true" />
        Written into the order you sign. Nobody can change these afterwards.
      </p>
    </div>
  )
}

export default FeeBreakdownRow
