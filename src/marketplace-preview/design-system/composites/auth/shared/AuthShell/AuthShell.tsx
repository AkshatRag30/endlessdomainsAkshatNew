import React from 'react'
import Image from 'next/image'
import styles from './AuthShell.module.scss'

export interface AuthShellProps {
  children: React.ReactNode
}

const ART_SRC = '/loginimage.png'
const ART_SIZES = '(max-width: 1039px) 100vw, 50vw'

/**
 * Login / sign up page frame (Figma 16:511 desktop, 16:416 mobile): the
 * artwork half beside a vertically centred right column on desktop, and
 * above it as a banner from tablet down. Pure layout, no auth logic.
 */
export const AuthShell = ({ children }: AuthShellProps) => (
  <div className={styles.page}>
    <div className={styles.art} aria-hidden="true">
      {/* Desktop only: a blurred copy fills whatever the uncropped artwork
          leaves of its half, so a screen wider or taller than the art's
          proportions shows soft colour instead of white bands. Same src and
          sizes as the artwork, so the browser fetches it once. */}
      <Image src={ART_SRC} alt="" fill sizes={ART_SIZES} className={styles.artBackdrop} />
      <span className={styles.artFrame}>
        <span className={styles.artCrop}>
          <Image src={ART_SRC} alt="" fill priority sizes={ART_SIZES} className={styles.artImage} />
        </span>
      </span>
    </div>
    <main className={styles.column}>
      <div className={styles.content}>{children}</div>
    </main>
  </div>
)

export default AuthShell
