import React from 'react'
import { PiUserBold, PiFingerprintBold, PiLockKeyBold } from 'react-icons/pi'

import styles from './DomainOwnership.module.scss'

interface OwnershipCard {
  id: string
  Icon: typeof PiUserBold
  title: string
  desc: string
}

const CARDS: OwnershipCard[] = [
  {
    id: 'seamless-interactions',
    Icon: PiUserBold,
    title: 'Seamless Interactions',
    desc: 'One unique identity links to multiple wallet addresses. Access dApps, send payments, and login across the entire on-chain economy from one identity.',
  },
  {
    id: 'establish-identity',
    Icon: PiFingerprintBold,
    title: 'Establish Your Identity',
    desc: 'Your on-chain identity is your permanent, recognizable presence across the entire ecosystem. One Identity. Every chain. Every application. Always yours.',
  },
  {
    id: 'ownership-control',
    Icon: PiLockKeyBold,
    title: '100% ownership and control',
    desc: 'Decentralised ownership means you transfer, publish, and update your identity without relying on any central authority. No permission required. Ever.',
  },
]

export function DomainOwnership() {
  return (
    <section className={styles.section} aria-labelledby="domain-ownership-heading">

      {/* Header — bounded top/bottom by dashed rule lines */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.labelWrap}>
            <span className={styles.labelBracketTL} aria-hidden="true" />
            <span className={styles.labelBracketTR} aria-hidden="true" />
            <span className={styles.labelBracketBL} aria-hidden="true" />
            <span className={styles.labelBracketBR} aria-hidden="true" />
            <p className={styles.labelText}>The Case For Ownership</p>
          </div>

          <h2 id="domain-ownership-heading" className={styles.heading}>
            <span className={styles.headingLine1}>Why Owning your On-Chain Identity</span>
            <span className={styles.headingLine2}>Is Not Optional.</span>
          </h2>

          <p className={styles.description}>
            Make your mark. Own your story. The internet should work for you, not the other way around.
          </p>
        </div>
      </div>

      {/* Card row */}
      <div className={styles.cardRow}>
        {CARDS.map(card => {
          const Icon = card.Icon
          return (
            <div key={card.id} className={styles.card}>
              <div className={styles.cardInner}>
                <span className={styles.iconBadge} aria-hidden="true">
                  <Icon size={20} />
                </span>
                <div className={styles.cardText}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDesc}>{card.desc}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </section>
  )
}

export default DomainOwnership
