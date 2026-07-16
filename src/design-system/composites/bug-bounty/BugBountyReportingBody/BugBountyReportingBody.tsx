import React from 'react'
import Image from 'next/image'
import { HiArrowUpRight } from 'react-icons/hi2'
import styles from './BugBountyReportingBody.module.scss'

const STEPS = [
  { num: '01', title: 'Open Bug And Feedback Sheet', desc: 'Every submission is logged on a shared sheet visible to the entire tester community, so duplicate reports get caught before they happen.' },
  { num: '02', title: 'Bug Review', desc: 'The program team reviews all new submissions every two weeks, validating reproducibility and confirming severity.' },
  { num: '03', title: 'First Come, First Served', desc: 'Where multiple testers report the same issue, the reward goes to whoever submitted first and passed validation.' },
  { num: '04', title: 'Feedback Loop', desc: 'You get status updates on every submission: accepted, duplicate, needs more information, or not reproducible.' },
]

const TIERS = [
  { tier: 'Low', amount: 'Up to $15', desc: 'Minor glitches and small inconsistencies that are hard to exploit in any meaningful way.' },
  { tier: 'Medium', amount: 'Up to $75', desc: 'Weaknesses that need some existing access, or extra conditions, before they become useful to an attacker.' },
  { tier: 'High', amount: 'Up to $250', desc: 'Serious issues affecting a key feature or exposing sensitive data, just short of platform wide impact.' },
  { tier: 'Critical', amount: 'Up to $500', desc: 'Vulnerabilities that could compromise the platform at scale, expose user data broadly, or put funds at risk.' },
]

export function BugBountyReportingBody() {
  return (
    <section className={styles.section} aria-label="Reporting, review, and reward structure">

      {/* ── Row 1 — process steps, hover turns each card purple ── */}
      <div className={styles.rowOneSection}>
        <div className={styles.rowOneBg} aria-hidden="true" />
        <div className={styles.rowOneWrap}>
          <div className={styles.stripeCol} data-side="left" aria-hidden="true" />

          <ul className={styles.rowOne} role="list">
            {STEPS.map(step => (
              <li key={step.num} className={styles.stepCard}>
                <span className={styles.stepNum}>{step.num}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </li>
            ))}
          </ul>

          <div className={styles.stripeCol} data-side="right" aria-hidden="true" />
        </div>
      </div>

      {/* ── Row 2 — severity / reward tiers ── */}
      <ul className={styles.rowTwo} role="list">
        <span className={styles.rowTwoEdgeLine} data-side="left" aria-hidden="true" />
        <span className={styles.rowTwoEdgeLine} data-side="right" aria-hidden="true" />
        {TIERS.map(tier => (
          <li key={tier.tier} className={styles.tierCard}>
            <span className={styles.tierCornerTL} aria-hidden="true" />
            <span className={styles.tierCornerTR} aria-hidden="true" />
            <span className={styles.tierCornerBL} aria-hidden="true" />
            <span className={styles.tierCornerBR} aria-hidden="true" />
            <p className={styles.tierLabel}>{tier.tier}</p>
            <p className={styles.tierAmount}>{tier.amount}</p>
            <p className={styles.tierDesc}>{tier.desc}</p>
          </li>
        ))}
      </ul>

      {/* ── Trapezoid footer banner ── */}
      <div className={styles.bannerWrap}>
        <div className={styles.banner}>
          <Image
            src="/providers/freename/icon-bg-texture.png"
            alt=""
            aria-hidden="true"
            fill
            className={styles.bannerTexture}
            unoptimized
          />
          <p className={styles.bannerText}>
            Final severity classification and reward amount are determined by the program team during review, based on impact, exploitability, and how clearly the issue is documented.
          </p>
          <button type="button" className={styles.bannerButton}>
            Terms and Condition
            <HiArrowUpRight className={styles.bannerButtonIcon} aria-hidden="true" />
          </button>
        </div>
      </div>

    </section>
  )
}

export default BugBountyReportingBody
