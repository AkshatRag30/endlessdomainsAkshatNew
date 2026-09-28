import React from 'react'
import Image from 'next/image'
import styles from './AuthShell.module.scss'

export interface AuthShellProps {
  children: React.ReactNode
}

/**
 * Login / sign up page frame (Figma 16:511 desktop, 16:416 mobile): the
 * artwork panel beside a vertically centred right column on desktop, and
 * above it as a banner from tablet down. Pure layout, no auth logic.
 */
export const AuthShell = ({ children }: AuthShellProps) => (
  <div className={styles.page}>
    <div className={styles.art} aria-hidden="true">
      <span className={styles.artCrop}>
        <Image src="/loginimage.png" alt="" fill priority sizes="(max-width: 1039px) 100vw, 53vw" className={styles.artImage} />
      </span>
    </div>
    <main className={styles.column}>
      <div className={styles.content}>{children}</div>
    </main>
  </div>
)

export default AuthShell
