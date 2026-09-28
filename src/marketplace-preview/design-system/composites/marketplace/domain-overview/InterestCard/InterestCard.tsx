import React from 'react'
import type { DomainInterest } from '@/marketplace-preview/types/marketplace'
import GlassCard from '@/marketplace-preview/design-system/primitives/cards/glass-card'
import InterestBars from '@/marketplace-preview/design-system/primitives/charts/interest-bars'
import styles from './InterestCard.module.scss'

export interface InterestCardProps {
  interest: DomainInterest
}

/** Figma node 5:3762: 7 day views against current watchers. */
export const InterestCard = ({ interest }: InterestCardProps) => (
  <GlassCard title="Interest" titleId="domain-interest-title" className={styles.card}>
    <InterestBars
      className={styles.bars}
      items={[
        { label: 'Views, 7d', value: interest.views7d.value, changePct: interest.views7d.changePct },
        { label: 'Watchers', value: interest.watchers.value, changePct: interest.watchers.changePct },
      ]}
    />
  </GlassCard>
)

export default InterestCard
