import Link from 'next/link'
import React from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import styles from './NavLink.module.scss'

export interface NavLinkProps {
  label: string
  href: string
  isActive?: boolean
}

export const NavLink: React.FC<NavLinkProps> = ({ label, href, isActive = false }) => (
  <Link
    href={href}
    className={`${styles.link} ${isActive ? styles.active : ''}`}
    aria-current={isActive ? 'page' : undefined}
  >
    <span className={styles.bracket} aria-hidden="true">[</span>
    <span className={styles.label}>{label}</span>
    <FiArrowUpRight className={styles.arrow} aria-hidden="true" />
    <span className={styles.bracket} aria-hidden="true">]</span>
  </Link>
)

export default NavLink
