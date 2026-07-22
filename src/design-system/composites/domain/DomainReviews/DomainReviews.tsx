import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import styles from './DomainReviews.module.scss'

interface Review {
  id: string
  name: string
  role: string
  avatar: string
  quote: string
}

const REVIEWS: Review[] = [
  {
    id: 'hamza-malik',
    name: 'Hamza Malik',
    role: 'Manager',
    avatar: '/domain/user1.png',
    quote: 'Park next busy ever. Elinor her his secure far twenty eat object. Any far saw size want man. Which way you wrong. Park next busy ever. Elinor her his secure far twenty eat object. Any far saw size want man. Which way you wrong.',
  },
  {
    id: 'sara-connor',
    name: 'Sara Connor',
    role: 'Builder',
    avatar: '/domain/user2.png',
    quote: 'My identity moved with me across every chain I use. No more juggling five different wallet addresses for the same person. One name, everywhere.',
  },
  {
    id: 'daniel-cruz',
    name: 'Daniel Cruz',
    role: 'Collector',
    avatar: '/domain/user3.png',
    quote: 'Registration took less time than making coffee. Paid once, own it forever, no renewal emails clogging my inbox every year. Exactly how this should work.',
  },
  {
    id: 'amara-okafor',
    name: 'Amara Okafor',
    role: 'Developer',
    avatar: '/domain/user1.png',
    quote: 'Integrating support for the identity took an afternoon. The docs were clear, the SDK just worked, and support answered my questions within the hour.',
  },
  {
    id: 'leo-tanaka',
    name: 'Leo Tanaka',
    role: 'Investor',
    avatar: '/domain/user2.png',
    quote: 'Parked a few names I wasn’t ready to use yet and they started earning passively right away. Didn’t expect that from a domain purchase.',
  },
]

export function DomainReviews() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handlePrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + REVIEWS.length) % REVIEWS.length)
  }, [])

  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % REVIEWS.length)
  }, [])

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const prevReview = REVIEWS[(activeIndex - 1 + REVIEWS.length) % REVIEWS.length]
  const activeReview = REVIEWS[activeIndex]
  const nextReview = REVIEWS[(activeIndex + 1) % REVIEWS.length]

  return (
    <section className={styles.section} aria-labelledby="domain-reviews-heading">

      {/* Header — dashed top/bottom rules, diagonal stripe columns flanking the title,
          dense diagonal texture panels further out on each edge */}
      <div className={styles.header}>
        <div className={styles.texturePanel} data-side="left" aria-hidden="true" />

        <div className={styles.topArea}>
          <div className={styles.stripeCol} data-side="left" aria-hidden="true" />

          <div className={styles.centerContent}>
            <div className={styles.labelWrap}>
              <span className={styles.labelBracketTL} aria-hidden="true" />
              <span className={styles.labelBracketTR} aria-hidden="true" />
              <span className={styles.labelBracketBL} aria-hidden="true" />
              <span className={styles.labelBracketBR} aria-hidden="true" />
              <p className={styles.labelText}>What People Say</p>
            </div>

            <h2 id="domain-reviews-heading" className={styles.heading}>
              <span className={styles.headingLine1}>Real People. </span>
              <span className={styles.headingLine2}>Real Identities.</span>
            </h2>

            <p className={styles.description}>
              Hear from users building, owning, and growing their digital identity with Endless.
            </p>
          </div>

          <div className={styles.stripeCol} data-side="right" aria-hidden="true" />
        </div>

        <div className={styles.texturePanel} data-side="right" aria-hidden="true" />
      </div>

      {/* Review carousel — review.svg as the panel background */}
      <div className={styles.carousel}>
        <div className={styles.carouselPanel}>
          <Image
            src="/domain-tld/review.svg"
            alt=""
            fill
            aria-hidden="true"
            className={styles.panelBg}
            unoptimized
          />

          <button type="button" className={styles.arrowButton} data-side="left" onClick={handlePrev} aria-label="Previous review">
            <FiChevronLeft size={28} aria-hidden="true" />
          </button>

          <div className={styles.reviewRow}>
            <div className={styles.sideReview}>
              <div className={styles.sideAuthorRow}>
                <span className={styles.sideAvatarWrap}>
                  <Image src={prevReview.avatar} alt={prevReview.name} width={28} height={28} className={styles.sideAvatar} unoptimized />
                </span>
                <div className={styles.sideAuthorInfo}>
                  <p className={styles.sideAuthorName}>{prevReview.name}</p>
                  <p className={styles.sideAuthorRole}>{prevReview.role}</p>
                </div>
              </div>
              <p className={styles.sideQuote}>{prevReview.quote}</p>
            </div>

            <div className={styles.activeReview}>
              <div className={styles.activeAuthorRow}>
                <span className={styles.activeAvatarWrap}>
                  <Image src={activeReview.avatar} alt={activeReview.name} width={58} height={58} className={styles.activeAvatar} unoptimized />
                </span>
                <div className={styles.activeAuthorInfo}>
                  <p className={styles.activeAuthorName}>{activeReview.name}</p>
                  <p className={styles.activeAuthorRole}>{activeReview.role}</p>
                </div>
              </div>
              <p className={styles.activeQuote}>{activeReview.quote}</p>
            </div>

            <div className={styles.sideReview}>
              <div className={styles.sideAuthorRow}>
                <span className={styles.sideAvatarWrap}>
                  <Image src={nextReview.avatar} alt={nextReview.name} width={28} height={28} className={styles.sideAvatar} unoptimized />
                </span>
                <div className={styles.sideAuthorInfo}>
                  <p className={styles.sideAuthorName}>{nextReview.name}</p>
                  <p className={styles.sideAuthorRole}>{nextReview.role}</p>
                </div>
              </div>
              <p className={styles.sideQuote}>{nextReview.quote}</p>
            </div>
          </div>

          <button type="button" className={styles.arrowButton} data-side="right" onClick={handleNext} aria-label="Next review">
            <FiChevronRight size={28} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.dots} role="tablist" aria-label="Review pages">
          {REVIEWS.map((review, index) => (
            <button
              key={review.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`Show review from ${review.name}`}
              className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>

    </section>
  )
}

export default DomainReviews
