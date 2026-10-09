import React from 'react'
import Image from 'next/image'
import styles from './AuthShell.module.scss'

export interface AuthShellProps {
  children: React.ReactNode
}

// ~5MB. Left as-is deliberately: the transparent 114px right apron
// (AuthShell.module.scss's own $canvas-over-art comment) is load-bearing —
// .artBackdrop (a second, blurred `fill` copy of this same image) shows
// through it, which a JPEG re-export (no alpha channel) would flatten to
// solid color and a naive resize doesn't reliably shrink either (tried:
// sips's own PNG re-encode of a resized copy came out larger, not
// smaller). Needs a real PNG-aware optimizer (pngquant/oxipng/squoosh),
// not available in this environment, to fix without a visual regression.
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
