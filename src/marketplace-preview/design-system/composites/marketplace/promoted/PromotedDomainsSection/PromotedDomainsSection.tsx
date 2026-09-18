import React from 'react'
import { mockPromotedListings } from '@/marketplace-preview/data/marketplace/domains'
import PromotedDomainCard from '../PromotedDomainCard'
import styles from './PromotedDomainsSection.module.scss'

// Pace the loop by card count rather than a fixed duration, so adding more
// promoted listings later doesn't make the row race past faster.
const SECONDS_PER_CARD = 3.5

/**
 * Figma node 1:1034. The reference file itself repeats 8 identical
 * placeholder cards in this row — mockPromotedListings now provides 8 real
 * ones to match. Auto-slides continuously (CSS animation, not a scroll
 * library), pauses on hover/focus so a visitor can actually read or click a
 * card, and drops to the plain scrollable row from before for anyone with
 * prefers-reduced-motion set.
 */
export const PromotedDomainsSection = () => {
  const trackStyle = {
    // must include the unit — a bare number here makes the CSS custom
    // property invalid wherever animation-duration expects a <time>, which
    // silently drops the duration to its 0s initial value and the "moving"
    // row just sits still
    '--loop-seconds': `${mockPromotedListings.length * SECONDS_PER_CARD}s`,
  } as React.CSSProperties

  return (
    <section className={styles.section}>
      <img src="/assets/img/marketplace/promoted-glow.png" alt="" aria-hidden="true" className={styles.glow} />
      <p className={styles.heading}>Promoted domains</p>
      <div className={styles.marquee}>
        <div className={styles.track} style={trackStyle}>
          {[0, 1].map((pass) => (
            <div className={styles.pass} key={pass} aria-hidden={pass === 1}>
              {mockPromotedListings.map((listing) => (
                <PromotedDomainCard key={`${listing.id}-${pass}`} listing={listing} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PromotedDomainsSection
