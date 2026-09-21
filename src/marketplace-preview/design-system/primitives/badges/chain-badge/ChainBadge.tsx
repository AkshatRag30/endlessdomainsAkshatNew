import React from 'react'
import Image from 'next/image'
import { Chain } from '@/marketplace-preview/types/marketplace'
import { getProviderForChainId } from '@/marketplace-preview/helpers/chaincurrency/chaincurrency'
import styles from './ChainBadge.module.scss'

export interface ChainBadgeProps {
  chain: Chain
  className?: string
}

/**
 * Real per-chain logos now, via the ported chaincurrency provider helper —
 * this used to render a colored dot instead of `chain.iconSrc`, since the
 * project had no chain logo assets of its own at the time. Falls back to
 * that same dot for any chain id the provider map doesn't recognize, rather
 * than rendering nothing.
 */
export const ChainBadge = ({ chain, className = '' }: ChainBadgeProps) => {
  const shellClass = [styles.badge, className].filter(Boolean).join(' ')
  const provider = getProviderForChainId(chain.id)

  return (
    <span className={shellClass}>
      {provider ? (
        <Image src={provider.image} alt="" aria-hidden="true" width={18} height={18} className={styles.logo} />
      ) : (
        <span className={[styles.dot, styles[chain.id] ?? styles.default].filter(Boolean).join(' ')} aria-hidden="true" />
      )}
      {chain.label}
    </span>
  )
}

export default ChainBadge
