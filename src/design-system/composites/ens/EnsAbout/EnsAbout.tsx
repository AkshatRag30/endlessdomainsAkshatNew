import React from 'react'
import Image from 'next/image'
import type { TldPageData } from '@/data/tldPages'

import styles from './EnsAbout.module.scss'

export interface EnsAboutProps {
  data: TldPageData
}

export function EnsAbout({ data }: EnsAboutProps) {
  const { about } = data
  const [ownership, compatibility, identityOs] = about.features

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
          <p className={styles.labelText}>{about.label}</p>
        </div>

        <h2 id="ens-about-heading" className={styles.heading}>
          <span className={styles.headingLine1}>{about.headingLine1}</span>
          <span className={styles.headingLine2}>{about.headingLine2}</span>
        </h2>

        <p className={styles.description}>
          {about.description}
        </p>
      </div>

      {/* ── Octagon band with the three feature blocks ── */}
      <div className={styles.octagonBand}>
        <div className={styles.sideFeature}>
          <span className={styles.iconBadge} aria-hidden="true">
            <Image src={ownership.iconSrc} alt="" width={20} height={20} unoptimized />
          </span>
          <div className={styles.featureText}>
            <h3 className={styles.featureTitle}>{ownership.title}</h3>
            <p className={styles.featureDesc}>{ownership.desc}</p>
          </div>
        </div>

        <div className={`${styles.centerFeature} ${styles.centerFeatureLast}`}>
          <span className={styles.iconBadge} aria-hidden="true">
            <Image src={compatibility.iconSrc} alt="" width={20} height={20} unoptimized />
          </span>
          <div className={styles.featureText}>
            <h3 className={styles.featureTitle}>{compatibility.title}</h3>
            <p className={styles.featureDesc}>{compatibility.desc}</p>
          </div>
        </div>

        <div className={styles.sideFeature}>
          <span className={styles.iconBadge} aria-hidden="true">
            <Image src={identityOs.iconSrc} alt="" width={20} height={20} unoptimized />
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

export default EnsAbout
