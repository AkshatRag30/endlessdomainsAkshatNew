import React from 'react'
import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'
import DomainAvatar from '@/marketplace-preview/design-system/primitives/avatars/domain-avatar'
import Tooltip from '@/marketplace-preview/design-system/primitives/tooltip'
import ExtensionBadge from '@/marketplace-preview/design-system/primitives/badges/extension-badge'
import ChainBadge from '@/marketplace-preview/design-system/primitives/badges/chain-badge'
import TrendIndicator from '@/marketplace-preview/design-system/primitives/badges/trend-indicator'
import Badge from '@/marketplace-preview/design-system/primitives/badges/badge'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { formatUsd, formatRenewal, TREND_DIRECTION, TREND_LABEL, STATUS_BADGE_LABEL } from '../formatMyDomain'
import styles from './MyDomainCard.module.scss'

export interface MyDomainCardProps {
  domain: MyDomainListing
}

/** Figma node 375:51247 (grid view card) — same fields as MyDomainRow, laid out as a standalone card instead of a table row. */
export const MyDomainCard = ({ domain }: MyDomainCardProps) => (
  <div className={styles.card}>
    <div className={styles.top}>
      <Badge variant={domain.status === 'for-sale' ? 'success' : 'neutral'}>{STATUS_BADGE_LABEL[domain.status]}</Badge>
      <div className={styles.interest}>
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
    </div>

    <div className={styles.identity}>
      <DomainAvatar chain={domain.chain} />
      <div className={styles.identityText}>
        <div className={styles.nameRow}>
          <Tooltip label={`${domain.domainName}${domain.extension}`} placement="bottom" portal className={styles.domainNameTooltip}>
            <span className={styles.domainName}>{domain.domainName}</span>
          </Tooltip>
          <ExtensionBadge extension={domain.extension} />
          {domain.isPremium && (
            <img src="/assets/img/marketplace/domain-marker.svg" alt="Premium" className={styles.marker} />
          )}
        </div>
        <div className={styles.metaRow}>
          <ChainBadge chain={domain.chain} />
          <span className={styles.chars}>{domain.lengthChars} chars</span>
        </div>
      </div>
    </div>

    <div className={styles.statsRow}>
      <div className={styles.stat}>
        <span className={styles.statLabel}>EST. value</span>
        <span className={styles.statValue}>{formatUsd(domain.estimatedValueUsd)}</span>
        <TrendIndicator direction={TREND_DIRECTION[domain.appraisedTrend]} label={TREND_LABEL[domain.appraisedTrend]} />
      </div>
      <div className={styles.stat}>
        <span className={styles.statLabel}>Renewal</span>
        <span className={styles.renewal}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="1" y="2" width="10" height="9" rx="1.2" stroke="currentColor" />
            <path d="M1 4.5H11" stroke="currentColor" />
            <path d="M3.5 1V3M8.5 1V3" stroke="currentColor" strokeLinecap="round" />
          </svg>
          {formatRenewal(domain.renewalTimestamp)}
        </span>
      </div>
    </div>

    <div className={styles.statsRow}>
      <div className={styles.stat}>
        <span className={styles.statLabel}>Price</span>
        {domain.status === 'for-sale' && domain.priceUsd != null ? (
          <span className={styles.statValue}>{formatUsd(domain.priceUsd)}</span>
        ) : (
          <span className={styles.dash}>~</span>
        )}
      </div>
      <div className={`${styles.stat} ${styles.actionStat}`}>
        {/* Static mock data — visually real, intentionally inert per the implementation plan's Phase 04 checkpoint */}
        {domain.status === 'for-sale' ? (
          <PrimaryButton size="sm" variant="charcoal">Edit Price</PrimaryButton>
        ) : (
          <PrimaryButton size="sm">List</PrimaryButton>
        )}
      </div>
    </div>
  </div>
)

export default MyDomainCard
