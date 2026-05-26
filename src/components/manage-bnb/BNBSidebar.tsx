import { BsArrowRepeat } from 'react-icons/bs'
import { GoArrowSwitch } from 'react-icons/go'
import { TbWorld } from 'react-icons/tb'

import type { BNBViewMenu } from './types'
import styles from './BNBSidebar.module.scss'

interface BNBSidebarProps {
  selectedMenu: BNBViewMenu
  setSelectedMenu: (menu: BNBViewMenu) => void
}

const NAV_ITEMS: { key: BNBViewMenu; label: string; icon: React.ReactNode }[] = [
  { key: 'reverse',  label: 'Reverse',        icon: <BsArrowRepeat size={18} aria-hidden="true" /> },
  { key: 'transfer', label: 'Transfer',        icon: <GoArrowSwitch size={18} aria-hidden="true" /> },
  { key: 'pd',       label: 'Parked Domains',  icon: <TbWorld size={18} aria-hidden="true" /> },
]

export function BNBSidebar({ selectedMenu, setSelectedMenu }: BNBSidebarProps) {
  return (
    <nav className={styles.sidebar} aria-label="Domain management sections">
      {/* Mobile: horizontal no-scroll grid */}
      <div className={styles.mobileNav} role="list">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            role="listitem"
            type="button"
            className={[styles.navItem, selectedMenu === item.key ? styles.navItemActive : ''].filter(Boolean).join(' ')}
            onClick={() => setSelectedMenu(item.key)}
            aria-current={selectedMenu === item.key ? 'page' : undefined}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Desktop: vertical sidebar */}
      <div className={styles.desktopNav} role="list">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            role="listitem"
            type="button"
            className={[styles.navItem, selectedMenu === item.key ? styles.navItemActive : ''].filter(Boolean).join(' ')}
            onClick={() => setSelectedMenu(item.key)}
            aria-current={selectedMenu === item.key ? 'page' : undefined}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default BNBSidebar
