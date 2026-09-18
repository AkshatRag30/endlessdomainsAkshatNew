import React, { useEffect } from 'react'
import styles from './MarketplacePageShell.module.scss'

export interface MarketplacePageShellProps {
  sidebar: React.ReactNode
  hero: React.ReactNode
  rightRail: React.ReactNode
  children: React.ReactNode // main column content, below the hero
  // Controlled by the page, since the toggle button itself now lives in
  // Header (see HeaderProps.onMenuClick) rather than floating in this shell.
  sidebarOpen: boolean
  onCloseSidebar: () => void
}

/**
 * Responsive grid: sidebar / main / right rail on desktop. Below 992px there
 * is no persistent sidebar column — sidebar becomes an off-canvas drawer
 * (opened via Header's menu toggle) and hero/rail/main restack in Figma's
 * mobile and tablet order (nodes 20:1153 / 27:531): hero, then rail
 * (Live Activity + Market Activity), then the rest of main. Pure layout, no
 * data of its own.
 */
export const MarketplacePageShell = ({ sidebar, hero, rightRail, children, sidebarOpen, onCloseSidebar }: MarketplacePageShellProps) => {
  const sidebarClass = [styles.sidebar, sidebarOpen ? styles.sidebarOpen : ''].filter(Boolean).join(' ')

  // The drawer is a fixed-position overlay, not a modal that replaces the
  // page — the page underneath is still the normal scrollable document, so
  // without this it keeps scrolling behind the drawer while it's open,
  // which reads as broken (the drawer appears to float/jump against
  // content moving behind it). `overflow: hidden` alone was the first pass
  // here, and it's enough on desktop, but real bug on iOS Safari: it does
  // NOT block touch-drag scroll/rubber-banding on the body at all, only
  // mouse-wheel and keyboard scrolling — the exact case that matters for a
  // mobile hamburger menu. Pinning the body at its current scroll offset
  // via position: fixed is the standard workaround that actually holds on
  // iOS. Scroll position and every overridden style are restored on close
  // and on unmount so it can never get stuck locked or jump to the top if
  // this component goes away while still open.
  useEffect(() => {
    if (!sidebarOpen) return
    const { body } = document
    const scrollY = window.scrollY
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    }
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    return () => {
      body.style.overflow = previous.overflow
      body.style.position = previous.position
      body.style.top = previous.top
      body.style.width = previous.width
      window.scrollTo(0, scrollY)
    }
  }, [sidebarOpen])

  return (
    <div className={styles.shell}>
      <div className={styles.grid}>
        <aside className={sidebarClass}>{sidebar}</aside>
        <div className={styles.hero}>{hero}</div>
        <aside className={styles.rightRail}>{rightRail}</aside>
        <main className={styles.main}>{children}</main>
      </div>

      {sidebarOpen && <div className={styles.scrim} onClick={onCloseSidebar} aria-hidden="true" />}
    </div>
  )
}

export default MarketplacePageShell
