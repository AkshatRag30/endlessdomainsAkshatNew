import { TbFileText, TbCurrencyBitcoin } from 'react-icons/tb'
import { GoArrowSwitch } from 'react-icons/go'

import type { FreenameViewMenu } from './types'
import styles from './FreenameSidebar.module.scss'

interface FreenameSidebarProps {
  selectedMenu: FreenameViewMenu
  setSelectedMenu: (menu: FreenameViewMenu) => void
}

const NAV_ITEMS: { key: FreenameViewMenu; label: string; icon: React.ReactNode }[] = [
  { key: 'records',  label: 'Records',  icon: <TbFileText size={18} aria-hidden="true" /> },
  { key: 'token',    label: 'Token',    icon: <TbCurrencyBitcoin size={18} aria-hidden="true" /> },
  { key: 'transfer', label: 'Transfer', icon: <GoArrowSwitch size={18} aria-hidden="true" /> },
]

export function FreenameSidebar({ selectedMenu, setSelectedMenu }: FreenameSidebarProps) {
  return (
    <nav className={styles.sidebar} aria-label="Domain management sections">
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

export default FreenameSidebar
