import React, { useRef } from 'react'
import Image from 'next/image'
import { useEntranceAnimation } from '../useEntranceAnimation'
import styles from './ExecutionSection.module.scss'

const CARDS = [
  // Row 1
  {
    key: 'marketplace',
    title: 'Marketplace',
    desc: 'Buy, sell, and trade onchain identities across every provider within the Endless Domains ecosystem.',
    image: '/about-us/marketplace.jpg',
    imageAlt: 'Marketplace illustration',
    large: true,
  },
  {
    key: 'reputation',
    title: 'Reputation Score',
    desc: 'Bringing Web3 identity and digital ownership conversations directly to campuses across India and beyond inspiring the next generation of builders.',
    image: '/about-us/reputation.jpg',
    imageAlt: 'Reputation Score illustration',
    large: false,
  },
  {
    key: 'affiliate',
    title: 'Affiliate Program',
    desc: 'Our affiliate program rewards contributors who bring verified users to the platform.',
    image: '/about-us/affiliate.jpg',
    imageAlt: 'Affiliate Program illustration',
    large: false,
  },
  // Row 2
  {
    key: 'chain',
    title: '10+ Chain Aggregator',
    desc: 'The only platform where you can search, mint, and manage identities across ENS, Unstoppable Domains, Freename, SNS, SpaceID, TON, BOX, StarkNet, Arbitrum, and more from one place.',
    image: '/about-us/chainaggregator.jpg',
    imageAlt: '10+ Chain Aggregator illustration',
    large: false,
  },
  {
    key: 'perks',
    title: 'Perks Catalog',
    desc: 'A tiered rewards system built on your reputation score.',
    image: '/about-us/perkcatalog.jpg',
    imageAlt: 'Perks Catalog illustration',
    large: false,
  },
  {
    key: 'parked',
    title: 'Parked Domains',
    desc: 'Park your identities and earn passive yield while they sit in your wallet, building value over time.',
    image: '/about-us/parked.jpg',
    imageAlt: 'Parked Domains illustration',
    large: true,
  },
]

export function ExecutionSection() {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef    = useRef<HTMLParagraphElement>(null)
  const c0 = useRef<HTMLDivElement>(null)
  const c1 = useRef<HTMLDivElement>(null)
  const c2 = useRef<HTMLDivElement>(null)
  const c3 = useRef<HTMLDivElement>(null)
  const c4 = useRef<HTMLDivElement>(null)
  const c5 = useRef<HTMLDivElement>(null)
  const cardRefs = [c0, c1, c2, c3, c4, c5]

  useEntranceAnimation([eyebrowRef, headingRef, descRef, c0, c1, c2, c3, c4, c5])

  return (
    <section className={styles.section} aria-labelledby="execution-heading">

      <div className={styles.header}>
        <div className={styles.eyebrowWrap} ref={eyebrowRef}>
          <span className={styles.reticleTL} aria-hidden="true" />
          <span className={styles.reticleTR} aria-hidden="true" />
          <span className={styles.reticleBL} aria-hidden="true" />
          <span className={styles.reticleBR} aria-hidden="true" />
          <p className={styles.eyebrow}>What We Have Delivered</p>
        </div>

        <h2 id="execution-heading" className={styles.heading} ref={headingRef}>
          <span className={styles.headingBlack}>From Idea </span>
          <span className={styles.headingBlue}>to Execution</span>
        </h2>

        <p className={styles.desc} ref={descRef}>
          Every feature below is live, running, and yours to use today. This is not a roadmap. This is what we have already built on top of the OS.
        </p>
      </div>

      <div className={styles.grid}>
        {CARDS.map((card, i) => (
          <div
            key={card.key}
            className={`${styles.card} ${card.large ? styles.cardLarge : styles.cardSmall}`}
            ref={cardRefs[i]}
          >
            {card.large ? (
              <>
                <div className={styles.cardImg}>
                  <Image src={card.image} alt={card.imageAlt} fill className={styles.img} sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDesc}>{card.desc}</p>
                </div>
              </>
            ) : (
              <>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDesc}>{card.desc}</p>
                </div>
                <div className={styles.cardImg}>
                  <Image src={card.image} alt={card.imageAlt} fill className={styles.img} sizes="(max-width: 768px) 100vw, 25vw" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

    </section>
  )
}

export default ExecutionSection
