import React from 'react'
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
