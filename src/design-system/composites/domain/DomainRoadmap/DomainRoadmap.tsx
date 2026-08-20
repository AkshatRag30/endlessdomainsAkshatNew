import React from 'react'

import styles from './DomainRoadmap.module.scss'

interface Milestone {
  id: string
  year: string
  title: string
  description: string
  tags: string[]
}

const MILESTONES: Milestone[] = [
  {
    id: 'idea',
    year: '2020',
    title: 'The Idea',
    description: 'What if your identity on the internet actually belonged to you? We started building before most people understood the problem.',
    tags: ['Founded', 'The Conviction'],
  },
  {
    id: 'aggregator',
    year: '2022',
    title: 'First identity aggregator',
    description: 'One place to buy and manage names from every provider: ENS, Bonfida, and Unstoppable Domains, all in one dashboard.',
    tags: [],
  },
  {
    id: 'expansion',
    year: '2024',
    title: 'Expansion & .og launch',
    description: 'Added Arbitrum, Starknet, and Avalanche. Launched .og with 4,000+ claimed. Shipped Parked Identities and the Marketplace.',
    tags: ['Latest'],
  },
  {
    id: 'works-for-you',
    year: '2026',
    title: 'Your identity starts working for you',
    description: 'One reputation score that follows you everywhere. Your identity earns rewards in the background, and any app can plug into it with one line of code.',
    tags: [],
  },
  {
    id: 'own-the-internet',
    year: '2027 & Beyond',
    title: 'Own the internet. Stop renting it.',
    description: 'Email, messaging, and social media, all rebuilt so you own them.',
    tags: ['dMail', 'dChat', 'dSocial', 'Full Ecosystem'],
  },
]

export function DomainRoadmap() {
  return (
    <section className={styles.section} aria-labelledby="domain-roadmap-heading">
      <div className={styles.header}>
        <div className={styles.eyebrowWrap}>
          <span className={styles.eyebrowBracketTL} aria-hidden="true" />
          <span className={styles.eyebrowBracketTR} aria-hidden="true" />
          <span className={styles.eyebrowBracketBL} aria-hidden="true" />
          <span className={styles.eyebrowBracketBR} aria-hidden="true" />
          <p className={styles.eyebrowText}>Roadmap</p>
        </div>

        <h2 id="domain-roadmap-heading" className={styles.heading}>
          <span className={styles.headingLine1}>We Started in 2020.</span>
          <span className={styles.headingLine2}>Here Is What We Built</span>
        </h2>

        <p className={styles.description}>
          Your username on social platforms belongs to them. They can delete it anytime. We&apos;re building a world where your identity on the internet
          is yours forever.
        </p>
      </div>

      <ol className={styles.timeline}>
        <span className={styles.dividerLine} data-position="1" aria-hidden="true" />
        <span className={styles.dividerLine} data-position="2" aria-hidden="true" />
        <span className={styles.dividerLine} data-position="3" aria-hidden="true" />
        <span className={styles.dividerLine} data-position="4" aria-hidden="true" />

        {MILESTONES.map((milestone, index) => (
          <li key={milestone.id} className={styles.milestone} data-offset={index % 2 === 1 || undefined}>
            <span className={styles.year}>{milestone.year}</span>
            <h3 className={styles.milestoneTitle}>{milestone.title}</h3>
            <p className={styles.milestoneDescription}>{milestone.description}</p>
            {milestone.tags.length > 0 && (
              <div className={styles.tags}>
                {milestone.tags.map(tag => (
                  <span className={styles.tag} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

export default DomainRoadmap
