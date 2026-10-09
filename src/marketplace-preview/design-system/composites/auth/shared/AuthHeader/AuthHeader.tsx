import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './AuthHeader.module.scss'

export interface AuthHeaderProps {
  heading: string
  subtext: string
  /**
   * 'behind' (default): the grid starts 13px above the logo, as on the
   * login frame (16:522). 'raised': 161px above it, as on the forgot
   * password frame (25:16248), so it clears the form below.
   */
  gridPosition?: 'behind' | 'raised'
}

/**
 * Figma 16:988 / 16:419: the Endless Domains logo (linking home, in place of
 * the old pages' "Back" link) over the faint grid, then the heading and
 * subtext.
 */
export const AuthHeader = ({ heading, subtext, gridPosition = 'behind' }: AuthHeaderProps) => (
  <div className={styles.header}>
    {/* Figma 16:522, already at its 45% opacity in the export. Desktop only: the mobile frame has no grid. */}
    <Image src="/assets/img/auth/logo-grid.png" alt="" aria-hidden="true" width={379} height={268} className={gridPosition === 'raised' ? `${styles.grid} ${styles.gridRaised}` : styles.grid} />
    <Link href="/" className={styles.logoLink} aria-label="Endless Domains home">
      <Image src="/assets/img/auth/logo.svg" alt="Endless Domains" width={148} height={49} priority className={styles.logo} />
    </Link>
    <div className={styles.text}>
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.subtext}>{subtext}</p>
    </div>
  </div>
)

export default AuthHeader
