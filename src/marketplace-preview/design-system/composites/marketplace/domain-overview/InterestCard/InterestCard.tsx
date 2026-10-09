import React from 'react'
import type { DomainInterest } from '@/marketplace-preview/types/marketplace'
import GlassCard from '@/marketplace-preview/design-system/primitives/cards/glass-card'
import InterestBars from '@/marketplace-preview/design-system/primitives/charts/interest-bars'
import styles from './InterestCard.module.scss'

export interface InterestCardProps {
  /** null = not tracked for this domain yet (pages/details/[orderId].tsx has no real views/watchers endpoint) — shown as "not tracked" rather than fabricated zeros. */
  interest: DomainInterest | null
}

/** Figma node 5:3762: 7 day views against current watchers. */
export const InterestCard = ({ interest }: InterestCardProps) => (
  <GlassCard title="Interest" titleId="domain-interest-title" className={styles.card}>
    {interest ? (
      <InterestBars
        className={styles.bars}
        items={[
          { label: 'Views, 7d', value: interest.views7d.value, changePct: interest.views7d.changePct },
          { label: 'Watchers', value: interest.watchers.value, changePct: interest.watchers.changePct },
        ]}
      />
    ) : (
      // Not in Figma — real orders have no views/watchers tracking yet.
      <p className={styles.empty}>Not tracked for this listing yet.</p>
    )}
  </GlassCard>
)

export default InterestCard
