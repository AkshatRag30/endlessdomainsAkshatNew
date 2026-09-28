import React from 'react'
import Image from 'next/image'
import type { Chain } from '@/marketplace-preview/types/marketplace'
import DomainAvatar from '@/marketplace-preview/design-system/primitives/avatars/domain-avatar'
import ExtensionBadge from '@/marketplace-preview/design-system/primitives/badges/extension-badge'
import TokenSuffix from '@/marketplace-preview/design-system/primitives/token-suffix'
import { formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import { chainShortName } from '@/marketplace-preview/helpers/marketplace/chain'
import styles from './DomainPriceHeader.module.scss'

export interface DomainPriceHeaderProps {
  label: string // 'banking'
  extension: string // '.ud'
  chain: Chain
  characterCount: number
  /** Adds the "· one time · no renewal" meta segments. */
  oneTimePurchase: boolean
  priceUsd: number
  className?: string
}

/**
 * The 40px avatar + name + meta line on the left, blue price + USDT on the
 * right. Drawn identically by the buying flow's review screen (Figma 1:652)
 * and the order receipt card (5:7495), so it lives here once rather than in
 * either flow.
 */
export const DomainPriceHeader = ({ label, extension, chain, characterCount, oneTimePurchase, priceUsd, className = '' }: DomainPriceHeaderProps) => (
  <div className={[styles.header, className].filter(Boolean).join(' ')}>
    <div className={styles.domain}>
      <DomainAvatar extension={extension} className={styles.avatar} />
      <div className={styles.domainText}>
        <div className={styles.nameRow}>
          <span className={styles.domainName}>{label}</span>
          <ExtensionBadge extension={extension} className={styles.extension} />
        </div>
        <div className={styles.metaRow}>
          {chain.iconSrc && <Image src={chain.iconSrc} alt="" aria-hidden="true" width={12} height={12} />}
          <span className={styles.meta}>
            {chainShortName({ chain })} · {characterCount} chars
            {oneTimePurchase && ' · one time · no renewal'}
          </span>
        </div>
      </div>
    </div>
    <div className={styles.price}>
      <span className={styles.priceAmount}>{formatToken(priceUsd)}</span>
      <TokenSuffix iconSize={15} iconFirst className={styles.priceSymbol} />
    </div>
  </div>
)

export default DomainPriceHeader
