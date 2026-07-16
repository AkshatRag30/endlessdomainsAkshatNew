import React from 'react'
import { HiOutlineRocketLaunch, HiOutlineUserGroup, HiOutlineSparkles } from 'react-icons/hi2'
import { IoPricetagsOutline } from 'react-icons/io5'
import styles from './BugBountyWhatsNext.module.scss'

// Figma ships bespoke icon artwork per card; react-icons equivalents picked for closest semantic
// match since no source SVGs were provided for this section (unlike Onboarding, above).
const CARDS = [
  {
    Icon: HiOutlineRocketLaunch,
    title: 'Early Access',
    desc: 'First look at new features and future product releases, ahead of the general public.',
    variant: 'blue' as const,
  },
  {
    Icon: IoPricetagsOutline,
    title: 'Paid Research Invitations',
    desc: 'Invitations to paid research, usability studies, or advisory conversations.',
    variant: 'white' as const,
  },
  {
    Icon: HiOutlineUserGroup,
    title: 'Ambassador Consideration',
    desc: 'Priority consideration for ambassador, affiliate, or community leadership roles.',
    variant: 'white' as const,
  },
  {
    Icon: HiOutlineSparkles,
    title: 'Founding Tester Recognition',
    desc: 'Public acknowledgment as founding testers once Endless Domains goes to public launch.',
    variant: 'blue' as const,
  },
]

export function BugBountyWhatsNext() {
  return (
    <section className={styles.section} aria-labelledby="bug-bounty-whats-next-heading">

      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.labelWrap}>
            <span className={styles.labelBracketTL} aria-hidden="true" />
            <span className={styles.labelBracketTR} aria-hidden="true" />
            <span className={styles.labelBracketBL} aria-hidden="true" />
            <span className={styles.labelBracketBR} aria-hidden="true" />
            <p className={styles.labelText}>What&apos;s Next</p>
          </div>

          <h2 id="bug-bounty-whats-next-heading" className={styles.heading}>
            <span className={styles.headingLine1}>The Journey Doesn&apos;t End,</span>
            <span className={styles.headingLine2}>Here&apos;s What&apos;s Next</span>
          </h2>
        </div>

        <span className={styles.stripeCol} aria-hidden="true" />

        <div className={styles.right}>
          <span className={styles.rightCornerTL} aria-hidden="true" />
          <p className={styles.rightText}>
            Testers who consistently deliver high quality, high impact reports are recognized publicly within the community and considered first for opportunities beyond the program, including:
          </p>
          <span className={styles.rightCornerBR} aria-hidden="true" />
        </div>
      </div>

      <ul className={styles.cardGrid} role="list">
        {CARDS.map(({ Icon, title, desc, variant }) => (
          <li key={title} className={styles.card} data-variant={variant}>
            <span className={styles.cardPixelGrid} aria-hidden="true" />
            <span className={styles.cardGlowBL} aria-hidden="true" />
            <span className={styles.cardGlowTR} aria-hidden="true" />

            <span className={styles.cardBadge} aria-hidden="true">
              <Icon size={26} />
            </span>

            <div className={styles.cardText}>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDesc}>{desc}</p>
            </div>
          </li>
        ))}
      </ul>

    </section>
  )
}

export default BugBountyWhatsNext
