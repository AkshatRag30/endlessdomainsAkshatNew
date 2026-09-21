import React from 'react'
import Image from 'next/image'
import { FiCalendar, FiEye, FiHeart } from 'react-icons/fi'
import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'
import ChainBadge from '@/marketplace-preview/design-system/primitives/badges/chain-badge'
import ExtensionBadge from '@/marketplace-preview/design-system/primitives/badges/extension-badge'
import TrendIndicator from '@/marketplace-preview/design-system/primitives/badges/trend-indicator'
import DomainAvatar from '@/marketplace-preview/design-system/primitives/avatars/domain-avatar'
import Tooltip from '@/marketplace-preview/design-system/primitives/tooltip'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { formatUsd, formatRenewal, truncateDomainName, TREND_DIRECTION, TREND_LABEL } from '../formatMyDomain'
import styles from './MyDomainRow.module.scss'

export interface MyDomainRowProps {
  domain: MyDomainListing
}

/**
 * Figma node 375:51245 (row). Only 'for-sale' rows get a colored (green)
 * left edge — confirmed against the real screenshot, every other status
 * renders with a plain neutral border. An earlier pass here guessed at a
 * 5-color mapping before this reference existed; that guess is corrected now.
 */
export const MyDomainRow = ({ domain }: MyDomainRowProps) => {
  const rowClass = [styles.row, domain.status === 'for-sale' ? styles.statusForSale : ''].filter(Boolean).join(' ')

  return (
    <div className={rowClass} role="row">
      <div className={`${styles.cell} ${styles.domainCell}`} role="cell">
        <DomainAvatar extension={domain.extension} />
        <div className={styles.domainText}>
          <div className={styles.domainNameRow}>
            <Tooltip label={`${domain.domainName}${domain.extension}`} portal className={styles.domainNameTooltip}>
              <span className={styles.domainName}>{truncateDomainName(domain.domainName)}</span>
            </Tooltip>
            <ExtensionBadge extension={domain.extension} />
          </div>
          <div className={styles.domainMeta}>
            <ChainBadge chain={domain.chain} />
            <span className={styles.chars}>{domain.lengthChars} chars</span>
            {domain.isPremium && (
              <Image src="/assets/img/marketplace/domain-marker.svg" alt="Premium" width={14} height={10} className={styles.marker} />
            )}
          </div>
        </div>
      </div>

      <div className={styles.cell} role="cell">
        {domain.status === 'for-sale' && domain.priceUsd != null ? (
          <span className={styles.value}>{formatUsd(domain.priceUsd)}</span>
        ) : (
          <span className={styles.dash}>~</span>
        )}
      </div>

      <div className={styles.cell} role="cell">
        <span className={styles.value}>{formatUsd(domain.estimatedValueUsd)}</span>
        <TrendIndicator direction={TREND_DIRECTION[domain.appraisedTrend]} label={TREND_LABEL[domain.appraisedTrend]} />
      </div>

      <div className={styles.cell} role="cell">
        <span className={styles.renewal}>
          <FiCalendar size={12} aria-hidden="true" />
          {formatRenewal(domain.renewalTimestamp)}
        </span>
      </div>

      <div className={`${styles.cell} ${styles.interestCell}`} role="cell">
        <span className={styles.interestStat}>
          <FiEye size={13} aria-hidden="true" />
          {domain.views}
        </span>
        <span className={styles.interestStat}>
          <FiHeart size={11} aria-hidden="true" className={styles.heartIcon} />
          {domain.savedCount}
        </span>
      </div>

      <div className={`${styles.cell} ${styles.actionCell}`} role="cell">
        {/* Static mock data — visually real, intentionally inert per the implementation plan's Phase 04 checkpoint (List/Edit Price semantics not yet confirmed against the real modals) */}
        {domain.status === 'for-sale' ? (
          <PrimaryButton size="sm" variant="charcoal">Edit Price</PrimaryButton>
        ) : (
          <PrimaryButton size="sm">List</PrimaryButton>
        )}
      </div>
    </div>
  )
}

export default MyDomainRow
