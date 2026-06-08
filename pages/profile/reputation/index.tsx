import { useState, useCallback, useRef } from 'react'
import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import ReputationTabBar from '@/design-system/composites/reputation/ReputationTabBar'
import AccountSettings from '@/design-system/composites/reputation/account-settings'
import GmStreak from '@/design-system/composites/reputation/gm-streak'
import ScoreBreakdown from '@/design-system/composites/reputation/score-breakdown'
import MyPerks from '@/design-system/composites/reputation/my-perks'
import NoDomainEmptyState from '@/design-system/composites/reputation/no-domain-empty-state'
import TrackingDisabledEmptyState from '@/design-system/composites/reputation/tracking-disabled-empty-state'
import ScoreLoading from '@/design-system/composites/reputation/score-loading'
import type { ReputationTab } from '@/design-system/composites/reputation/ReputationTabBar'
import styles from './reputation.module.scss'

// Toggle these to preview different states:
//   MOCK_HAS_OG_DOMAIN = false                              → "Get a .og domain" screen
//   MOCK_HAS_OG_DOMAIN = true, MOCK_TRACKING_ENABLED = false → "Enable Reputation Tracking" screen
//   Both true, MOCK_SCORE_LOADING = true                    → loading / calculating screen
//   All true                                                → normal tab content
const MOCK_HAS_OG_DOMAIN = true
const MOCK_TRACKING_ENABLED = true
const MOCK_SCORE_LOADING = false

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

          <div className={styles.reputationCard}>

            {/* Section 1 — sub-tab navigation */}
            <div className={styles.tabSection}>
              <ReputationTabBar activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            {/* Section 2 — tab content */}
            <div className={styles.contentSection}>
              {!MOCK_HAS_OG_DOMAIN ? (
                <div className={styles.emptyStateWrap}>
                  <NoDomainEmptyState />
                </div>
              ) : !MOCK_TRACKING_ENABLED ? (
                <div className={styles.emptyStateWrap}>
                  <TrackingDisabledEmptyState onEnableClick={() => setActiveTab('account-settings')} />
                </div>
              ) : MOCK_SCORE_LOADING ? (
                <div className={styles.emptyStateWrap}>
                  <ScoreLoading />
                </div>
              ) : (
                <>
                  {activeTab === 'score-breakdown'  && <ScoreBreakdown />}
                  {activeTab === 'gm-streak'        && <GmStreak />}
                  {activeTab === 'my-perks'         && <MyPerks />}
                  {activeTab === 'account-settings' && <AccountSettings />}
                </>
              )}
            </div>

          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
