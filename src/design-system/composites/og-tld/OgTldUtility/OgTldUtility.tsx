import React from 'react'
import { BsCurrencyDollar } from 'react-icons/bs'
import { CiLogin } from 'react-icons/ci'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import { CgProfile } from 'react-icons/cg'

import { ReputationBadgeIcon, ParkEarnBadgeIcon } from './icons'
import styles from './OgTldUtility.module.scss'

const UTILITIES = [
  {
    id: 'receive-payments',
    Icon: BsCurrencyDollar,
    title: 'Receive Payments',
    desc: 'Use a human-readable identity instead of long wallet addresses across supported chains.',
  },
  {
    id: 'build-reputation',
    Icon: ReputationBadgeIcon,
    title: 'Build Reputation',
    desc: 'Create a verifiable on-chain reputation that grows with every interaction.',
  },
  {
    id: 'universal-login',
    Icon: CiLogin,
    title: 'Universal Login',
    desc: 'Access integrated applications with one identity instead of multiple accounts.',
  },
  {
    id: 'park-and-earn',
    Icon: ParkEarnBadgeIcon,
    title: 'Park And Earn',
    desc: 'Monetize unused identities through future parking and earning features.',
  },
  {
    id: 'trade-freely',
    Icon: FaArrowRightArrowLeft,
    title: 'Trade Freely',
    desc: 'Transfer, buy, and sell identities through blockchain-based ownership.',
  },
  {
    id: 'store-credentials',
    Icon: CgProfile,
    title: 'Store Credentials',
    desc: 'Attach achievements, governance participation, and proof of work to your identity.',
  },
]

export function OgTldUtility() {
  return (
    <section className={styles.section} aria-labelledby="og-tld-utility-heading">

      {/* ── Title block ── */}
      <div className={styles.titleBlock}>
        <span className={styles.dividerLine} aria-hidden="true" />

        <div className={styles.labelWrap}>
          <span className={styles.labelBracketTL} aria-hidden="true" />
          <span className={styles.labelBracketTR} aria-hidden="true" />
          <span className={styles.labelBracketBL} aria-hidden="true" />
          <span className={styles.labelBracketBR} aria-hidden="true" />
          <p className={styles.labelText}>Utility</p>
        </div>

        <h2 id="og-tld-utility-heading" className={styles.heading}>
          <span className={styles.headingLine1}>What Your</span>
          <span className={styles.headingLine2}>.og Unlocks</span>
        </h2>

        <span className={styles.dividerLine} aria-hidden="true" />
      </div>

      {/* ── Utility grid ── */}
      <ul className={styles.grid} role="list">
        {UTILITIES.map(utility => (
          <li key={utility.id} className={styles.card}>
            <span className={styles.cardBracketTL} aria-hidden="true" />
            <span className={styles.cardBracketBR} aria-hidden="true" />

            <span className={styles.iconBadge} aria-hidden="true">
              <utility.Icon size={26} />
            </span>

            <h3 className={styles.cardTitle}>{utility.title}</h3>
            <p className={styles.cardDesc}>{utility.desc}</p>
          </li>
        ))}
      </ul>

    </section>
  )
}

export default OgTldUtility
