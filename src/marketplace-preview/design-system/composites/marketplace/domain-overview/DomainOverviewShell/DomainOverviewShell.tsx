import React, { useState } from 'react'
import Header from '@/marketplace-preview/design-system/layouts/header'
import MarketplaceSidebar from '../../sidebar/MarketplaceSidebar'
import MobileDrawerMenu from '../../sidebar/MobileDrawerMenu'
import MobileBottomNav from '../../shared/MobileBottomNav'
import layoutStyles from '@/marketplace-preview/design-system/layouts/main-layout/MainLayout.module.scss'
import styles from './DomainOverviewShell.module.scss'

export interface DomainOverviewShellProps {
  /** Pinned to the top-left of the main column, above the centred content. */
  breadcrumb: React.ReactNode
  children: React.ReactNode
  /**
   * Figma centres the overview content in a 1035px column (5:3586) but draws
   * the order receipt 1156px wide and left aligned with the breadcrumb
   * (5:7454) — followed per page for now (plan §2.7 Q12, O3).
   */
  contentLayout?: 'centered' | 'wide'
}

/**
 * Page frame shared by the domain overview and order receipt routes: the
 * same Header / sidebar / drawer / MobileBottomNav assembly as
 * pages/design-preview/marketplace.tsx, without its hero, right rail or live
 * ticker, none of which these Figma frames have (plan §2).
 */
export const DomainOverviewShell = ({ breadcrumb, children, contentLayout = 'centered' }: DomainOverviewShellProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const sidebarClass = [layoutStyles.sidebar, menuOpen ? layoutStyles.sidebarOpen : ''].filter(Boolean).join(' ')
  const contentClass = [styles.content, contentLayout === 'wide' ? styles.contentWide : ''].filter(Boolean).join(' ')

  return (
    // data-marketplace-preview: this project scopes the preview's tokens to
    // that attribute (see styles/tokens.scss), like the marketplace page.
    <div data-marketplace-preview>
      {/* Site chrome is dropped when printing (the receipt's "Download receipt"). */}
      <div className={styles.noPrint}>
        <Header onMenuClick={() => setMenuOpen((prev) => !prev)} menuOpen={menuOpen} previewMode />
      </div>

      <div className={layoutStyles.body}>
        <aside className={`${sidebarClass} ${styles.noPrint}`} data-lenis-prevent>
          <MarketplaceSidebar previewMode />
          <MobileDrawerMenu onClose={() => setMenuOpen(false)} previewMode />
        </aside>

        <main className={`${layoutStyles.main} ${styles.main}`}>
          <div className={`${styles.breadcrumb} ${styles.noPrint}`}>{breadcrumb}</div>
          <div className={contentClass}>{children}</div>
          <div className={styles.noPrint}>
            <MobileBottomNav />
          </div>
        </main>
      </div>

      {menuOpen && <div className={layoutStyles.scrim} onClick={() => setMenuOpen(false)} aria-hidden="true" />}
    </div>
  )
}

export default DomainOverviewShell
