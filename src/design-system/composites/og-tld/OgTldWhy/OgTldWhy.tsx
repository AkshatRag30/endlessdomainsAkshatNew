import React from 'react'
import Image from 'next/image'
import whyOgImage from '/public/og-tld/whyog.png'

import styles from './OgTldWhy.module.scss'

export function OgTldWhy() {
  return (
    <section className={styles.section} aria-labelledby="og-tld-why-heading">

      {/* ── Title block ── */}
      <div className={styles.titleBlock}>
        <span className={styles.dividerLine} aria-hidden="true" />

        <div className={styles.labelWrap}>
          <span className={styles.labelBracketTL} aria-hidden="true" />
          <span className={styles.labelBracketTR} aria-hidden="true" />
          <span className={styles.labelBracketBL} aria-hidden="true" />
          <span className={styles.labelBracketBR} aria-hidden="true" />
          <p className={styles.labelText}>Why .og</p>
        </div>

        <h2 id="og-tld-why-heading" className={styles.heading}>
          <span className={styles.headingLine1}>The Identity Layer</span>
          <span className={styles.headingLine2}>For Everything Ahead.</span>
        </h2>

        <span className={styles.dividerLine} aria-hidden="true" />
      </div>

      {/* ── Card stack + description ── */}
      <div className={styles.contentRow}>

        <div className={styles.cardPanel}>
          <Image
            src={whyOgImage}
            alt="Feature cards showing no renewals, permanent ownership, wallet-bound identity, built-in reputation layer, cross-chain resolution, and a $2 starting price"
            className={styles.cardPanelImage}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 690px"
          />
        </div>

        <p className={styles.description}>
          Most blockchain identities stop at wallet resolution. .og goes further.
          <br /><br />
          It acts as the foundation of the Endless Identity OS, connecting your reputation, activity, credentials, and opportunities across the on-chain economy.
          <br /><br />
          As you build, transact, contribute, and participate, your .og becomes the permanent record of who you are on-chain.
        </p>

      </div>

    </section>
  )
}

export default OgTldWhy
