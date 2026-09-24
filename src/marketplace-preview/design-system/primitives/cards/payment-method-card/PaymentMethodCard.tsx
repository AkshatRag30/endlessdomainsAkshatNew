import React from 'react'
import styles from './PaymentMethodCard.module.scss'

export interface PaymentMethodCardProps {
  label: string // "USDT from your wallet" / "Card"
  sublabel: string // "Balance {X} USDT on {chain}" / "Not enabled for domain purchases yet"
  selected: boolean
  disabled?: boolean
  onSelect?: () => void
}

/**
 * Figma nodes 1:703 (selected) / 1:711 (disabled) — one radio-style card in
 * the buying flow's "Pay with" grid. The 2-up grid itself is the caller's
 * layout. Rendered as role="radio" so a caller's role="radiogroup" wrapper
 * gets correct semantics without a hidden native input.
 */
export const PaymentMethodCard = ({ label, sublabel, selected, disabled = false, onSelect }: PaymentMethodCardProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    disabled={disabled}
    onClick={onSelect}
    className={[styles.card, selected ? styles.selected : '', disabled ? styles.disabled : ''].filter(Boolean).join(' ')}
  >
    <span className={styles.titleRow}>
      <span className={styles.radio} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </span>
    <span className={styles.sublabel}>{sublabel}</span>
  </button>
)

export default PaymentMethodCard
