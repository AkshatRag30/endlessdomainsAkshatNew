import React from 'react'
import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import { AiAdvisorHero, AiAdvisorChatPanel } from '@/design-system/composites/ai-advisor'
import styles from './ai-advisor.module.scss'

export default function AiAdvisorPage() {
  return (
    <div className={styles.shell}>
      <TopNavBar
        logoSrc="/user-profile/endlessnewlogo.svg"
        avatarSrc="/user-profile/userpfp.png"
        avatarAlt="User avatar"
      />
      <DashboardTabBar />
      <main className={styles.mainArea}>
        <AiAdvisorHero>
          <AiAdvisorChatPanel />
        </AiAdvisorHero>
      </main>
      <SiteFooter />
    </div>
  )
}
