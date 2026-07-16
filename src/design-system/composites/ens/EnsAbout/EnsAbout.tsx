import React from 'react'
import Image from 'next/image'

import styles from './EnsAbout.module.scss'

const FEATURES = [
  {
    id: 'ethereum-native',
    iconSrc: '/ens/icon-ethereum-native.svg',
    title: 'Ethereum-Native Identity',
    desc: "Built on Ethereum and secured by the world's largest smart contract ecosystem.",
  },
  {
    id: 'universal-recognition',
    iconSrc: '/ens/icon-universal-recognition.svg',
    title: 'Universal Recognition',
    desc: 'Supported by wallets, marketplaces, DAOs, applications, and Web3 services worldwide.',
  },
  {
    id: 'own-presence',
    iconSrc: '/ens/icon-own-presence.svg',
    title: 'Own Your Presence',
    desc: 'Create a memorable on-chain identity that travels with you across the Ethereum ecosystem.',
  },
]

export function EnsAbout() {
  const [ethereumNative, universalRecognition, ownPresence] = FEATURES

  return (
    <section className={styles.section} aria-labelledby="ens-about-heading">

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

        <h2 id="ens-about-heading" className={styles.heading}>
          <span className={styles.headingLine1}>Everything</span>
          <span className={styles.headingLine2}>About .eth</span>
        </h2>

        <p className={styles.description}>
          Every .eth identity is registered through Ethereum Name Service (ENS), allowing users to replace complex wallet addresses with a simple, human-readable name that works across wallets, applications, DAOs, and protocols.
        </p>
      </div>

      {/* ── Octagon band with the three feature blocks ── */}
      <div className={styles.octagonBand}>
        <div className={styles.sideFeature}>
          <span className={styles.iconBadge} aria-hidden="true">
            <Image src={ethereumNative.iconSrc} alt="" width={20} height={20} unoptimized />
          </span>
          <div className={styles.featureText}>
            <h3 className={styles.featureTitle}>{ethereumNative.title}</h3>
            <p className={styles.featureDesc}>{ethereumNative.desc}</p>
          </div>
        </div>

        <div className={`${styles.centerFeature} ${styles.centerFeatureLast}`}>
          <span className={styles.iconBadge} aria-hidden="true">
            <Image src={universalRecognition.iconSrc} alt="" width={20} height={20} unoptimized />
          </span>
          <div className={styles.featureText}>
            <h3 className={styles.featureTitle}>{universalRecognition.title}</h3>
            <p className={styles.featureDesc}>{universalRecognition.desc}</p>
          </div>
        </div>

        <div className={styles.sideFeature}>
          <span className={styles.iconBadge} aria-hidden="true">
            <Image src={ownPresence.iconSrc} alt="" width={20} height={20} unoptimized />
          </span>
          <div className={styles.featureText}>
            <h3 className={styles.featureTitle}>{ownPresence.title}</h3>
            <p className={styles.featureDesc}>{ownPresence.desc}</p>
          </div>
        </div>
      </div>

    </section>
  )
}

export default EnsAbout
