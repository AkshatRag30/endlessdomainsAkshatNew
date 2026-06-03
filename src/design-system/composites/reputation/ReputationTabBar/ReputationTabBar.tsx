import React from 'react'
import styles from './ReputationTabBar.module.scss'

export type ReputationTab = 'score-breakdown' | 'gm-streak' | 'my-perks' | 'account-settings'

const TABS: { id: ReputationTab; label: string }[] = [
  { id: 'score-breakdown',   label: 'Score & Breakdown' },
  { id: 'gm-streak',         label: 'GM Streak & History' },
  { id: 'my-perks',          label: 'My Perks' },
  { id: 'account-settings',  label: 'Account Settings' },
]

interface Props {
  activeTab: ReputationTab
  onTabChange: (tab: ReputationTab) => void
}

const ReputationTabBar: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <nav className={styles.tabBar} aria-label="Reputation sections">
    {TABS.map(tab => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={activeTab === tab.id}
        className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
        onClick={() => onTabChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </nav>
)

export default ReputationTabBar
