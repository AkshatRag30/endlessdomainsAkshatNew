import React, { useEffect, useState } from 'react'
import { PrimaryButton } from '@/design-system/primitives/button'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import styles from './BugBountyHero.module.scss'

const ARROWS = Array.from({ length: 40 })
// Each falling column shows 6 stacked characters instead of the old line+dot comet — fixed
// per-column count keeps every column's height (and therefore its fall timing) identical to before.
const DIGITS_PER_COLUMN = 6
const CHAR_POOL = '01'

function randomChar() {
  return CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]
}

export function BugBountyHero() {
  // Randomized only after mount, on the client — generating these during the render that gets
  // server-rendered would produce different characters on the server vs. the client's own first
  // render, which React's hydration flags as a text mismatch. Starting empty keeps server and
  // client markup identical, then this fills in right after mount, before the user can notice.
  const [columnChars, setColumnChars] = useState<string[][] | null>(null)

  useEffect(() => {
    setColumnChars(ARROWS.map(() => Array.from({ length: DIGITS_PER_COLUMN }, randomChar)))
  }, [])

  return (
    <section className={styles.hero} aria-labelledby="bug-bounty-heading">

      {/* ── Background layers ── */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.stripeLayer} />
        <div className={styles.sonarPing}>
          <span className={styles.pingRing} />
          <span className={styles.pingRing} />
          <span className={styles.pingRing} />
        </div>
      </div>

      {/* ── Falling character streams — hash/cipher feel, computeristic replacement for the old comet dots ── */}
      <div className={styles.arrowsLayer} aria-hidden="true">
        {columnChars?.map((chars, i) => (
          <span key={i} className={styles.arrow}>
            {chars.map((char, j) => (
              <span key={j} className={styles.arrowDigit}>{char}</span>
            ))}
          </span>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className={styles.content}>

        <div className={styles.textStack}>

          {/* Title block — label + heading. One shared circular backdrop behind title + CTA lives
              on .textStack itself; the sonar-ping rings live in .bg behind everything */}
          <div className={styles.titleBlock}>

            {/* Top label */}
            <div className={styles.labelWrap}>
              <span className={styles.labelBracketTL} aria-hidden="true" />
              <span className={styles.labelBracketTR} aria-hidden="true" />
              <span className={styles.labelBracketBL} aria-hidden="true" />
              <span className={styles.labelBracketBR} aria-hidden="true" />
              <p className={styles.labelText}>Find Bugs. Get Paid.</p>
            </div>

            {/* Heading */}
            <h1 id="bug-bounty-heading" className={styles.heading}>
              <span className={styles.headingLine1}>Welcome To The Endless Domains</span>
              <span className={styles.headingLine2}>Bug Bounty Program</span>
            </h1>

            {/* Description */}
            <p className={styles.description}>
              Endless Domains invites you to find the bugs before anyone else does. Get hands-on access to our staging environment, a clear path through five guided phases, and rewards up to $500 based on what you uncover.
            </p>
          </div>

          {/* CTA row */}
          <div className={styles.ctaRow}>
            <SecondaryButton type="button">
              View Reward Tiers
            </SecondaryButton>
            <PrimaryButton size="sm" shape="rounded">
              Become A Tester
            </PrimaryButton>
          </div>

        </div>

      </div>
    </section>
  )
}

export default BugBountyHero
