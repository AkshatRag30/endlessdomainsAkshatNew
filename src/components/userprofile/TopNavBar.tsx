import React from 'react'
import { NavLink } from '@/design-system/primitives/button/NavLink'
import { Avatar } from '@/design-system/primitives/display/Avatar'
import styles from './TopNavBar.module.scss'

export interface TopNavBarProps {
  logoSrc?: string
  avatarSrc?: string
  avatarAlt?: string
}

const NAV_LINKS = [
  { label: 'Domains', href: '/', isActive: true },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Marketplace', href: '/marketplace2' },
  { label: 'Parked Domains', href: '/parked-domains' },
]

export const TopNavBar: React.FC<TopNavBarProps> = ({
  logoSrc = '/logos/endless-logo-white.svg',
  avatarSrc = '/avatars/default.png',
  avatarAlt = 'User avatar',
}) => (
  <header className={styles.header} role="banner">
    <div className={styles.inner}>
      <a href="/" className={styles.logoLink} aria-label="Endless Domains home">
        <img src={logoSrc} alt="Endless Domains" className={styles.logo} />
      </a>

      <nav className={styles.nav} aria-label="Main navigation">
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.href}
            label={link.label}
            href={link.href}
            isActive={link.isActive}
          />
        ))}
      </nav>

      <div className={styles.userMenu}>
        <div className={styles.avatarWrapper}>
          <Avatar src={avatarSrc} alt={avatarAlt} size="md" />
        </div>

        <button type="button" className={styles.menuBtn} aria-label="Open menu">
          <span className={styles.menuLabel}>Menu</span>
          <span className={styles.hamburger} aria-hidden="true">
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </span>
        </button>

        <button type="button" className={styles.cartBtn} aria-label="View cart">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M9 22c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm11 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zM1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
)

export default TopNavBar
