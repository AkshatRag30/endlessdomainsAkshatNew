import React from 'react'
import Link from 'next/link'
import { mockSidebarSections } from '@/data/marketplace/navigation'
import styles from './MobileBottomNav.module.scss'

interface BottomNavItem {
  id: string
  label: string
  href: string
  icon: string
}

const ITEMS: BottomNavItem[] = [
  { id: 'explore', label: 'Explore', href: '/', icon: '/assets/img/marketplace/bottomnav-explore.png' },
  { id: 'watchlist', label: 'Watchlist', href: '/profile/watchlist', icon: '/assets/img/marketplace/bottomnav-watchlist.svg' },
  { id: 'sell', label: 'Sell', href: '/', icon: '/assets/img/marketplace/bottomnav-sell.svg' },
  { id: 'account', label: 'Account', href: '/profile/userProfile', icon: '/assets/img/marketplace/bottomnav-account.svg' },
]

const watchlistCount = mockSidebarSections.flatMap((section) => section.items).find((item) => item.id === 'watchlist')?.count

/**
 * Figma node 34:2800 — mobile-only fixed tab bar, a new navigation surface
 * alongside the existing hamburger drawer, not a replacement for it.
 * Watchlist's badge reuses the same count already in mockSidebarSections
 * rather than a second copy of that number. Explore is hardcoded active to
 * match the mockup — this preview has no real routing between these
 * destinations yet, that's Phase 16 integration.
 */
export const MobileBottomNav = () => {
  return (
    <nav className={styles.nav} aria-label="Primary">
      {ITEMS.map((item) => {
        const active = item.id === 'explore'
        return (
          <Link key={item.id} href={item.href} className={`${styles.item} ${active ? styles.active : ''}`}>
            {active && <span className={styles.indicator} aria-hidden="true" />}
            <span className={styles.iconWrap}>
              <img src={item.icon} alt="" aria-hidden="true" className={styles.icon} />
              {item.id === 'watchlist' && watchlistCount != null && <span className={styles.badge}>{watchlistCount}</span>}
            </span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default MobileBottomNav
