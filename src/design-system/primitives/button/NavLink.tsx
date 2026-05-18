import React from 'react'
import styles from './NavLink.module.scss'

export interface NavLinkProps {
  label: string
  href: string
  isActive?: boolean
}

export const NavLink: React.FC<NavLinkProps> = ({ label, href, isActive = false }) => (
  <a
    href={href}
    className={`${styles.link} ${isActive ? styles.active : ''}`}
    aria-current={isActive ? 'page' : undefined}
  >
    <span className={styles.bracket} aria-hidden="true">[</span>
    <span className={styles.label}>{label}</span>
    <svg
      className={styles.arrow}
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M1 7L7 1M7 1H2M7 1V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className={styles.bracket} aria-hidden="true">]</span>
  </a>
)

export default NavLink
