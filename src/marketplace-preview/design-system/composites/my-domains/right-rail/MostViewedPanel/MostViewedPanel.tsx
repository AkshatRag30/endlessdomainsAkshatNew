import React from 'react'
import InfoListCard from '@/marketplace-preview/design-system/primitives/cards/info-list-card'
import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'
import styles from './MostViewedPanel.module.scss'

export interface MostViewedPanelProps {
  domains: MyDomainListing[]
}

const STATUS_LABEL: Record<MyDomainListing['status'], string> = {
  'for-sale': 'for sale',
  'not-listed': 'not listed',
  sold: 'sold',
  'expiring-soon': 'expiring soon',
  expired: 'expired',
}

/** Figma node 50:6355 — domains sorted by view count. */
export const MostViewedPanel = ({ domains }: MostViewedPanelProps) => (
  <InfoListCard
    title="Getting the most views"
    iconVariant="dark"
    emptyMessage="No view activity yet."
    rows={domains.map((domain) => ({
      id: domain.id,
      iconSrc: '/assets/img/my-domains/most-viewed-icon.svg',
      title: `${domain.domainName}${domain.extension}`,
      subtitle: STATUS_LABEL[domain.status],
      trailing: (
        <div className={styles.statPair}>
          <span className={styles.statPrimary}>{domain.views}</span>
          <span className={styles.statSecondary}>{domain.savedCount} saved</span>
        </div>
      ),
    }))}
  />
)

export default MostViewedPanel
