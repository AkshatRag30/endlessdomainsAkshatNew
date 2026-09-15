import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/marketplace-preview/stubs/auth'
import { mockSidebarSections } from '@/marketplace-preview/data/marketplace/navigation'
import SidebarSection from '../SidebarSection'
import SidebarPromoCard from '../SidebarPromoCard'
import styles from './MarketplaceSidebar.module.scss'

export interface MarketplaceSidebarProps {
  // TEMPORARY, preview-only — see SidebarNavItem's matching prop for why.
  // Only ever passed from pages/design-preview/marketplace.tsx.
  previewMode?: boolean
}

/**
 * Renders both sidebar groups from static navigation data (Phase 2), plus
 * an auth-aware action under "Your Account": Login/Sign Up when signed out,
 * Logout when signed in — reusing the exact same useAuth()/logout() the
 * header and pages/index.tsx already use, not a new auth entry point.
 */
export const MarketplaceSidebar = ({ previewMode }: MarketplaceSidebarProps) => {
  const { authenticated, logout } = useAuth()
  const [browseSection, accountSection] = mockSidebarSections
  const [previewSelectedId, setPreviewSelectedId] = useState<string | null>(browseSection.items[0]?.id ?? null)

  return (
    <div className={styles.sidebar}>
      <SidebarSection
        section={browseSection}
        previewMode={previewMode}
        selectedId={previewSelectedId}
        onSelectItem={setPreviewSelectedId}
      />

      <SidebarSection
        section={accountSection}
        previewMode={previewMode}
        selectedId={previewSelectedId}
        onSelectItem={setPreviewSelectedId}
      >
        {authenticated ? (
          <button type="button" className={styles.authAction} onClick={logout}>
            Logout
          </button>
        ) : (
          <div className={styles.authLinks}>
            <Link href="/login" className={styles.authAction}>
              Login
            </Link>
            <Link href="/register" className={styles.authAction}>
              Sign Up
            </Link>
          </div>
        )}
      </SidebarSection>

      <SidebarPromoCard />
    </div>
  )
}

export default MarketplaceSidebar
