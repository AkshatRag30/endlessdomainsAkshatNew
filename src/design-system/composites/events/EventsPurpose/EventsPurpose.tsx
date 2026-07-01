import Image from 'next/image'

import universityToursIcon from '/public/events/icons/university-tours.svg'
import communityMeetupsIcon from '/public/events/icons/community-meetups.svg'
import globalConferencesIcon from '/public/events/icons/global-conferences.svg'
import liveSessionsIcon from '/public/events/icons/live-sessions.svg'

import styles from './EventsPurpose.module.scss'

const ITEMS = [
  {
    id: 'university-tours',
    icon: universityToursIcon,
    iconAlt: 'University Tours',
    title: 'University Tours',
    desc: 'Bringing Web3 identity and digital ownership conversations directly to campuses across India and beyond — inspiring the next generation of builders.',
  },
  {
    id: 'global-conferences',
    icon: globalConferencesIcon,
    iconAlt: 'Global Conferences',
    title: 'Global Conferences',
    desc: "Participating in the world's premier blockchain events — Token2049, DomainDays, and more — to represent the future of decentralised identity.",
  },
  {
    id: 'community-meetups',
    icon: communityMeetupsIcon,
    iconAlt: 'Community Meetups',
    title: 'Community Meetups',
    desc: 'Curated intimate gatherings through OG Genesis that bring together founders, developers, and NFT pioneers for real conversations and demos.',
  },
  {
    id: 'live-sessions',
    icon: liveSessionsIcon,
    iconAlt: 'Live Sessions',
    title: 'Live Sessions',
    desc: 'Hosting regular AMAs, Twitter Spaces, and virtual events where the community connects directly with the Endless Domains team for product updates & real time Q&A.',
  },
]

export function EventsPurpose() {
  return (
    <section className={styles.section} aria-label="Events with purpose">

      {/* ── Top row ──────────────────────────────────────────────────────── */}
      <div className={styles.topRow}>
        {/* Left — eyebrow + heading */}
        <div className={styles.topLeft}>
          <div className={styles.eyebrow} aria-label="Events with purpose">
            <span className={styles.eyebrowBracketTL} aria-hidden="true" />
            <span className={styles.eyebrowBracketTR} aria-hidden="true" />
            <span className={styles.eyebrowBracketBL} aria-hidden="true" />
            <span className={styles.eyebrowBracketBR} aria-hidden="true" />
            <p className={styles.eyebrowText}>Events with Purpose</p>
          </div>
          <h2 className={styles.heading}>
            <span className={styles.headingBlack}>More Than</span>
            <span className={styles.headingBlue}>Just Events</span>
          </h2>
        </div>

        {/* Centre — hatched column decorations */}
        <div className={styles.hatchedCols} aria-hidden="true">
          <div className={styles.hatchedCol} />
          <div className={styles.hatchedCol} />
        </div>

        {/* Right — description */}
        <div className={styles.topRight}>
          <span className={styles.bracketTL} aria-hidden="true" />
          <span className={styles.bracketBR} aria-hidden="true" />
          <p className={styles.desc}>
            We create spaces where ideas are shared, partnerships begin, and communities grow. Every event is designed to inspire learning, meaningful connections, and lasting impact
          </p>
        </div>
      </div>

      {/* ── Divider line ─────────────────────────────────────────────────── */}
      <div className={styles.divider} aria-hidden="true" />

      {/* ── Bottom row — 4 columns ───────────────────────────────────────── */}
      <div className={styles.bottomRow}>
        {ITEMS.map((item, i) => (
          <div key={item.id} className={`${styles.col}${i % 2 === 1 ? ` ${styles.colOffset}` : ''}`}>
            {/* Dashed vertical divider on all cols except first */}
            {i > 0 && <span className={styles.colDivider} aria-hidden="true" />}

            {/* Icon box */}
            <div className={styles.iconBox} aria-hidden="true">
              <div className={styles.iconGlow} />
              <Image src={item.icon} alt={item.iconAlt} width={32} height={32} className={styles.iconImg} />
            </div>

            {/* Text */}
            <div className={styles.colText}>
              <h3 className={styles.colTitle}>{item.title}</h3>
              <p className={styles.colDesc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EventsPurpose
