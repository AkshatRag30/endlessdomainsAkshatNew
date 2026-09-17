import React from 'react'
import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'
import ChainBadge from '@/marketplace-preview/design-system/primitives/badges/chain-badge'
import ExtensionBadge from '@/marketplace-preview/design-system/primitives/badges/extension-badge'
import TrendIndicator from '@/marketplace-preview/design-system/primitives/badges/trend-indicator'
import DomainAvatar from '@/marketplace-preview/design-system/primitives/avatars/domain-avatar'
import Tooltip from '@/marketplace-preview/design-system/primitives/tooltip'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { formatUsd, formatRenewal, TREND_DIRECTION, TREND_LABEL } from '../formatMyDomain'
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
        <DomainAvatar chain={domain.chain} />
        <div className={styles.domainText}>
          <div className={styles.domainNameRow}>
            <Tooltip label={`${domain.domainName}${domain.extension}`} portal className={styles.domainNameTooltip}>
              <span className={styles.domainName}>{domain.domainName}</span>
            </Tooltip>
            <ExtensionBadge extension={domain.extension} />
            {domain.isPremium && (
              <img src="/assets/img/marketplace/domain-marker.svg" alt="Premium" className={styles.marker} />
            )}
          </div>
          <div className={styles.domainMeta}>
            <ChainBadge chain={domain.chain} />
            <span className={styles.chars}>{domain.lengthChars} chars</span>
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

      <div className={`${styles.cell} ${styles.interestCell}`} role="cell">
        <span className={styles.interestStat}>
          <svg width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true">
            <path d="M6.5 0.5C3.5 0.5 1.2 2.3 0.3 4.5C1.2 6.7 3.5 8.5 6.5 8.5C9.5 8.5 11.8 6.7 12.7 4.5C11.8 2.3 9.5 0.5 6.5 0.5Z" stroke="currentColor" />
            <circle cx="6.5" cy="4.5" r="1.8" stroke="currentColor" />
          </svg>
          {domain.views}
        </span>
        <span className={styles.interestStat}>
          <img src="/assets/img/marketplace/favorite.svg" alt="" aria-hidden="true" className={styles.heartIcon} />
          {domain.savedCount}
        </span>
      </div>

      <div className={styles.cell} role="cell">
        <span className={styles.renewal}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="1" y="2" width="10" height="9" rx="1.2" stroke="currentColor" />
            <path d="M1 4.5H11" stroke="currentColor" />
            <path d="M3.5 1V3M8.5 1V3" stroke="currentColor" strokeLinecap="round" />
          </svg>
          {formatRenewal(domain.renewalTimestamp)}
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
