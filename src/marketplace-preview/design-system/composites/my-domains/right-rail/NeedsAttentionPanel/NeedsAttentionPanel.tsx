import React from 'react'
import InfoListCard from '@/marketplace-preview/design-system/primitives/cards/info-list-card'
import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'
import styles from './NeedsAttentionPanel.module.scss'

export interface NeedsAttentionPanelProps {
  domains: MyDomainListing[]
}

const DAY_MS = 24 * 60 * 60 * 1000

function formatRenewsIn(renewalTimestamp: number): string {
  const days = Math.ceil((renewalTimestamp - Date.now()) / DAY_MS)
  if (days <= 0) return 'Expired'
  return `Renews in ${days} day${days === 1 ? '' : 's'}`
}

/** Figma node 50:6264 — domains that are expiring soon or already expired. */
export const NeedsAttentionPanel = ({ domains }: NeedsAttentionPanelProps) => (
  <InfoListCard
    title="Needs attention"
    iconVariant="blue"
    emptyMessage="Nothing needs attention right now."
    rows={domains.map((domain) => ({
      id: domain.id,
      iconSrc: '/assets/img/my-domains/needs-attention-icon.svg',
      title: `${domain.domainName}${domain.extension}`,
      subtitle: formatRenewsIn(domain.renewalTimestamp),
      trailing: <span className={styles.review}>Review</span>,
    }))}
  />
)

export default NeedsAttentionPanel
