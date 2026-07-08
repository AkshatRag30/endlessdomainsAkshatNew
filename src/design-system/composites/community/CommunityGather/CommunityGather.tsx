import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaDiscord, FaXTwitter, FaTelegram, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa6'
import { FiArrowRight } from 'react-icons/fi'
import styles from './CommunityGather.module.scss'

const PLATFORMS = [
  {
    Icon: FaDiscord,
    name: 'Discord',
    description: 'Daily discussions, announcements, and community events.',
    ctaLabel: 'Join community',
    href: '#',
  },
  {
    Icon: FaXTwitter,
    name: 'Twitter',
    description: 'Onchain insights, product updates, and community highlights.',
    ctaLabel: 'Follow us on',
    href: '#',
  },
  {
    Icon: FaTelegram,
    name: 'Telegram',
    description: 'Quick updates and direct access to the core team.',
    ctaLabel: 'Join community',
    href: '#',
  },
  {
    Icon: FaLinkedinIn,
    name: 'LinkedIn',
    description: 'Professional updates and ecosystem news.',
    ctaLabel: 'Follow us on',
    href: '#',
  },
  {
    Icon: FaYoutube,
    name: 'YouTube',
    description: 'Tutorials, walkthroughs, and community spotlights.',
    ctaLabel: 'Subscribe',
    href: '#',
  },
  {
    Icon: FaInstagram,
    name: 'Instagram',
    description: 'Visual stories, community moments, and brand content.',
    ctaLabel: 'Follow us on',
    href: '#',
  },
]

export function CommunityGather() {
  return (
    <section className={styles.section} aria-labelledby="gather-heading">

      {/* ── Header row ── */}
      <div className={styles.header}>

        {/* Left: subtitle + heading */}
        <div className={styles.headerLeft}>
          <div className={styles.subtitleWrap}>
            <span className={styles.subtitleBracketTL} aria-hidden="true" />
            <span className={styles.subtitleBracketTR} aria-hidden="true" />
            <span className={styles.subtitleBracketBL} aria-hidden="true" />
            <span className={styles.subtitleBracketBR} aria-hidden="true" />
            <p className={styles.subtitleText}>Where we gather</p>
          </div>

          <h2 id="gather-heading" className={styles.heading}>
            <span className={styles.headingLine1}>Find</span>
            <span className={styles.headingLine2}>Your People</span>
          </h2>
        </div>

        {/* Center: connection graphic — static base + animated glow layer */}
        <div className={styles.headerCenter}>
          <div className={styles.connectorWrap} aria-hidden="true">
            <Image
              src="/waitlist/Group 2085666369.svg"
              alt=""
              width={380}
              height={130}
              className={styles.connectorBase}
            />
            <svg className={styles.connectorGlow} viewBox="0 0 317 109" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                className={styles.glowPath1}
                d="M13.5 26.5H105.601C107.457 26.5 109.237 27.2375 110.55 28.5503L170.45 88.4497C171.763 89.7625 173.543 90.5 175.399 90.5H315.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                className={styles.glowPath2}
                d="M15 82H107.101C108.957 82 110.737 81.2625 112.05 79.9497L171.95 20.0503C173.263 18.7375 175.043 18 176.899 18H317"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Right: description, framed by corner ticks */}
        <div className={styles.headerRight}>
          <span className={styles.headerRightBracketTop} aria-hidden="true" />
          <p className={styles.description}>We are active everywhere. Pick your platform and jump right in.</p>
          <span className={styles.headerRightBracketBottom} aria-hidden="true" />
        </div>
      </div>

      {/* ── Platform cards row ── */}
      <div className={styles.cardsRow}>
        {PLATFORMS.map(platform => (
          <div key={platform.name} className={styles.platformCard}>
            <div className={styles.iconBadge}>
              <platform.Icon aria-hidden="true" />
            </div>

            <div className={styles.cardText}>
              <h3 className={styles.cardTitle}>{platform.name}</h3>
              <p className={styles.cardDescription}>{platform.description}</p>
            </div>

            <Link href={platform.href} className={styles.ctaLink}>
              {platform.ctaLabel}
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        ))}
      </div>

    </section>
  )
}

export default CommunityGather
