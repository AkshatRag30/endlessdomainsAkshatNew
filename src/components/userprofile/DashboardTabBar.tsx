import React, { useState } from 'react'
import { PiChartBar, PiGlobeSimple, PiShoppingCart, PiUsers } from 'react-icons/pi'
import { FiUser } from 'react-icons/fi'
import { TabButton } from '@/design-system/primitives/button/TabButton'
import styles from './DashboardTabBar.module.scss'

const TABS = [
  { id: 'profile', label: 'User Profile', icon: <FiUser size={16} aria-hidden="true" /> },
  { id: 'domains', label: 'My Domains', icon: <PiGlobeSimple size={22} aria-hidden="true" /> },
  { id: 'orders', label: 'My Order', icon: <PiShoppingCart size={22} aria-hidden="true" /> },
  { id: 'analytics', label: 'Analytics', icon: <PiChartBar size={22} aria-hidden="true" /> },
  { id: 'reputation', label: 'Reputation', icon: <PiUsers size={22} aria-hidden="true" /> },
]

export interface DashboardTabBarProps {
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

export const DashboardTabBar: React.FC<DashboardTabBarProps> = ({
  activeTab = 'profile',
  onTabChange,
}) => {
  const [active, setActive] = useState(activeTab)

  const handleClick = (id: string) => {
    setActive(id)
    onTabChange?.(id)
  }

  return (
    <nav className={styles.tabBar} aria-label="Dashboard navigation">
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <TabButton
            key={tab.id}
            label={tab.label}
            icon={tab.icon}
            isActive={active === tab.id}
            onClick={() => handleClick(tab.id)}
          />
        ))}
      </div>
    </nav>
  )
}

export default DashboardTabBar
