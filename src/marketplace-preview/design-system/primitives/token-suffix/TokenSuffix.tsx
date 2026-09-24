import React from 'react'
import Image from 'next/image'
import { getCurrencyInfo } from '@/marketplace-preview/helpers/chaincurrency/chaincurrency'
import styles from './TokenSuffix.module.scss'

export interface TokenSuffixProps {
  /** Default 13 (listing flow). The buying flow's receipt rows use 15 (Figma 1:728). */
  iconSize?: number
  /** Icon before the "USDT" label instead of after it — the buying flow's review header price stack (Figma 1:692). */
  iconFirst?: boolean
  className?: string
}

/**
 * Icon + symbol for every USDT amount across the listing and buying flows —
 * mirrors PriceInput's own token chip so the icon isn't reimplemented at
 * each call site. Promoted from composites/my-domains/listing-flow/
 * (buying-flow plan §3).
 */
export const TokenSuffix = ({ iconSize = 13, iconFirst = false, className = '' }: TokenSuffixProps) => {
  const currency = getCurrencyInfo('USDT')
  const icon = currency.icon && (
    <Image src={currency.icon} alt="" aria-hidden="true" width={iconSize} height={iconSize} className={styles.icon} />
  )

  return (
    <span className={[styles.suffix, className].filter(Boolean).join(' ')}>
      {iconFirst && icon}
      USDT
      {!iconFirst && icon}
    </span>
  )
}

export default TokenSuffix
