import React from 'react'
import Image from 'next/image'
import type { DomainNameFacts } from '@/marketplace-preview/types/marketplace'
import GlassCard from '@/marketplace-preview/design-system/primitives/cards/glass-card'
import KeyValueRows from '@/marketplace-preview/design-system/primitives/cards/key-value-rows'
import DomainAvatar from '@/marketplace-preview/design-system/primitives/avatars/domain-avatar'
import TokenSuffix from '@/marketplace-preview/design-system/primitives/token-suffix'
import { formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import { chainShortName } from '@/marketplace-preview/helpers/marketplace/chain'
import styles from './NameFactsCard.module.scss'

export interface NameFactsCardProps {
  facts: DomainNameFacts
}

/**
 * Figma node 5:3700 ("What this name is"). Every value reads the same facts
 * as the hero's meta line, so Figma's own mismatches between the two (plan
 * §2.7 Q1 "bnb" vs "polygon", Q2 "7 chars" vs "10") can't happen here.
 */
export const NameFactsCard = ({ facts }: NameFactsCardProps) => (
  <GlassCard title="What this name is" titleId="domain-facts-title" className={styles.card}>
    <KeyValueRows
      variant="boxed"
      className={styles.rows}
      rows={[
        {
          label: 'Extension',
          value: (
            <span className={styles.extension}>
              {facts.extension}
              <DomainAvatar extension={facts.extension} className={styles.avatar} />
            </span>
          ),
        },
        { label: 'Characters', value: facts.characterCount },
        {
          label: 'Chain',
          value: (
            <>
              {chainShortName(facts)}
              <Image src={facts.chain.iconSrc} alt="" aria-hidden="true" width={17} height={17} />
            </>
          ),
        },
        { label: 'Renewal', value: facts.renewal === 'one-time' ? 'one time, no annual fee' : 'renews yearly' },
        {
          label: 'Model estimate',
          value:
            facts.modelEstimateUsd !== null ? (
              <span className={styles.estimate}>
                {formatToken(facts.modelEstimateUsd)}
                <TokenSuffix iconSize={15} className={styles.token} />
              </span>
            ) : (
              '—'
            ),
        },
      ]}
    />
  </GlassCard>
)

export default NameFactsCard
