import React from 'react'
import Image from 'next/image'

import styles from './DomainWhy.module.scss'

interface WhyFeature {
  id: string
  title: string
  desc: string
}

const FEATURES: WhyFeature[] = [
  {
    id: 'wide-tld-range',
    title: 'Wide TLD Range',
    desc: '70+ TLDs across 10+ providers including ENS, Unstoppable Domains, Bonfida, SpaceID, Freename, and more. One search. Every option.',
  },
  {
    id: 'unified-dashboard',
    title: 'Simple Unified Dashboard',
    desc: 'Register and manage every identity you own across all providers from one interface. Fast, secure, and built for the people who actually use it.',
  },
  {
    id: 'reliable-support',
    title: 'Reliable Support',
    desc: 'Expert support available via live chat and email. Real people. Quick responses. No automated runaround.',
  },
  {
    id: 'perks-rewards',
    title: 'Exclusive Perks and Rewards',
    desc: 'Your reputation score unlocks partner rewards, whitelist access, and ecosystem perks automatically. No applications. The OS knows your score.',
  },
]

export function DomainWhy() {
  return (
    <section className={styles.section} aria-labelledby="domain-why-heading">

      {/* Header — dashed top/bottom rule lines, full viewport width */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.labelWrap}>
            <span className={styles.labelBracketTL} aria-hidden="true" />
            <span className={styles.labelBracketTR} aria-hidden="true" />
            <span className={styles.labelBracketBL} aria-hidden="true" />
            <span className={styles.labelBracketBR} aria-hidden="true" />
            <p className={styles.labelText}>Why Endless Domains</p>
          </div>

          <h2 id="domain-why-heading" className={styles.heading}>
            <span className={styles.headingLine1}>Shape your On-Chain</span>
            <span className={styles.headingLine2}>Future With us.</span>
          </h2>

          <p className={styles.description}>
            Endless is more than an identity marketplace. It&apos;s the Identity OS for Web3. One platform connecting every identity you own to reputation, utility, and opportunity.
          </p>
        </div>
      </div>

      {/* Content — feature grid (wider) + manage.png preview (narrower) */}
      <div className={styles.content}>

        <div className={styles.featureGrid}>
          {FEATURES.map(feature => (
            <div key={feature.id} className={styles.featureItem}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.previewWrap}>
          <Image
            src="/domain-tld/manage.png"
            alt="Manage your identities dashboard preview showing four registered names with their status"
            width={455}
            height={315}
            className={styles.previewImage}
            unoptimized
          />
        </div>

      </div>

    </section>
  )
}

export default DomainWhy
