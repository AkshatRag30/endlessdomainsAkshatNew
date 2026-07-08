import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaXTwitter } from 'react-icons/fa6'
import { FiArrowRight } from 'react-icons/fi'
import spotlightImage from '../../../../../public/community/spotlight card.jpg'
import styles from './CommunitySpotlight.module.scss'

const SPOTLIGHTS = [
  {
    name: 'Young Warlock',
    handle: '@young_warl0ck',
    quote:
      "Big thank you to the @endlessdomains team for selecting my entry and to everyone who supported and engaged with my submission. It was a fun challenge bringing this character to life, and I'm grateful for the opportunity. Looking forward to seeing what's next!",
    href: '#',
  },
  {
    name: 'Young Warlock',
    handle: '@young_warl0ck',
    quote:
      "Big thank you to the @endlessdomains team for selecting my entry and to everyone who supported and engaged with my submission. It was a fun challenge bringing this character to life, and I'm grateful for the opportunity. Looking forward to seeing what's next!",
    href: '#',
  },
  {
    name: 'Young Warlock',
    handle: '@young_warl0ck',
    quote:
      "Big thank you to the @endlessdomains team for selecting my entry and to everyone who supported and engaged with my submission. It was a fun challenge bringing this character to life, and I'm grateful for the opportunity. Looking forward to seeing what's next!",
    href: '#',
  },
]

export function CommunitySpotlight() {
  return (
    <section className={styles.section} aria-labelledby="spotlight-heading">

      {/* ── Header row ── */}
      <div className={styles.topArea}>

        {/* Decorative striped column on the left */}
        <div className={styles.stripeCol} data-side="left" aria-hidden="true" />

        {/* Center content */}
        <div className={styles.centerContent}>

          {/* Subtitle with corner brackets */}
          <div className={styles.subtitleWrap}>
            <span className={styles.subtitleBracketTL} aria-hidden="true" />
            <span className={styles.subtitleBracketTR} aria-hidden="true" />
            <span className={styles.subtitleBracketBL} aria-hidden="true" />
            <span className={styles.subtitleBracketBR} aria-hidden="true" />
            <p className={styles.subtitleText}>Community spotlight</p>
          </div>

          {/* Heading */}
          <h2 id="spotlight-heading" className={styles.heading}>
            <span className={styles.headingLine1}>Voices From</span>
            <span className={styles.headingLine2}>Our Community</span>
          </h2>

          {/* Description */}
          <p className={styles.description}>
            Meet the people building their reputation and representing Endless Domains across the world.
          </p>

        </div>

        {/* Decorative striped column on the right */}
        <div className={styles.stripeCol} data-side="right" aria-hidden="true" />
      </div>

      {/* ── Spotlight cards row ── */}
      <div className={styles.cardsRow}>
        {SPOTLIGHTS.map((spotlight, i) => (
          <div key={`${spotlight.handle}-${i}`} className={styles.spotlightCard}>
            {/* Corner brackets framing the card */}
            <span className={styles.cornerTopLeft} aria-hidden="true" />
            <span className={styles.cornerTopRight} aria-hidden="true" />
            <span className={styles.cornerBottomLeft} aria-hidden="true" />
            <span className={styles.cornerBottomRight} aria-hidden="true" />

            {/* Featured image */}
            <div className={styles.imageWrap}>
              <Image src={spotlightImage} alt="" fill className={styles.image} sizes="(max-width: 768px) 100vw, 33vw" />
            </div>

            {/* Text content */}
            <div className={styles.cardBody}>
              <div className={styles.authorRow}>
                <div className={styles.avatarWrap}>
                  <Image src={spotlightImage} alt="" className={styles.avatar} width={58} height={58} />
                </div>
                <div className={styles.authorInfo}>
                  <p className={styles.authorName}>{spotlight.name}</p>
                  <div className={styles.authorHandleRow}>
                    <FaXTwitter aria-hidden="true" className={styles.handleIcon} />
                    <span className={styles.authorHandle}>{spotlight.handle}</span>
                  </div>
                </div>
              </div>

              <p className={styles.quote}>{spotlight.quote}</p>

              <Link href={spotlight.href} className={styles.ctaLink}>
                See tweet
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default CommunitySpotlight
