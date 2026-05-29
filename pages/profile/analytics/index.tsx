import React, { useState, useCallback } from 'react'
import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import AnalyticsTabBar from '@/components/user-analytic/AnalyticsTabBar'
import AnalyticsFilterBar from '@/components/user-analytic/AnalyticsFilterBar'
import AnalyticsPDFilterBar from '@/components/user-analytic/AnalyticsPDFilterBar'
import AnalyticsProviderDistribution from '@/components/user-analytic/AnalyticsProviderDistribution'
import AnalyticsPortfolioValue from '@/components/user-analytic/AnalyticsPortfolioValue'
import AnalyticsPortfolioBreakdown from '@/components/user-analytic/AnalyticsPortfolioBreakdown'
import type { AnalyticsTab, AnalyticsFilterState, PDFilterState } from '@/components/user-analytic/mockAnalyticsData'
import { DEFAULT_FILTER_STATE, DEFAULT_PD_FILTER_STATE } from '@/components/user-analytic/mockAnalyticsData'
import styles from './analytics.module.scss'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('provider-distribution')
  const [pdFilterState, setPdFilterState] = useState<PDFilterState>(DEFAULT_PD_FILTER_STATE)
  const [pbFilterState, setPbFilterState] = useState<AnalyticsFilterState>(DEFAULT_FILTER_STATE)

  const handleTabChange = useCallback((tab: AnalyticsTab) => setActiveTab(tab), [])

  const handlePdFilterChange = useCallback((state: PDFilterState) => setPdFilterState(state), [])
  const handlePbFilterChange = useCallback((state: AnalyticsFilterState) => setPbFilterState(state), [])

  return (
    <div className={styles.shell}>
      <TopNavBar
        logoSrc="/user-profile/endlessnewlogo.svg"
        avatarSrc="/user-profile/userpfp.png"
        avatarAlt="User avatar"
      />
      <DashboardTabBar />
      <main className={styles.mainArea}>
        <div className={styles.page}>
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Portfolio Analytics</h1>
            <p className={styles.pageSubtitle}>Track your domain portfolio performance and order history</p>
          </header>
          <div className={styles.analyticsCard}>

            {/* Section 1 — sub-tab navigation */}
            <div className={styles.tabSection}>
              <AnalyticsTabBar activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            {/* Section 2 — filter bar */}
            <div className={styles.filterSection}>
              {activeTab === 'provider-distribution' && (
                <AnalyticsPDFilterBar value={pdFilterState} onChange={handlePdFilterChange} />
              )}
              {activeTab === 'portfolio-breakdown' && (
                <AnalyticsFilterBar value={pbFilterState} onChange={handlePbFilterChange} />
              )}
              {activeTab === 'portfolio-value' && (
                <AnalyticsPDFilterBar value={pdFilterState} onChange={handlePdFilterChange} />
              )}
            </div>

            {/* Section 3 — main content */}
            <div className={styles.contentSection}>
              {activeTab === 'provider-distribution' && (
                <AnalyticsProviderDistribution filterState={pdFilterState} />
              )}
              {activeTab === 'portfolio-value' && <AnalyticsPortfolioValue filterState={pdFilterState} />}
              {activeTab === 'portfolio-breakdown' && (
                <AnalyticsPortfolioBreakdown filterState={pbFilterState} onFilterChange={handlePbFilterChange} />
              )}
            </div>

          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
