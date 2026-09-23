import React from 'react'
import Image from 'next/image'
import { getCurrencyInfo } from '@/marketplace-preview/helpers/chaincurrency/chaincurrency'
import styles from './TokenSuffix.module.scss'

export interface TokenSuffixProps {
  className?: string
}

/** Icon + symbol for every USDT amount across the listing flow (ConfirmToSignStep, ListingSuccessStep, DomainInsightsCard) — mirrors PriceInput's own token chip so the icon isn't reimplemented at each call site. */
export const TokenSuffix = ({ className = '' }: TokenSuffixProps) => {
  const currency = getCurrencyInfo('USDT')

  return (
    <span className={[styles.suffix, className].filter(Boolean).join(' ')}>
      USDT
      {currency.icon && <Image src={currency.icon} alt="" aria-hidden="true" width={13} height={13} className={styles.icon} />}
    </span>
  )
}

export default TokenSuffix
