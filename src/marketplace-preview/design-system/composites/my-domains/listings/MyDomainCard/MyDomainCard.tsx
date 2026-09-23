import React from 'react'
import Image from 'next/image'
import { FiCalendar, FiEye, FiHeart } from 'react-icons/fi'
import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'
import DomainAvatar from '@/marketplace-preview/design-system/primitives/avatars/domain-avatar'
import Tooltip from '@/marketplace-preview/design-system/primitives/tooltip'
import ExtensionBadge from '@/marketplace-preview/design-system/primitives/badges/extension-badge'
import ChainBadge from '@/marketplace-preview/design-system/primitives/badges/chain-badge'
import TrendIndicator from '@/marketplace-preview/design-system/primitives/badges/trend-indicator'
import StatusChip from '@/marketplace-preview/design-system/primitives/badges/status-chip'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { formatUsd, formatRenewal, TREND_DIRECTION, TREND_LABEL, STATUS_BADGE_LABEL } from '../formatMyDomain'
import styles from './MyDomainCard.module.scss'

export interface MyDomainCardProps {
  domain: MyDomainListing
  onList?: (domain: MyDomainListing) => void
  onEditPrice?: (domain: MyDomainListing) => void
}

/**
 * Figma node 375:51247 (grid view card) — same fields as MyDomainRow, laid
 * out as a standalone card instead of a table row.
 *
 * Dimensions/scale corrected against Figma node 60:13505 — the card as it
 * actually renders inside the 3-column desktop grid (node 60:13504, 809px
 * wide, 3 x 265.45px cards with a 6px gap both directions, see
 * MyDomainsTable.module.scss's .grid). That reference groups the status
 * badge and the identity row into a single bordered block with no divider
 * between them — only two dividers total, before EST. value/Renewal and
 * before Price/Action — unlike the three this used to render (badge row,
 * identity row, and stats each separately bordered).
 */
export const MyDomainCard = ({ domain, onList, onEditPrice }: MyDomainCardProps) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.headerTop}>
        <StatusChip variant={domain.status === 'for-sale' ? 'for-sale' : 'neutral'}>{STATUS_BADGE_LABEL[domain.status]}</StatusChip>
        <div className={styles.interest}>
          <span className={styles.interestStat}>
            <FiEye size={13} aria-hidden="true" />
            {domain.views}
          </span>
          <span className={styles.interestStat}>
            <FiHeart size={11} aria-hidden="true" className={styles.heartIcon} />
            {domain.savedCount}
          </span>
        </div>
      </div>

      <div className={styles.identity}>
        <DomainAvatar extension={domain.extension} domainProvider={domain.domainProvider} />
        <div className={styles.identityText}>
          <div className={styles.nameRow}>
            <Tooltip label={`${domain.domainName}${domain.extension}`} placement="bottom" portal className={styles.domainNameTooltip}>
              <span className={styles.domainName}>{domain.domainName}</span>
            </Tooltip>
            <ExtensionBadge extension={domain.extension} />
            {domain.isPremium && (
              <Image src="/assets/img/marketplace/domain-marker.svg" alt="Premium" width={14} height={10} className={styles.marker} />
            )}
            {domain.isPromoted && (
              <Image src="/assets/img/marketplace/promoted-marker.svg" alt="Promoted" width={13} height={13} className={styles.promotedMarker} />
            )}
          </div>
          <div className={styles.metaRow}>
            <ChainBadge chain={domain.chain} />
            <span className={styles.chars}>{domain.lengthChars} chars</span>
          </div>
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
          <FiCalendar size={12} aria-hidden="true" />
          <span className={styles.renewalDate}>{formatRenewal(domain.renewalTimestamp)}</span>
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
        {/* Opens the listing flow modal (listing-flow-implementation-plan.md) in mock-first mode — no real wallet/contract call yet. */}
        {domain.status === 'for-sale' ? (
          <PrimaryButton size="sm" variant="charcoal" onClick={() => onEditPrice?.(domain)}>Edit Price</PrimaryButton>
        ) : (
          <PrimaryButton size="sm" onClick={() => onList?.(domain)}>List</PrimaryButton>
        )}
      </div>
    </div>
  </div>
)

export default MyDomainCard
