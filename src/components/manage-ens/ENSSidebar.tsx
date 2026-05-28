import { AiOutlineUser } from 'react-icons/ai'
import { BsArrowRepeat } from 'react-icons/bs'
import { GoArrowSwitch } from 'react-icons/go'
import { TbWorld } from 'react-icons/tb'
import { RiCopperCoinLine } from 'react-icons/ri'

import type { ENSViewMenu } from './types'
import styles from './ENSSidebar.module.scss'

interface ENSSidebarProps {
  selectedMenu: ENSViewMenu
  setSelectedMenu: (menu: ENSViewMenu) => void
}

const NAV_ITEMS: { key: ENSViewMenu; label: string; icon: React.ReactNode }[] = [
  { key: 'profile',  label: 'Profile',        icon: <AiOutlineUser size={18} aria-hidden="true" /> },
  { key: 'reverse',  label: 'Reverse',         icon: <BsArrowRepeat size={18} aria-hidden="true" /> },
  { key: 'crypto',   label: 'Add Currency',     icon: <RiCopperCoinLine size={18} aria-hidden="true" /> },
  { key: 'transfer', label: 'Transfer',        icon: <GoArrowSwitch size={18} aria-hidden="true" /> },
  { key: 'pd',       label: 'Parked Domains',  icon: <TbWorld size={18} aria-hidden="true" /> },
]

export function ENSSidebar({ selectedMenu, setSelectedMenu }: ENSSidebarProps) {
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

export default ENSSidebar
