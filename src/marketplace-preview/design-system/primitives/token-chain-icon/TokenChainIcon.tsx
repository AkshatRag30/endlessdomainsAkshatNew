import React from 'react'
import Image from 'next/image'
import { getCurrencyInfo } from '@/marketplace-preview/helpers/chaincurrency/chaincurrency'
import styles from './TokenChainIcon.module.scss'

export interface TokenChainIconProps {
  /** The listed domain's own chain logo (`domain.chain.iconSrc`) — which chain the order settles on, not which chain USDT itself lives on generically. */
  chainIconSrc?: string
  className?: string
}

/**
 * Figma node 1:9251 (price input's token chip) — the USDT icon with the
 * domain's own chain logo badged over its bottom-right corner, e.g. Polygon
 * for a Polygon-chain domain. Only this one price-input chip shows the
 * chain badge; every other USDT amount in the listing flow (TokenSuffix)
 * stays icon-only, per the linked Figma frame. Promoted from
 * composites/my-domains/listing-flow/ (buying-flow plan §3).
 */
export const TokenChainIcon = ({ chainIconSrc, className = '' }: TokenChainIconProps) => {
  const currency = getCurrencyInfo('USDT')
  if (!currency.icon) return null

  return (
    <span className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <Image src={currency.icon} alt="" aria-hidden="true" width={20} height={20} className={styles.tokenIcon} />
      {chainIconSrc && <Image src={chainIconSrc} alt="" aria-hidden="true" width={8} height={8} className={styles.chainBadge} />}
    </span>
  )
}

export default TokenChainIcon
