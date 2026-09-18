import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faChartLine, faHeart, faUser, faArrowRightArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/context/AuthContext'
import { deleteCookieAttribute } from '@/core/services/cookies.service'
import { Cookie_Key } from '@/core/enum/cookie.enum'
import { useIsMobile } from '@/utils/UseIsMobile'
import { logoutUserApi } from '@/core/services/api.service'
import primaryBtnStyles from '@/design-system/primitives/buttons/primary-button/Primarybutton.module.scss'
import styles from './Header.module.scss'
import { HEADER_NAV_ITEMS } from './menuItems'

type HeaderProps = {
  transparent?: boolean // accepted for drop-in compatibility with the old Header's prop contract; Figma has no transparent variant of this design yet
  hidden?: boolean
  // Opt-in only — omitted by every page except the marketplace preview, so
  // no other page's header changes. Figma's tablet/mobile marketplace mocks
  // (nodes 20:1155 / 27:551) add a hamburger chip beside the logo below
  // 992px; nothing else in the bar changes at that width.
  onMenuClick?: () => void
  menuOpen?: boolean
  // TEMPORARY, preview-only: several nav destinations (Portfolio/Sell/
  // Resources placeholders, and anything behind auth like Watchlist) either
  // don't exist yet or bounce an unauthenticated preview session to /login,
  // which was kicking reviewers off the design-preview page entirely. When
  // true, nav links just mark themselves selected instead of navigating —
  // opt-in and only ever passed from pages/design-preview/marketplace.tsx,
  // so no other page's real navigation changes. Remove once Phase 16 wires
  // these up to real destinations.
  previewMode?: boolean
}

/**
 * New header, built from Figma nodes 3:6449 (logo + nav) and 3:6603 (search +
 * connect wallet). Visual pass only — nav destinations for Portfolio, Sell,
 * and Resources are placeholders (see menuItems.ts) and the search input
 * does not call any API yet. Authentication behavior is untouched: the same
 * useAuth()/logout() and the same account dropdown markup and links as the
 * archived header, just repositioned into the new layout.
 */
const Header: React.FC<HeaderProps> = ({ hidden, onMenuClick, menuOpen, previewMode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { authenticated, logout } = useAuth()
  const isMobile = useIsMobile()
  const [showDropdown, setShowDropdown] = useState(false)
  const [previewSelectedNav, setPreviewSelectedNav] = useState('Marketplace')

  if (hidden) return null

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await logoutUserApi()
    deleteCookieAttribute(Cookie_Key.ACCESS_TOKEN)
    deleteCookieAttribute(Cookie_Key.REFRESH_TOKEN)
    logout()
    router.push('/login')
  }

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        {onMenuClick && (
          <button
            type="button"
            className={styles.menuToggle}
            onClick={onMenuClick}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={styles.menuToggleBar} />
          </button>
        )}

        <Link href="/" className={styles.logo}>
          <img src="/assets/img/logo.svg" alt="Endless Domains" />
        </Link>

        <nav className={styles.nav}>
          {HEADER_NAV_ITEMS.map((item, index) => {
            const isActive = previewMode ? item.label === previewSelectedNav : pathname === item.href && item.label === 'Marketplace'
            return (
              <React.Fragment key={item.label}>
                {index > 0 && <span className={styles.navDivider} aria-hidden="true" />}
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  onClick={previewMode ? (e) => { e.preventDefault(); setPreviewSelectedNav(item.label) } : undefined}
                >
                  {item.label}
                  <img
                    src={isActive ? '/assets/img/header/nav-arrow-active.svg' : '/assets/img/header/nav-arrow-inactive.svg'}
                    alt=""
                    aria-hidden="true"
                    className={styles.navArrow}
                  />
                </Link>
              </React.Fragment>
            )
          })}
        </nav>
      </div>

      <div className={styles.right}>
        <div className={styles.search}>
          <img src="/assets/img/header/search-icon.svg" alt="" aria-hidden="true" className={styles.searchIcon} />
          {/* Visual only for this pass — not wired to the domain search API yet */}
          <input type="text" placeholder="Search...." className={styles.searchPlaceholder} readOnly />
          <div className={styles.kbdGroup}>
            <span className={styles.kbd}>&#8984;</span>
            <span className={styles.kbd}>K</span>
          </div>
        </div>

        <div className={styles.accountSlot}>
          {authenticated ? (
            <div
              className="nav-item position-relative"
              onMouseEnter={() => !isMobile && setShowDropdown(true)}
              onMouseLeave={() => !isMobile && setShowDropdown(false)}
              onClick={() => {
                if (isMobile) setShowDropdown((prev) => !prev)
              }}
            >
              <div className="nav-link active cursor-pointer">
                <img src="/assets/img/User-profile.svg" alt="profile" />
              </div>

              {showDropdown && (
                <div className="user-dropdown">
                  <ul className="dropdown-list">
                    <li>
                      <Link href="/profile/domains" onClick={() => setShowDropdown(false)} className="nav-link">
                        <FontAwesomeIcon icon={faGlobe} /> My Domains
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile/analytics" onClick={() => setShowDropdown(false)} className="nav-link">
                        <FontAwesomeIcon icon={faChartLine} /> Analytics
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile/watchlist" onClick={() => setShowDropdown(false)} className="nav-link">
                        <FontAwesomeIcon icon={faHeart} /> Watchlist
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile/userProfile" onClick={() => setShowDropdown(false)}>
                        <FontAwesomeIcon icon={faUser} /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/transaction-history" onClick={() => setShowDropdown(false)} className="nav-link">
                        <FontAwesomeIcon icon={faArrowRightArrowLeft} /> Transaction History
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={(e) => {
                          setShowDropdown(false)
                          handleLogout(e)
                        }}
                        className="logout-btn nav-link"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Was two separate links in MarketplaceSidebar's "Your Account" section — moved here, inside the connect-wallet pill, replacing its "connect wallet" text, rather than duplicated in both places. */}
              <div className={`${primaryBtnStyles.button} ${primaryBtnStyles.sm} ${styles.connectWallet} ${styles.authLinks}`}>
                <Link href="/login" className={styles.authLink}>
                  <span>Login</span>
                </Link>
                <span className={styles.authDivider} aria-hidden="true" />
                <Link href="/register" className={styles.authLink}>
                  <span>Sign Up</span>
                </Link>
              </div>
              {/* Figma node 34:1043 — mobile swaps the text button for this icon-only chip, same /login destination */}
              <Link href="/login" className={styles.walletIconButton} aria-label="Login or sign up">
                <img src="/assets/img/marketplace/header-wallet-icon.svg" alt="" aria-hidden="true" className={styles.walletIcon} />
              </Link>
            </>
          )}
        </div>

        {/* Figma node 34:1043 — mobile-only search trigger replacing the desktop search bar, which has no room at this width */}
        <button type="button" className={styles.mobileSearchButton} aria-label="Search">
          <img src="/assets/img/marketplace/header-search-chip.svg" alt="" aria-hidden="true" className={styles.mobileSearchIcon} />
        </button>
      </div>
    </header>
  )
}

export default Header
