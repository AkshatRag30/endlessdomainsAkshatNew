import Image from 'next/image'
import React from 'react'
import { STATES } from './OwnershipComparison'
import styles from './OwnershipComparisonMobile.module.scss'

// Mobile-only recomposition of OwnershipComparison — below tablet, the desktop's sticky
// scroll-scrubbed reveal has no room to work with, so this renders every state as a plain
// stacked list instead: all "renting" cards first, then all "owning" cards, sharing the
// same STATES copy so the two breakpoints never drift out of sync with each other.
export function OwnershipComparisonMobile() {
  return (
    <section className={styles.section} aria-labelledby="ownership-compare-mobile-heading">
      <h2 id="ownership-compare-mobile-heading" className={styles.srHeading}>
        Renting an identity versus owning one
      </h2>

      <div className={styles.headerBlock}>
        <span className={`${styles.badge} ${styles.badgeDark}`}>Today&apos;s Platforms &middot; You Rent</span>
        <p className={styles.headerHeadline}>Theirs. On rent.</p>
      </div>

      <div className={styles.cardStack} role="list">
        {STATES.map(state => (
          <article key={state.left.id} className={styles.card} data-side="left" role="listitem">
            <div className={styles.cardHeadRow}>
              <span className={styles.cardIconBadge} aria-hidden="true">
                <state.left.Icon size={20} />
              </span>
              <h3 className={styles.cardHeadline}>{state.left.headline}</h3>
            </div>
            <p className={styles.cardDesc}>{state.left.desc}</p>
          </article>
        ))}
      </div>

      {/* Marks the shift from "theirs" to "yours" — the mobile equivalent of the center
          identity mark that sits between the two columns on desktop. */}
      <div className={styles.coreLogoWrap}>
        <div className={styles.coreLogoGlow} aria-hidden="true" />
        <Image
          src="/landing/centerlogo.svg"
          alt="Endless Domains identity mark"
          width={160}
          height={160}
          className={styles.coreLogo}
          unoptimized
        />
      </div>

      <div className={styles.headerBlock}>
        <span className={`${styles.badge} ${styles.badgeBlue}`}>Endless &middot; You Own It</span>
        <p className={styles.headerHeadline}>Yours. Forever.</p>
      </div>

      <div className={styles.cardStack} role="list">
        {STATES.map(state => (
          <article key={state.right.id} className={styles.card} data-side="right" role="listitem">
            <div className={styles.cardHeadRow}>
              <span className={styles.cardIconBadge} aria-hidden="true">
                <state.right.Icon size={20} />
              </span>
              <h3 className={styles.cardHeadline}>{state.right.headline}</h3>
            </div>
            <p className={styles.cardDesc}>{state.right.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default OwnershipComparisonMobile
