import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HiMiniBars3 } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5'
import { MdOutlineShoppingCart } from 'react-icons/md'

import PrimaryButton from '@/design-system/primitives/buttons/primary-button'
import styles from './LandingHeader.module.scss'

// Static replica of the real site's Header — same visual design, but with every
// dynamic piece (auth, cart, wallet, reputation) stripped out, since this project
// exists purely for a design review of the landing page, not a working account flow.
// The Login/Signup and cart buttons are visual only (no click behavior).

const MENU_CLOSE_DURATION = 300
const MENU_OPEN_DELAY = 10

const NAV_LINKS = [
  { name: 'Perks', link: '/perks' },
  { name: 'Marketplace', link: 'https://marketplace.endlessdomains.io/' },
  { name: 'About Us', link: '/about-us' },
  { name: 'Say GM', link: '/saygm' },
]

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [isAtTop, setIsAtTop] = useState(true)
  const lastScrollY = useRef(0)

  const openMenu = useCallback(() => {
    setMenuOpen(true)
    setTimeout(() => setIsAnimating(true), MENU_OPEN_DELAY)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeMenu = useCallback(() => {
    setIsAnimating(false)
    setTimeout(() => {
      setMenuOpen(false)
      document.body.style.overflow = ''
    }, MENU_CLOSE_DURATION)
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) closeMenu()
    }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [menuOpen, closeMenu])

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      setIsAtTop(currentScroll <= 0)
      setIsHeaderVisible(currentScroll <= lastScrollY.current)
      lastScrollY.current = currentScroll
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`${styles.nav} ${isAtTop ? 'position-relative' : isHeaderVisible ? `${styles.is_sticky} ${styles.fadeInDown} ${styles.animated}` : `${styles.is_sticky} ${styles.fadeOutUp} ${styles.animated}`}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link href="/" aria-label="Endless Domains home">
          <Image src="/new-assets/header/endless-without-tagline.svg" alt="Endless Domains" width={180} height={40} className={styles.header_icon} priority />
        </Link>

        <ul className={`${styles.navbar} ${styles.navbar_center}`} role="list">
          {NAV_LINKS.map(item => (
            <li className={styles.nav_item} key={item.name} role="listitem">
              <Link
                href={item.link}
                className={styles.media_link}
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.nav_btns}>
          <span className={styles.desktop_login_btn}>
            <PrimaryButton aria-label="Login or Signup (visual preview only)">
              <span className={styles.cart_login_text}>Login/Signup</span>
              <span className={styles.cart_login_icon} aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </PrimaryButton>
          </span>
          <span className={styles.mobile_menu_btn}>
            <PrimaryButton onClick={openMenu} aria-label="Open navigation menu">
              <HiMiniBars3 size={20} />
            </PrimaryButton>
          </span>
          <PrimaryButton transparent aria-label="Cart (visual preview only)">
            <MdOutlineShoppingCart />
          </PrimaryButton>
        </div>
      </nav>

      {menuOpen && (
        <div className={`${styles.menuOverlay} ${isAnimating ? styles.overlayVisible : ''}`} onClick={closeMenu} aria-hidden="true" />
      )}

      {menuOpen && (
        <aside
          className={`${styles.menuItems_wrapper} ${isAnimating ? styles.menuOpen : styles.menuClose}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className={styles.menuItems_header}>
            <div className={styles.user_info} />
            <button className={styles.close_btn} onClick={closeMenu} aria-label="Close menu">
              <IoClose />
            </button>
          </div>

          <div className={styles.menu_body}>
            <div className={styles.menu_right}>
              <nav className={styles.navigation_bar} aria-label="Site navigation">
                <div className={styles.heading_txt}>
                  <h4>Navigation</h4>
                  <span />
                </div>
                <ul>
                  {NAV_LINKS.map(item => (
                    <li key={item.name}>
                      <Link
                        href={item.link}
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onClick={closeMenu}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className={styles.auth_btn_wrapper}>
                <PrimaryButton onClick={closeMenu}>Login / Signup</PrimaryButton>
              </div>
            </div>
          </div>

          <div className={styles.stripes} aria-hidden="true" />
        </aside>
      )}
    </>
  )
}

export default LandingHeader
