import React from 'react'
import Image from 'next/image'
import { Chain } from '@/marketplace-preview/types/marketplace'
import styles from './ChainBadge.module.scss'

export interface ChainBadgeProps {
  chain: Chain
  className?: string
}

/**
 * Real per-chain logos from public/assets/img/chain-logos/, rendered
 * straight off `chain.iconSrc` — this used to go through a separate
 * naming-provider lookup (getProviderForChainId) as a workaround for
 * `iconSrc` being placeholder data pointing at a folder that didn't exist.
 * Falls back to a colored dot for any chain with no `iconSrc` set (e.g. a
 * provider deriveChain in useMyDomainsData.ts couldn't map to one of the
 * chains that has a real logo file) rather than rendering nothing.
 */
export const ChainBadge = ({ chain, className = '' }: ChainBadgeProps) => {
  const shellClass = [styles.badge, className].filter(Boolean).join(' ')

  return (
    <span className={shellClass}>
      {chain.iconSrc ? (
        <Image src={chain.iconSrc} alt="" aria-hidden="true" width={18} height={18} className={styles.logo} />
      ) : (
        <span className={[styles.dot, styles[chain.id] ?? styles.default].filter(Boolean).join(' ')} aria-hidden="true" />
      )}
      {chain.label}
    </span>
  )
}

export default ChainBadge
