import React from 'react'
import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { ProfileHeader } from '@/components/userprofile/ProfileHeader'
import { AccountSection } from '@/components/userprofile/AccountSection'
import { WalletSection } from '@/components/userprofile/WalletSection'
import { ChangePasswordSection } from '@/components/userprofile/ChangePasswordSection'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import styles from './UserProfilePage.module.scss'

export const UserProfilePage: React.FC = () => (
  <div className={styles.page}>
    <TopNavBar
      logoSrc="/user-profile/endlessnewlogo.svg"
      avatarSrc="/user-profile/userpfp.png"
      avatarAlt="User avatar"
    />

    <DashboardTabBar activeTab="profile" />

    <main className={styles.main}>
      <div className={styles.content}>
        <ProfileHeader
          avatarSrc="/user-profile/monkeypfp.png"
          avatarAlt="jayendless"
        />

        <div className={styles.sections}>
          <AccountSection />
          <WalletSection />
          <ChangePasswordSection />
          <div className={styles.saveActions}>
            <PrimaryButton onClick={() => {}} className={styles.saveBtn}>Save Changes</PrimaryButton>
          </div>
        </div>
      </div>
    </main>

    <SiteFooter />
  </div>
)

export default UserProfilePage
