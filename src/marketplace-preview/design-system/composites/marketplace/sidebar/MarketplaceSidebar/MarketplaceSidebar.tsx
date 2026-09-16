import React, { useState } from 'react'
import { useAuth } from '@/marketplace-preview/stubs/auth'
import { mockSidebarSections } from '@/marketplace-preview/data/marketplace/navigation'
import SidebarSection from '../SidebarSection'
import SidebarPromoCard from '../SidebarPromoCard'
import styles from './MarketplaceSidebar.module.scss'

export interface MarketplaceSidebarProps {
  // TEMPORARY, preview-only — see SidebarNavItem's matching prop for why.
  // Only ever passed from pages/design-preview/*.
  previewMode?: boolean
  // TEMPORARY, preview-only. Which nav item starts selected in preview mode
  // — defaults to the first Browse item (the marketplace preview's existing
  // behavior) when omitted, so that page's usage is unaffected. The My
  // Domains preview passes 'my-domains' here instead, since its real route
  // (see mockSidebarSections) doesn't match its own /design-preview/* URL,
  // so the pathname-based `active` check in SidebarSection never fires.
  initialSelectedId?: string
}

/**
 * Renders both sidebar groups from static navigation data (Phase 2), plus
 * a Logout action under "Your Account" when signed in — reusing the exact
 * same useAuth()/logout() the header already uses, not a new auth entry
 * point. Login/Sign Up used to live here too when signed out; they now live
 * inside the header's connect-wallet button instead (see Header/index.tsx),
 * so there's nothing rendered in this slot for a signed-out visitor.
 */
export const MarketplaceSidebar = ({ previewMode, initialSelectedId }: MarketplaceSidebarProps) => {
  const { authenticated, logout } = useAuth()
  const [browseSection, accountSection] = mockSidebarSections
  const [previewSelectedId, setPreviewSelectedId] = useState<string | null>(initialSelectedId ?? browseSection.items[0]?.id ?? null)

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
        {authenticated && (
          <button type="button" className={styles.authAction} onClick={logout}>
            Logout
          </button>
        )}
      </SidebarSection>

      <SidebarPromoCard />
    </div>
  )
}

export default MarketplaceSidebar
