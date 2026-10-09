import React from 'react'
import Link from 'next/link'
import styles from './AuthFooterLink.module.scss'

export interface AuthFooterLinkProps {
  /** Optional: the forgot password page's "Back" link (Figma 25:16747) has no prompt. */
  prompt?: string
  linkLabel: string
  href: string
}

/** Figma 16:1076: "Don't have an account? Signup", 43px under the buttons. */
export const AuthFooterLink = ({ prompt, linkLabel, href }: AuthFooterLinkProps) => (
  <p className={styles.footer}>
    {prompt && `${prompt} `}
    <Link href={href} className={styles.link}>
      {linkLabel}
    </Link>
  </p>
)

export default AuthFooterLink
