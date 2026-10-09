import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import primaryBtnStyles from '@/marketplace-preview/design-system/primitives/buttons/primary-button/Primarybutton.module.scss'
import styles from './AuthResultPanel.module.scss'

export interface AuthResultPanelProps {
  heading: string
  /** ReactNode so the page can emphasise part of it (e.g. the email address). */
  body: React.ReactNode
  actionLabel: string
  actionHref: string
}

/**
 * Figma 25:17266 ("verification success"): the logo over the faint grid,
 * the ringed check with confetti, a heading and body, then one full width
 * action. The action is a real link styled with PrimaryButton's classes
 * (same technique as SidebarPromoCard), so it navigates like one.
 */
export const AuthResultPanel = ({ heading, body, actionLabel, actionHref }: AuthResultPanelProps) => (
  <div className={styles.panel}>
    {/* 25:17270: 77px above the logo. Desktop only, like the login grid. */}
    <Image src="/assets/img/auth/logo-grid.png" alt="" aria-hidden="true" width={379} height={268} className={styles.grid} />
    <Link href="/" className={styles.logoLink} aria-label="Endless Domains home">
      <Image src="/assets/img/auth/logo.svg" alt="Endless Domains" width={148} height={49} priority className={styles.logo} />
    </Link>
    {/* 25:17756, exported with its confetti and ring glow. */}
    <Image src="/assets/img/auth/success-check.png" alt="" aria-hidden="true" width={328} height={139} className={styles.illustration} />
    <div className={styles.text}>
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.body}>{body}</p>
    </div>
    <Link href={actionHref} className={`${primaryBtnStyles.button} ${primaryBtnStyles.fullWidth} ${styles.action}`}>
      <span>{actionLabel}</span>
      <span className={primaryBtnStyles.iconRight} aria-hidden="true">
        <FiArrowRight size={20} />
      </span>
    </Link>
  </div>
)

export default AuthResultPanel
