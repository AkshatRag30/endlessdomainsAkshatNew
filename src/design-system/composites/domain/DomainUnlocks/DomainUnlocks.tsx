import React, { useCallback, useMemo, useRef, useState } from 'react'
import { PiCurrencyDollarBold, PiShieldCheckBold, PiSignInBold } from 'react-icons/pi'
import { ReputationScoreIcon, ParkAndEarnIcon, TradeMarketplaceIcon, type UnlockIconProps } from './icons'

import styles from './DomainUnlocks.module.scss'

interface UnlockCard {
  id: string
  Icon: (props: UnlockIconProps) => React.ReactNode
  title: string
  desc: string
}

const CARDS: UnlockCard[] = [
  {
    id: 'payment-address',
    Icon: PiCurrencyDollarBold,
    title: 'Readable Payment Address',
    desc: 'Send and receive payments using yourname.og instead of a long wallet address. Human-readable. Cross-chain. Works across 450+ integrations automatically.',
  },
  {
    id: 'identity-ownership',
    Icon: PiShieldCheckBold,
    title: 'Identity Ownership',
    desc: 'Your on-chain identity belongs to you alone. No centralised authority controls it. No platform can revoke it. Minted to your wallet permanently.',
  },
  {
    id: 'universal-login',
    Icon: PiSignInBold,
    title: 'Universal On-Chain Login',
    desc: 'Use your identity to sign into any integrated application. No email. No password. One permanent on-chain login that works across every supported protocol.',
  },
  {
    id: 'reputation-score',
    Icon: ReputationScoreIcon,
    title: 'Reputation Score',
    desc: 'Every on-chain action you take builds a reputation score from 0 to 1000. Your identity is the foundation. The longer you hold and use it, the stronger it becomes.',
  },
  {
    id: 'park-and-earn',
    Icon: ParkAndEarnIcon,
    title: 'Park And Earn',
    desc: 'Not using your identity yet? Park it and earn passive ad revenue automatically. The OS earns while you build.',
  },
  {
    id: 'trade-marketplace',
    Icon: TradeMarketplaceIcon,
    title: 'Trade On Marketplace',
    desc: 'Buy and sell on-chain identities peer-to-peer through trustless smart contracts. No broker. Fair fees. Every transaction settles atomically on-chain.',
  },
]

const CARDS_PER_PAGE = 3
const PAGE_COUNT = Math.ceil(CARDS.length / CARDS_PER_PAGE)

export function DomainUnlocks() {
  const [page, setPage] = useState(0)
  const [mobileIndex, setMobileIndex] = useState(0)
  const mobileTrackRef = useRef<HTMLDivElement>(null)

  const visibleCards = useMemo(
    () => CARDS.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE),
    [page],
  )

  // design-specific: mobile renders every card in one horizontally-scrollable row (1 visible at a
  // time via scroll-snap) instead of the desktop/tablet paginated 3-per-page slice — CSS toggles
  // which markup shows per breakpoint, see .cardBand / .mobileCardBand in the stylesheet
  const handlePrev = useCallback(() => {
    setPage(prev => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setPage(prev => Math.min(PAGE_COUNT - 1, prev + 1))
  }, [])

  const handleDotClick = useCallback((index: number) => {
    setPage(index)
  }, [])

  const scrollMobileToIndex = useCallback((index: number) => {
    const track = mobileTrackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(CARDS.length - 1, index))
    const card = track.children[clamped] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    setMobileIndex(clamped)
  }, [])

  const handleMobilePrev = useCallback(() => {
    scrollMobileToIndex(mobileIndex - 1)
  }, [mobileIndex, scrollMobileToIndex])

  const handleMobileNext = useCallback(() => {
    scrollMobileToIndex(mobileIndex + 1)
  }, [mobileIndex, scrollMobileToIndex])

  return (
    <section className={styles.section} aria-labelledby="domain-unlocks-heading">

      {/* Title block */}
      <div className={styles.titleBlock}>
        <div className={styles.labelWrap}>
          <span className={styles.labelBracketTL} aria-hidden="true" />
          <span className={styles.labelBracketTR} aria-hidden="true" />
          <span className={styles.labelBracketBL} aria-hidden="true" />
          <span className={styles.labelBracketBR} aria-hidden="true" />
          <p className={styles.labelText}>What Your Identity Does</p>
        </div>

        <h2 id="domain-unlocks-heading" className={styles.heading}>
          <span className={styles.headingLine1}>One Identity. </span>
          <span className={styles.headingLine2}>Everything it Unlocks.</span>
        </h2>
      </div>

      {/* Card row — desktop/tablet: paginated 3-per-page slice */}
      <div className={styles.cardBandOuter}>
        <div className={styles.cardBand}>
          {visibleCards.map((card, index) => {
            const Icon = card.Icon

            return (
              <React.Fragment key={card.id}>
                <div className={styles.card}>
                  <span className={styles.iconBadge} aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <div className={styles.cardText}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardDesc}>{card.desc}</p>
                  </div>
                </div>
                {index < visibleCards.length - 1 && <span className={styles.cardDivider} aria-hidden="true" />}
              </React.Fragment>
            )
          })}
        </div>

        {/* Card row — mobile only: all 6 cards, one visible at a time via horizontal scroll-snap */}
        <div className={styles.mobileCardBand} ref={mobileTrackRef}>
          {CARDS.map(card => {
            const Icon = card.Icon

            return (
              <div key={card.id} className={styles.mobileCard}>
                <span className={styles.iconBadge} aria-hidden="true">
                  <Icon size={22} />
                </span>
                <div className={styles.cardText}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDesc}>{card.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile-only pagination — arrows scroll the card band above one card at a time */}
        <div className={styles.mobilePagination}>
          <button
            type="button"
            className={styles.arrowButton}
            onClick={handleMobilePrev}
            disabled={mobileIndex === 0}
            aria-label="Previous card"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12.5 4.5L6 10l6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className={styles.dots} role="tablist" aria-label="Cards">
            {CARDS.map((card, index) => (
              <button
                key={card.id}
                type="button"
                role="tab"
                aria-selected={mobileIndex === index}
                aria-label={`Show card ${index + 1}`}
                className={`${styles.dot} ${mobileIndex === index ? styles.dotActive : ''}`}
                onClick={() => scrollMobileToIndex(index)}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.arrowButton}
            onClick={handleMobileNext}
            disabled={mobileIndex === CARDS.length - 1}
            aria-label="Next card"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7.5 4.5L14 10l-6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Pagination — desktop/tablet only */}
      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.arrowButton}
          onClick={handlePrev}
          disabled={page === 0}
          aria-label="Previous cards"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12.5 4.5L6 10l6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.dots} role="tablist" aria-label="Card pages">
          {Array.from({ length: PAGE_COUNT }, (_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={page === index}
              aria-label={`Show card page ${index + 1}`}
              className={`${styles.dot} ${page === index ? styles.dotActive : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.arrowButton}
          onClick={handleNext}
          disabled={page === PAGE_COUNT - 1}
          aria-label="Next cards"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M7.5 4.5L14 10l-6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

    </section>
  )
}

export default DomainUnlocks
