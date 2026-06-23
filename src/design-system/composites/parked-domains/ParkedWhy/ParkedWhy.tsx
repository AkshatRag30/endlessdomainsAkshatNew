import React, { useRef } from 'react'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './ParkedWhy.module.scss'

const CARDS = [
  {
    id: 'unparked',
    badge: '2,350,000+',
    title: 'Unparked Web3 domains right now',
    desc: 'Your .crypto, .x, .wallet or any Web3 extension is the physical billboard space. You own it outright with no renewals.',
  },
  {
    id: 'setup',
    badge: '$0 setup cost',
    title: 'No investment beyond your domain',
    desc: 'No hosting fees, no developer, no annual charges. You paid for the domain once. Parking it costs nothing extra.',
  },
  {
    id: 'clicks',
    badge: '3 clicks',
    title: 'From idle to earning',
    desc: 'The average user goes from first login to parked domain in under 5 minutes with no technical knowledge required.',
  },
  {
    id: 'first',
    badge: 'First of its kind',
    title: 'Only Web3-native parking platform',
    desc: 'No other platform offers IPFS-linked domain parking across 10+ blockchains with on-chain revenue distribution to your wallet.',
  },
]

export function ParkedWhy() {
  const headerLeftRef  = useRef<HTMLDivElement>(null)
  const headerRightRef = useRef<HTMLDivElement>(null)
  const card0Ref       = useRef<HTMLDivElement>(null)
  const card1Ref       = useRef<HTMLDivElement>(null)
  const card2Ref       = useRef<HTMLDivElement>(null)
  const card3Ref       = useRef<HTMLDivElement>(null)
  const cardRefs = [card0Ref, card1Ref, card2Ref, card3Ref]

  useEntranceAnimation([headerLeftRef, headerRightRef, card0Ref, card1Ref, card2Ref, card3Ref])

  return (
    <section className={styles.section} aria-labelledby="why-park-heading">

      {/* ── Top header ── */}
      <div className={styles.headerRow}>

        {/* Left: eyebrow with 4 brackets + heading */}
        <div className={styles.headerLeft} ref={headerLeftRef}>
          <div className={styles.eyebrow}>
            <span className={styles.bracketTL} aria-hidden="true" />
            <span className={styles.bracketTR} aria-hidden="true" />
            <span className={styles.bracketBL} aria-hidden="true" />
            <span className={styles.bracketBR} aria-hidden="true" />
            <span className={styles.eyebrowText}>The opportunity</span>
          </div>
          <h2 id="why-park-heading" className={styles.heading}>
            <span className={styles.headingBlack}>Why park</span>
            <br />
            <span className={styles.headingBlue}>Your Domain?</span>
          </h2>
        </div>

        {/* Right: description with TL bracket and BR bracket on diagonal corners */}
        <div className={styles.headerRight} ref={headerRightRef}>
          <div className={styles.descWrap}>
            <span className={styles.bracketDescTL} aria-hidden="true" />
            <p className={styles.headerDesc}>
              Millions of domains are sitting completely idle while advertisers actively compete for Web3-native, contextually relevant placement. You already own the asset. Parking it costs nothing extra.
            </p>
            <span className={styles.bracketDescBR} aria-hidden="true" />
          </div>
        </div>

      </div>

      {/* ── Full-width dashed divider ── */}
      <div className={styles.fullDivider} aria-hidden="true" />

      {/* ── Cards ── */}
      <div className={styles.cardsRow}>
        {CARDS.map((card, i) => (
          <div key={card.id} className={styles.cardOuter} ref={cardRefs[i]}>
            <div className={styles.cardWrap}>
              <article className={styles.card}>
                <div className={styles.badge}>{card.badge}</div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </article>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default ParkedWhy
