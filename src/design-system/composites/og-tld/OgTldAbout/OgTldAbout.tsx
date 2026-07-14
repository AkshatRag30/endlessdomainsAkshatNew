import React from 'react'
import { PiLinkSimpleBold, PiShieldCheckBold, PiFingerprintBold } from 'react-icons/pi'

import styles from './OgTldAbout.module.scss'

const FEATURES = [
  {
    id: 'ownership',
    Icon: PiShieldCheckBold,
    title: 'Permanent Ownership',
    desc: 'Mint once and own forever. No renewals, subscriptions, or centralized control.',
  },
  {
    id: 'compatibility',
    Icon: PiLinkSimpleBold,
    title: 'Universal Compatibility',
    desc: 'Works across wallets, applications, marketplaces, and protocols throughout the ecosystem.',
  },
  {
    id: 'identity-os',
    Icon: PiFingerprintBold,
    title: 'Built For Identity OS',
    desc: 'Unlock reputation scoring, credentials, rewards, and future Identity OS features.',
  },
]

export function OgTldAbout() {
  const [ownership, compatibility, identityOs] = FEATURES

  return (
    <section className={styles.section} aria-labelledby="og-tld-about-heading">

      {/* ── Arc rings + grid, framing the title ── */}
      <div className={styles.archArea} aria-hidden="true">
        <div className={styles.archRing} />
        <div className={styles.archRing} />
        <div className={styles.archRing} />
        <div className={styles.archGrid} />
      </div>

      {/* ── Title block ── */}
      <div className={styles.titleBlock}>
        <div className={styles.labelWrap}>
          <span className={styles.labelBracketTL} aria-hidden="true" />
          <span className={styles.labelBracketTR} aria-hidden="true" />
          <span className={styles.labelBracketBL} aria-hidden="true" />
          <span className={styles.labelBracketBR} aria-hidden="true" />
          <p className={styles.labelText}>About The Identity</p>
        </div>

        <h2 id="og-tld-about-heading" className={styles.heading}>
          <span className={styles.headingLine1}>Everything</span>
          <span className={styles.headingLine2}>About .og</span>
        </h2>
      </div>

      {/* ── Octagon band with the three feature blocks ── */}
      <div className={styles.octagonBand}>
        <div className={styles.sideFeature}>
          <span className={styles.iconBadge} aria-hidden="true">
            <ownership.Icon size={20} />
          </span>
          <div className={styles.featureText}>
            <h3 className={styles.featureTitle}>{ownership.title}</h3>
            <p className={styles.featureDesc}>{ownership.desc}</p>
          </div>
        </div>

        <div className={`${styles.centerFeature} ${styles.centerFeatureLast}`}>
          <span className={styles.iconBadge} aria-hidden="true">
            <compatibility.Icon size={20} />
          </span>
          <div className={styles.featureText}>
            <h3 className={styles.featureTitle}>{compatibility.title}</h3>
            <p className={styles.featureDesc}>{compatibility.desc}</p>
          </div>
        </div>

        <div className={styles.sideFeature}>
          <span className={styles.iconBadge} aria-hidden="true">
            <identityOs.Icon size={20} />
          </span>
          <div className={styles.featureText}>
            <h3 className={styles.featureTitle}>{identityOs.title}</h3>
            <p className={styles.featureDesc}>{identityOs.desc}</p>
          </div>
        </div>
      </div>

    </section>
  )
}

export default OgTldAbout
