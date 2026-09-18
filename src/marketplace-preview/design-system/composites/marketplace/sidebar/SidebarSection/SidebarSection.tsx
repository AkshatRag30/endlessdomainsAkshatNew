import React from 'react'
import { useRouter } from 'next/router'
import type { SidebarSection as SidebarSectionData } from '@/marketplace-preview/types/marketplace'
import SidebarNavItem from '../SidebarNavItem'
import styles from './SidebarSection.module.scss'

export interface SidebarSectionProps {
  section: SidebarSectionData
  /** Extra rows rendered after the data-driven items, e.g. the auth action. */
  children?: React.ReactNode
  // TEMPORARY, preview-only — threaded through to each SidebarNavItem, see
  // its matching prop for why.
  previewMode?: boolean
  selectedId?: string | null
  onSelectItem?: (id: string) => void
}

export const SidebarSection = ({ section, children, previewMode, selectedId, onSelectItem }: SidebarSectionProps) => {
  const { pathname } = useRouter()

  return (
    <div className={styles.section}>
      <p className={styles.title}>{section.title}</p>
      <nav className={styles.list}>
        {section.items.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            active={previewMode ? item.id === selectedId : !item.isPlaceholder && pathname === item.href}
            previewMode={previewMode}
            onSelect={() => onSelectItem?.(item.id)}
          />
        ))}
        {children}
      </nav>
    </div>
  )
}

export default SidebarSection
