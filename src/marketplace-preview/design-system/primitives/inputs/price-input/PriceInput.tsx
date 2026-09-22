import React from 'react'
import Image from 'next/image'
import { getCurrencyInfo } from '@/marketplace-preview/helpers/chaincurrency/chaincurrency'
import styles from './PriceInput.module.scss'

export interface PriceInputProps {
  value: string
  onChange: (value: string) => void
  tokenSymbol: string
  tokenIcon?: React.ReactNode
  disabled?: boolean
  className?: string
}

/** Digits-and-one-decimal-point only — same intent as the old PriceInput.tsx's regex, reimplemented rather than copied (see plan §4.2). */
function sanitize(raw: string): string {
  const cleaned = raw.replace(/[^0-9.]/g, '')
  const [head, ...rest] = cleaned.split('.')
  return rest.length ? `${head}.${rest.join('')}` : head
}

/** Figma node 1:8674 ("Number Input" + token chip) — the listing flow's price field. */
export const PriceInput = ({ value, onChange, tokenSymbol, tokenIcon, disabled = false, className = '' }: PriceInputProps) => {
  const shellClass = [styles.field, className].filter(Boolean).join(' ')
  const currency = getCurrencyInfo(tokenSymbol)

  return (
    <div className={shellClass}>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(sanitize(event.target.value))}
        placeholder="0"
        className={styles.input}
        aria-label={`Price in ${tokenSymbol}`}
      />
      <span className={styles.token}>
        {tokenIcon ?? (currency.icon ? (
          <Image src={currency.icon} alt="" aria-hidden="true" width={15} height={15} className={styles.tokenIcon} />
        ) : null)}
        {tokenSymbol}
      </span>
    </div>
  )
}

export default PriceInput
