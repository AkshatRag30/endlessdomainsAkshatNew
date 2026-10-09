import React, { useState } from 'react'
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

/**
 * Digits-and-one-decimal-point only — same intent as the old
 * PriceInput.tsx's regex, reimplemented rather than copied (see plan §4.2).
 * Also caps the fractional part at 6 digits, USDT's own decimal precision —
 * a 7th digit can't be represented on chain and must never reach
 * ethers.utils.parseUnits(value, 6) at submit time. Leading zeros are
 * collapsed ("007" → "7", "00.5" → "0.5") and a bare "." becomes "0.".
 */
function sanitize(raw: string): string {
  const cleaned = raw.replace(/[^0-9.]/g, '')
  const [rawHead, ...rest] = cleaned.split('.')
  const head = rawHead.replace(/^0+(?=\d)/, '')
  if (!rest.length) return head
  return `${head || '0'}.${rest.join('').slice(0, 6)}`
}

/**
 * Highest price the field accepts: 9 billion USDT. In 6-decimal minor
 * units that's 9e15, just under Number.MAX_SAFE_INTEGER (~9.007e15), so
 * the amount stays exact anywhere it's handled as a plain JS number —
 * our own read-back (Number(priceUsdt) / 1e6) and, potentially, the backend.
 */
export const MAX_PRICE = 9_000_000_000

/** Figma node 1:8674 ("Number Input" + token chip) — the listing flow's price field. */
export const PriceInput = ({ value, onChange, tokenSymbol, tokenIcon, disabled = false, className = '' }: PriceInputProps) => {
  const shellClass = [styles.field, className].filter(Boolean).join(' ')
  const currency = getCurrencyInfo(tokenSymbol)
  // The value a too-big keystroke was dropped at. Tied to that exact value
  // (not a plain flag) so the note clears by itself the moment the price
  // changes for any reason: a deletion, a quick-price pill, or the modal
  // resetting the field. Also shown for an older listing already priced
  // above the cap (Edit Price).
  const [blockedAt, setBlockedAt] = useState<string | null>(null)
  const showLimitNote = blockedAt === value || Number(value) > MAX_PRICE

  return (
    <>
      <div className={shellClass}>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          disabled={disabled}
          onChange={(event) => {
            const next = sanitize(event.target.value)
            // A keystroke that would push past MAX_PRICE is dropped, but
            // shortening is always allowed, so an older listing already
            // priced above the cap (Edit Price) can still be brought down.
            if (Number(next) > MAX_PRICE && next.length >= value.length) {
              setBlockedAt(value)
              return
            }
            onChange(next)
          }}
          placeholder="0"
          className={styles.input}
          aria-label={`Price in ${tokenSymbol}`}
        />
        <span className={styles.token}>
          {tokenSymbol}
          {tokenIcon ?? (currency.icon ? (
            <Image src={currency.icon} alt="" aria-hidden="true" width={15} height={15} className={styles.tokenIcon} />
          ) : null)}
        </span>
      </div>
      {showLimitNote && (
        <p className={styles.limitNote} role="alert">
          Maximum price is {MAX_PRICE.toLocaleString('en-US')} {tokenSymbol}.
        </p>
      )}
    </>
  )
}

export default PriceInput
