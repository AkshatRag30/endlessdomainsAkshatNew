import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import discordIcon from '../../../../../public/community/Subtract (1).png'
import youtubeIcon from '../../../../../public/community/3d-render-youtube-play-button-icon 1.png'
import linkedinIcon from '../../../../../public/community/linkedin-square-icon-3d-glossy-button-with-rounded-corners-light-blue-gradient-background 1.png'
import telegramIcon from '../../../../../public/community/3d-telegram-app-icon-with-glossy-blue-finish 1.png'
import twitterIcon from '../../../../../public/community/3d-twitter-x-icon 1.png'
import instagramIcon from '../../../../../public/community/3d-instagram-icon 1.png'
import facebookIcon from '../../../../../public/community/facebook-3d-icon 1.png'
import styles from './CommunityHero.module.scss'

const STATS = [
  { value: '15K+', label: 'Genesis\nCommunity' },
  { value: '100+', label: 'IRL Event\nHosted' },
  { value: '80+', label: 'Universities\nConnected' },
  { value: '5+', label: 'Global Events\nSponsored' },
]

export function CommunityHero() {
  return (
    <section className={styles.hero} aria-labelledby="community-heading">

      {/* ── Background layers ── */}
      <div className={styles.bg} aria-hidden="true">
        {/* Concentric rings */}
        <div className={styles.ring} data-ring="1" />
        <div className={styles.ring} data-ring="2" />
        <div className={styles.ring} data-ring="3" />
        <div className={styles.ring} data-ring="4" />
        {/* Soft radial glow behind content */}
        <div className={styles.glow} />
        {/* Fade-out at bottom so next section blends in */}
        <div className={styles.fadeBottom} />
        <div className={styles.fadeTop} />
      </div>

      {/* ── Orbiting social icons ── */}
      {/* Inner ring: LinkedIn (0°), YouTube (120°), Facebook (240°), rotates CW */}
      <div className={`${styles.orbitRing} ${styles.orbitOuter}`} aria-hidden="true">
        <div className={styles.orbitIconAngle0}>
          <div className={styles.counterOuter}>
            <Image src={linkedinIcon} alt="" width={100} height={100} />
          </div>
        </div>
        <div className={styles.orbitIconAngle120}>
          <div className={styles.counterOuter}>
            <Image src={youtubeIcon} alt="" width={150} height={126} />
          </div>
        </div>
        <div className={styles.orbitIconAngle240}>
          <div className={styles.counterOuter}>
            <Image src={facebookIcon} alt="" width={100} height={100} />
          </div>
        </div>
      </div>
      {/* Outermost ring: Discord (0°), Instagram (90°), Telegram (180°), Twitter (270°), rotates CCW */}
      <div className={`${styles.orbitRing} ${styles.orbitOutermost}`} aria-hidden="true">
        <div className={styles.orbitIconAngle0}>
          <div className={styles.counterOutermost}>
            <Image src={discordIcon} alt="" width={110} height={92} />
          </div>
        </div>
        <div className={styles.orbitIconAngle90}>
          <div className={styles.counterOutermost}>
            <Image src={instagramIcon} alt="" width={100} height={100} />
          </div>
        </div>
        <div className={styles.orbitIconAngle180}>
          <div className={styles.counterOutermost}>
            <Image src={telegramIcon} alt="" width={108} height={108} />
          </div>
        </div>
        <div className={styles.orbitIconAngle270}>
          <div className={styles.counterOutermost}>
            <Image src={twitterIcon} alt="" width={100} height={100} />
          </div>
        </div>
      </div>


      {/* ── Main content ── */}
      <div className={styles.content}>

        {/* Top label */}
        <div className={styles.labelWrap}>
          <span className={styles.labelBracketTL} aria-hidden="true" />
          <span className={styles.labelBracketTR} aria-hidden="true" />
          <span className={styles.labelBracketBL} aria-hidden="true" />
          <span className={styles.labelBracketBR} aria-hidden="true" />
          <p className={styles.labelText}>Identity OS · The People Behind the Protocol</p>
        </div>

        {/* Heading */}
        <h1 id="community-heading" className={styles.heading}>
          <span className={styles.headingLine1}>Be Part Of Something</span>
          <span className={styles.headingLine2}>Bigger Onchain.</span>
        </h1>

        {/* Description */}
        <p className={styles.description}>
          Endless Domains is built by its community. Join thousands of builders, creators, and contributors shaping the future of onchain identity together.
        </p>

        {/* CTA button */}
        <div className={styles.ctaWrap}>
          <Link href="#join" className={styles.ctaLink}>
            <SecondaryButton type="button">Join The Community</SecondaryButton>
          </Link>
        </div>

        {/* Stats row */}
        <div className={styles.statsRow} role="list">
          {STATS.map((stat, i) => (
            <div key={i} className={styles.statBlock} role="listitem">
              <span className={styles.statCornerTL} aria-hidden="true" />
              <span className={styles.statCornerTR} aria-hidden="true" />
              <span className={styles.statCornerBL} aria-hidden="true" />
              <span className={styles.statCornerBR} aria-hidden="true" />
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default CommunityHero
