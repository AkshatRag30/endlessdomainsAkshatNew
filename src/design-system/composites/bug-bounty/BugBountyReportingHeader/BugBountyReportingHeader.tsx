import React from 'react'
import styles from './BugBountyReportingHeader.module.scss'

export function BugBountyReportingHeader() {
  return (
    <section className={styles.section} aria-labelledby="bug-bounty-reporting-heading">
      <div className={styles.topArea}>

        {/* Decorative striped column on the left */}
        <div className={styles.stripeCol} data-side="left" aria-hidden="true" />

        {/* Center content */}
        <div className={styles.centerContent}>

          {/* Eyebrow with 4 corner brackets */}
          <div className={styles.subtitleWrap}>
            <span className={styles.subtitleBracketTL} aria-hidden="true" />
            <span className={styles.subtitleBracketTR} aria-hidden="true" />
            <span className={styles.subtitleBracketBL} aria-hidden="true" />
            <span className={styles.subtitleBracketBR} aria-hidden="true" />
            <p className={styles.subtitleText}>Reporting, Review &amp; Reward Structure</p>
          </div>

          {/* Heading */}
          <h2 id="bug-bounty-reporting-heading" className={styles.heading}>
            <span className={styles.headingLine1}>From Submission To</span>
            <span className={styles.headingLine2}>Severity Based Payout</span>
          </h2>

        </div>

        {/* Decorative striped column on the right */}
        <div className={styles.stripeCol} data-side="right" aria-hidden="true" />
      </div>
    </section>
  )
}

export default BugBountyReportingHeader
