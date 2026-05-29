import React from 'react'
import styles from './Analytics.module.scss'
import type { AnalyticsTab } from './mockAnalyticsData'

const TABS: { id: AnalyticsTab; label: string }[] = [
  { id: 'provider-distribution', label: 'Provider Distribution' },
  { id: 'portfolio-value', label: 'Portfolio Value' },
  { id: 'portfolio-breakdown', label: 'Portfolio Breakdown' },
]

interface Props {
  activeTab: AnalyticsTab
  onTabChange: (tab: AnalyticsTab) => void
}

const AnalyticsTabBar: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <nav className={styles.subTabBar} aria-label="Analytics sections">
    {TABS.map((tab, index) =>
      // TypeScript 5.2 + @types/react 18.3: key on Fragment must use React.createElement
      React.createElement(
        React.Fragment,
        { key: tab.id },
        index > 0 && <span className={styles.subTabSep} aria-hidden="true" />,
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`${styles.subTab} ${activeTab === tab.id ? styles.subTab_active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span>{tab.label}</span>
        </button>,
      ),
    )}
  </nav>
)

export default AnalyticsTabBar
