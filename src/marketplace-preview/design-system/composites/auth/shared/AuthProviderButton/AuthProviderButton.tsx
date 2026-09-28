import React from 'react'
import Image from 'next/image'
import styles from './AuthProviderButton.module.scss'

export interface AuthProviderIcon {
  src: string
  alt: string
}

export interface AuthProviderButtonProps {
  label: string
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Overlapping logos after the label (Figma's chain stack), or a single one. */
  icons?: AuthProviderIcon[]
  /** Figma paints the first button's face lavender (#f3f3fe) and the second white. */
  tone?: 'tinted' | 'white'
}

/**
 * Figma 16:1043 / 16:1060 (mobile 16:459 / 16:476): a sign in button in its
 * two layer shell (lilac frame, bevelled face), on a row of hairlines. Used
 * for the wallet and Google buttons; the click handler is the caller's.
 */
export const AuthProviderButton = ({ label, onClick, icons = [], tone = 'white' }: AuthProviderButtonProps) => (
  <div className={styles.row}>
    <span className={styles.rails} aria-hidden="true" />
    <button type="button" className={styles.shell} onClick={onClick}>
      <span className={tone === 'tinted' ? `${styles.face} ${styles.faceTinted}` : styles.face}>
        <span className={styles.label}>{label}</span>
        {icons.length > 0 && (
          <span className={styles.icons} aria-hidden="true">
            {icons.map((icon) => (
              <Image key={icon.src} src={icon.src} alt="" width={24} height={24} className={styles.icon} />
            ))}
          </span>
        )}
      </span>
    </button>
  </div>
)

export default AuthProviderButton
