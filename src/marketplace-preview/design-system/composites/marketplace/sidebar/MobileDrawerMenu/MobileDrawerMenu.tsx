import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { useAuth, deleteCookieAttribute, Cookie_Key, logoutUserApi } from '@/marketplace-preview/stubs/auth'
import { HEADER_NAV_ITEMS } from '@/marketplace-preview/design-system/layouts/header/menuItems'
import { mockSidebarSections } from '@/marketplace-preview/data/marketplace/navigation'
import styles from './MobileDrawerMenu.module.scss'

export interface MobileDrawerMenuProps {
  onClose: () => void
  // TEMPORARY, preview-only — see the matching prop on Header for why. Nav
  // and Browse rows mark themselves selected instead of navigating, and the
  // drawer stays open on tap instead of closing, so a reviewer can click
  // through every row without getting bounced to /login or losing the open
  // drawer. Remove once Phase 16 wires these up to real destinations.
  previewMode?: boolean
}

const [browseSection] = mockSidebarSections
const [exploreItem] = browseSection.items

/**
 * Figma node 34:2884 — the mobile/tablet drawer's actual content once
 * opened. Replaces MarketplaceSidebar (CSS-hidden below desktop, see its
 * own module) below 992px rather than reflowing it, since this is a
 * genuinely different layout: a logo + close header, a search field, a
 * Navigation section mirroring Header's own nav exactly (same data, same
 * active-route check, same arrow assets), then the existing Browse data
 * with Explore singled out as a highlighted row, and an auth action at the
 * bottom. Reuses HEADER_NAV_ITEMS and mockSidebarSections rather than a
 * second copy of either.
 */
export const MobileDrawerMenu = ({ onClose, previewMode }: MobileDrawerMenuProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const { authenticated, logout } = useAuth()
  const [previewSelectedNav, setPreviewSelectedNav] = useState('Marketplace')
  const [previewSelectedBrowseId, setPreviewSelectedBrowseId] = useState(exploreItem.id)

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await logoutUserApi()
    deleteCookieAttribute(Cookie_Key.ACCESS_TOKEN)
    deleteCookieAttribute(Cookie_Key.REFRESH_TOKEN)
    logout()
    onClose()
    router.push('/login')
  }

  return (
    <div className={styles.drawer}>
      <div className={styles.header}>
        <Link href="/" className={styles.logo} onClick={onClose}>
          <img src="/assets/img/logo.svg" alt="Endless Domains" />
        </Link>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close menu">
          <span className={styles.closeBar} />
          <span className={styles.closeBar} />
        </button>
      </div>

      <div className={styles.search}>
        <img src="/assets/img/marketplace/drawer-search-icon.svg" alt="" aria-hidden="true" className={styles.searchIcon} />
        {/* Visual only for this pass, same as Header's own search field */}
        <input type="text" placeholder="Search...." className={styles.searchInput} readOnly />
        <div className={styles.kbdGroup}>
          <span className={styles.kbd}>&#8984;</span>
          <span className={styles.kbd}>K</span>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Navigation</p>
        <nav className={styles.navList}>
          {HEADER_NAV_ITEMS.map((item) => {
            const isActive = previewMode ? item.label === previewSelectedNav : pathname === item.href && item.label === 'Marketplace'
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={previewMode ? (e) => { e.preventDefault(); setPreviewSelectedNav(item.label) } : onClose}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {item.label}
                <img
                  src={isActive ? '/assets/img/header/nav-arrow-active.svg' : '/assets/img/header/nav-arrow-inactive.svg'}
                  alt=""
                  aria-hidden="true"
                  className={styles.navArrow}
                />
              </Link>
            )
          })}
        </nav>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Browse</p>

        {/* Explore's boxed background + flourish (Figma node 34:2994) is a
            "this row is selected" treatment, not a permanent Explore-only
            decoration — it now follows previewSelectedBrowseId onto
            whichever row was last tapped instead of sitting on Explore
            regardless of what's selected. */}
        <nav className={styles.browseList}>
          {browseSection.items.map((item) => {
            const isExplore = item.id === exploreItem.id
            const isSelected = previewMode && previewSelectedBrowseId === item.id
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={previewMode ? (e) => { e.preventDefault(); setPreviewSelectedBrowseId(item.id) } : onClose}
                className={`${styles.browseRow} ${isSelected ? styles.browseRowSelected : ''}`}
              >
                <img
                  src={isExplore ? '/assets/img/marketplace/drawer-explore-icon.svg' : '/assets/img/marketplace/drawer-browse-icon.svg'}
                  alt=""
                  aria-hidden="true"
                  className={styles.browseIcon}
                />
                <span className={styles.browseLabel}>{item.label}</span>
                {typeof item.count === 'number' && <span className={styles.browseCount}>{item.count}</span>}
                {item.badge && <span className={styles.browseBadge}>{item.badge}</span>}
                {isSelected && (
                  <>
                    <img src="/assets/img/marketplace/drawer-explore-deco-1.svg" alt="" aria-hidden="true" className={styles.exploreDeco1} />
                    <img src="/assets/img/marketplace/drawer-explore-deco-2.svg" alt="" aria-hidden="true" className={styles.exploreDeco2} />
                    <img src="/assets/img/marketplace/drawer-explore-deco-3.png" alt="" aria-hidden="true" className={styles.exploreDeco3} />
                  </>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className={styles.footer}>
        {authenticated ? (
          <button type="button" className={styles.authButton} onClick={handleLogout}>
            Signout
          </button>
        ) : (
          <div className={styles.authLinks}>
            <Link href="/login" onClick={onClose} className={styles.authButton}>
              Login
            </Link>
            <Link href="/register" onClick={onClose} className={styles.authButton}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileDrawerMenu
