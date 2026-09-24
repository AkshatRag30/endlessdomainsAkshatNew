import React from 'react'
import { FiLock } from 'react-icons/fi'
import { computeFeeBreakdown, formatToken, PLATFORM_FEE_RATE } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import TokenSuffix from '@/marketplace-preview/design-system/primitives/token-suffix'
import styles from './FeeBreakdownRow.module.scss'

export interface FeeBreakdownRowProps {
  priceUsd: number
  className?: string
}

/**
 * The three amounts share one font-size tier, picked off whichever of them
 * formats to the longest string, rather than each column sizing itself
 * independently — otherwise "Buyer pays" and "You receive" (usually close
 * in magnitude) would land at mismatched sizes next to each other. Three
 * tiers, stepping down as a domain's price gets large enough that
 * "16,920.00" becomes "1,234,567.00" and would otherwise overflow this
 * row's fixed 3-column width.
 */
function getAmountSizeTier(...values: number[]): 'lg' | 'md' | 'sm' {
  const longest = Math.max(...values.map((value) => formatToken(value).length))
  if (longest > 12) return 'sm'
  if (longest > 9) return 'md'
  return 'lg'
}

/** Figma node 1:8779/1:8780 — the 3-column "Buyer pays − Fee = You receive" breakdown pinned above the form's primary CTA. */
export const FeeBreakdownRow = ({ priceUsd, className = '' }: FeeBreakdownRowProps) => {
  const { buyerPays, feeAmount, youReceive } = computeFeeBreakdown(priceUsd)
  const shellClass = [styles.wrap, className].filter(Boolean).join(' ')
  const amountSize = getAmountSizeTier(buyerPays, feeAmount, youReceive)

  return (
    <div className={shellClass}>
      <div className={styles.row} data-amount-size={amountSize}>
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
