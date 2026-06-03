import { useState, useCallback, useRef } from 'react'
import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import ReputationTabBar from '@/design-system/composites/reputation/ReputationTabBar'
import AccountSettings from '@/design-system/composites/reputation/account-settings'
import GmStreak from '@/design-system/composites/reputation/gm-streak'
import ScoreBreakdown from '@/design-system/composites/reputation/score-breakdown'
import MyPerks from '@/design-system/composites/reputation/my-perks'
import type { ReputationTab } from '@/design-system/composites/reputation/ReputationTabBar'
import styles from './reputation.module.scss'

export default function ReputationPage() {
  const [activeTab, setActiveTab] = useState<ReputationTab>('score-breakdown')
  const sectionRef = useRef<HTMLElement>(null)

  const handleTabChange = useCallback((tab: ReputationTab) => setActiveTab(tab), [])

  return (
    <div className={styles.shell}>
      <TopNavBar
        logoSrc="/user-profile/endlessnewlogo.svg"
        avatarSrc="/user-profile/userpfp.png"
        avatarAlt="User avatar"
      />
      <DashboardTabBar />
      <main className={styles.mainArea} ref={sectionRef}>
        <div className={styles.page}>
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Reputation</h1>
            <p className={styles.pageSubtitle}>Track your on-chain reputation score, streaks, and identity settings</p>
          </header>

          <div className={styles.reputationCard}>

            {/* Section 1 — sub-tab navigation */}
            <div className={styles.tabSection}>
              <ReputationTabBar activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            {/* Section 2 — tab content */}
            <div className={styles.contentSection}>
              {activeTab === 'score-breakdown' && <ScoreBreakdown />}
              {activeTab === 'gm-streak'       && <GmStreak sectionRef={sectionRef} />}
              {activeTab === 'my-perks'        && <MyPerks />}
              {activeTab === 'account-settings' && <AccountSettings />}
            </div>

          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
