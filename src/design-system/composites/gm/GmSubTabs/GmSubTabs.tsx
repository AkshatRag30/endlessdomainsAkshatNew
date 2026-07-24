import Link from 'next/link'
import { FiSun, FiBox } from 'react-icons/fi'
import { HiOutlineRocketLaunch } from 'react-icons/hi2'
import styles from './GmSubTabs.module.scss'

export type GmSubTabKey = 'gm' | 'create-nft' | 'deploy-contract'

interface GmSubTab {
  key: GmSubTabKey
  label: string
  href: string
  icon: React.ReactNode
}

const SUB_TABS: GmSubTab[] = [
  { key: 'gm',               label: 'Say Gm',          href: '/gm',                  icon: <FiSun aria-hidden="true" /> },
  { key: 'create-nft',       label: 'Create NFT',      href: '/gm/create-nft',       icon: <FiBox aria-hidden="true" /> },
  { key: 'deploy-contract',  label: 'Deploy Contract', href: '/gm/deploy-contract',  icon: <HiOutlineRocketLaunch aria-hidden="true" /> },
]

interface GmSubTabsProps {
  activeTab: GmSubTabKey
}

export function GmSubTabs({ activeTab }: GmSubTabsProps) {
  return (
    <nav className={styles.subTabs} aria-label="GM sections">
      <ul className={styles.list} role="tablist">
        {SUB_TABS.map(tab => (
          <li key={tab.key} role="presentation" className={styles.item}>
            <Link
              href={tab.href}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            >
              <span className={styles.icon}>{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default GmSubTabs
