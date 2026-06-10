import { useRef } from 'react'
import { useEntranceAnimation } from '../useEntranceAnimation'
import styles from './AboutSection.module.scss'

const STATS = [
  { value: '2020', label: 'Founded' },
  { value: '450+', label: 'Integrations' },
  { value: '4K+', label: '.og Mints' },
]

export default function AboutSection() {
  const subtitleRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLElement>(null)

  useEntranceAnimation([subtitleRef, headingRef, descRef, statsRef, quoteRef])

  return (
    <section className={styles.section} aria-labelledby="about-heading">

      {/* Top content band — subtitle + heading + description */}
      <div className={styles.topBand}>

        {/* Grid lines behind the top band */}
        <div className={styles.gridLines} aria-hidden="true" />

        <div className={styles.topInner}>

          {/* Subtitle / eyebrow */}
          <div className={styles.subtitle} aria-label="Who we are" ref={subtitleRef}>
            <span className={styles.subtitleBracketTL} aria-hidden="true" />
            <span className={styles.subtitleBracketTR} aria-hidden="true" />
            <span className={styles.subtitleText}>WHO WE ARE</span>
            <span className={styles.subtitleBracketBL} aria-hidden="true" />
            <span className={styles.subtitleBracketBR} aria-hidden="true" />
          </div>

          {/* Heading */}
          <h2 id="about-heading" className={styles.heading} ref={headingRef}>
            <span className={styles.headingLine}>
              <span className={styles.headingBlack}>Every Identity You Have Ever</span>
            </span>
            <span className={styles.headingLine}>
              <span className={styles.headingBlue}>Had Was Borrowed.</span>
            </span>
          </h2>

          {/* Description */}
          <p className={styles.description} ref={descRef}>
            Every identity you have ever built online sits on a layer someone else controls. They
            have always reserved the right to take it back. Endless Domains was built on a different
            premise. Minted to your wallet. Recorded on-chain. Belonging to no one but you.
          </p>

        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow} aria-label="Key statistics" ref={statsRef}>
        {STATS.map((stat, i) => (
          <div key={stat.label} className={styles.statItem}>

            {/* Corner bracket decoration */}
            <div className={styles.statBox} aria-hidden="true">
              <span className={styles.bracketTL} />
              <span className={styles.bracketTR} />
              <span className={styles.bracketBL} />
              <span className={styles.bracketBR} />
            </div>

            <div className={styles.statContent}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>

            {/* Vertical divider after all but last */}
            {i < STATS.length - 1 && (
              <div className={styles.statDivider} aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      {/* Quote */}
      <blockquote className={styles.quote} ref={quoteRef}>
        <p>"Your identity on the internet should be as permanent as your ownership of it."</p>
      </blockquote>

    </section>
  )
}
