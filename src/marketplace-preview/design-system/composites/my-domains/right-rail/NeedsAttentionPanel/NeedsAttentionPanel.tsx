import React from 'react'
import { FiUser } from 'react-icons/fi'
import InfoListCard from '@/marketplace-preview/design-system/primitives/cards/info-list-card'
import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'
import styles from './NeedsAttentionPanel.module.scss'

export interface NeedsAttentionPanelProps {
  domains: MyDomainListing[]
}

const DAY_MS = 24 * 60 * 60 * 1000

function formatRenewsIn(renewalTimestamp: number | null): string {
  // A domain in this panel is here because it's expiring/expired/in grace
  // period (see useMyDomainsData's needsAttentionStatus), so a null
  // (lifetime) timestamp shouldn't actually reach this panel in practice —
  // handled anyway since the type allows it.
  if (renewalTimestamp === null) return 'Lifetime'
  const days = Math.ceil((renewalTimestamp - Date.now()) / DAY_MS)
  if (days <= 0) return 'Expired'
  return `Renews in ${days} day${days === 1 ? '' : 's'}`
}

/**
 * Figma node 50:6264 — domains that are expiring soon, in their grace
 * period, or already expired (see useMyDomainsData's needsAttentionStatus).
 * Every row gets a Renew action — same "no mutation wired up yet" state as
 * every other action button on this page (List, Edit Price, Bulk List, ...).
 */
export const NeedsAttentionPanel = ({ domains }: NeedsAttentionPanelProps) => (
  <InfoListCard
    title="Needs attention"
    iconVariant="blue"
    emptyMessage="Nothing needs attention right now."
    rows={domains.map((domain) => ({
      id: domain.id,
      icon: FiUser,
      title: `${domain.domainName}${domain.extension}`,
      subtitle: formatRenewsIn(domain.renewalTimestamp),
      trailing: (
        <button type="button" className={styles.renewButton}>
          Renew
        </button>
      ),
    }))}
  />
)

export default NeedsAttentionPanel
