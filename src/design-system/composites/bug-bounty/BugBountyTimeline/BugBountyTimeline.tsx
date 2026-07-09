import React from 'react'
import Image from 'next/image'
import heroConnectorImage from '../../../../../public/bug-bounty/heroconnector.svg'
import styles from './BugBountyTimeline.module.scss'

const PHASES = [
  { num: '01', title: 'Onboarding', desc: 'Get invited, briefed on scope, and granted access to the staging environment.' },
  { num: '02', title: 'Active Testing', desc: 'Explore your assigned modules and log bugs as you find them.' },
  { num: '03', title: 'Bi-Weekly Review', desc: 'Every submission gets reviewed and severity gets validated every two weeks.' },
  { num: '04', title: 'Reward Processing', desc: 'Approved rewards go out first come, first served.' },
  { num: '05', title: 'Program Wrap-Up', desc: 'Final review, then a transition into ongoing opportunities for top testers.' },
]

// Staircase connector line — right-side variant, opaque at the outer edge, fading toward center.
// gradientId is threaded through so each of the four instances gets its own <linearGradient>,
// since SVG ids are global in the rendered DOM and would otherwise collide.
function RightConnector({ gradientId }: { gradientId: string }) {
  return (
    <svg width="734" height="351" viewBox="0 0 734 351" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M733.131 0.414429L614.631 80.4144V135.914L315.131 218.414V264.914L0.130981 350.414" stroke={`url(#${gradientId})`} />
      <defs>
        <linearGradient id={gradientId} x1="733.131" y1="175.414" x2="176.974" y2="175.408" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2639ED" stopOpacity="0.31" />
          <stop offset="0.950792" stopColor="#2639ED" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Staircase connector line — left-side variant (mirrored), opaque at the outer edge, fading toward center.
function LeftConnector({ gradientId }: { gradientId: string }) {
  return (
    <svg width="734" height="351" viewBox="0 0 734 351" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.279785 0.414429L118.78 80.4144V135.914L418.28 218.414V264.914L733.28 350.414" stroke={`url(#${gradientId})`} />
      <defs>
        <linearGradient id={gradientId} x1="0.279785" y1="175.414" x2="556.437" y2="175.408" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2639ED" stopOpacity="0.31" />
          <stop offset="0.950792" stopColor="#2639ED" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function BugBountyTimeline() {
  return (
    <section className={styles.section} aria-labelledby="bug-bounty-timeline-heading">

      {/* ── Hero connector — bridges the seam between the hero section and this one ── */}
      <Image src={heroConnectorImage} alt="" aria-hidden="true" className={styles.heroConnector} priority={false} />

      <header className={styles.header}>
        <div className={styles.labelWrap}>
          <span className={styles.labelBracketTL} aria-hidden="true" />
          <span className={styles.labelBracketTR} aria-hidden="true" />
          <span className={styles.labelBracketBL} aria-hidden="true" />
          <span className={styles.labelBracketBR} aria-hidden="true" />
          <p className={styles.labelText}>Program Timeline</p>
        </div>

        <h2 id="bug-bounty-timeline-heading" className={styles.heading}>
          <span className={styles.headingLine1}>Five Phases, One</span>
          <span className={styles.headingLine2}>Continuous Journey</span>
        </h2>
      </header>

      <div className={styles.wave} role="list">
        {PHASES.map(phase => (
          <div key={phase.num} className={styles.circle} role="listitem">
            <span className={styles.circleNum}>{phase.num}</span>
            <h3 className={styles.circleTitle}>{phase.title}</h3>
            <p className={styles.circleDesc}>{phase.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Corner connector lines — two staircase accents on each outer edge, below the circles ── */}
      <div className={styles.connectorLines} aria-hidden="true">
        <div className={styles.connectorLeft}>
          <LeftConnector gradientId="bb-timeline-connector-left-1" />
          <LeftConnector gradientId="bb-timeline-connector-left-2" />
        </div>
        <div className={styles.connectorRight}>
          <RightConnector gradientId="bb-timeline-connector-right-1" />
          <RightConnector gradientId="bb-timeline-connector-right-2" />
        </div>
      </div>

      {/* Tablet/mobile — same circular badges as desktop, wrapped 2-per-row instead of the arc */}
      <div className={styles.mobileWave} role="list">
        {PHASES.map(phase => (
          <div key={phase.num} className={styles.mobileCircle} role="listitem">
            <span className={styles.mobileCircleNum}>{phase.num}</span>
            <h3 className={styles.mobileCircleTitle}>{phase.title}</h3>
            <p className={styles.mobileCircleDesc}>{phase.desc}</p>
          </div>
        ))}
      </div>

    </section>
  )
}

export default BugBountyTimeline
