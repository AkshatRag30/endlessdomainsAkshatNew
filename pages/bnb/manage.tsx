import { useState } from 'react'

import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import { BNBDomainDetails } from '@/components/manage-bnb/BNBDomainDetails'
import { BNBSidebar } from '@/components/manage-bnb/BNBSidebar'
import { BNBReverseNew } from '@/components/manage-bnb/BNBReverseNew'
import { BNBTransfer } from '@/components/manage-bnb/BNBTransfer'
import type { BNBViewMenu } from '@/components/manage-bnb/types'
import ParkedDomains from '@/components/manage-domain/park-domain'
import styles from './manage.module.scss'

// ── Demo data (replace with router.query.domain + on-chain reads when ready) ──

const DEMO = {
  fullName: 'myawesomebnb.bnb',
  owner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  expiry: '2028-03-15',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ManageBNBPage() {
  const [selectedMenu, setSelectedMenu] = useState<BNBViewMenu>('reverse')

  return (
    <div className={styles.shell}>
      <TopNavBar
        logoSrc="/user-profile/endlessnewlogo.svg"
        avatarSrc="/user-profile/userpfp.png"
        avatarAlt="User avatar"
      />
      <DashboardTabBar />

      <main className={styles.main}>
        <div className={styles.page}>
          <BNBDomainDetails
            domain={DEMO.fullName}
            owner={DEMO.owner}
            expiry={DEMO.expiry}
          />

          <div className={styles.workspace}>
            <BNBSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

            <div className={styles.panel}>
              <div className={selectedMenu !== 'reverse'  ? styles.panelHidden : undefined}><BNBReverseNew domain={DEMO.fullName} currentRecord="" /></div>
              <div className={selectedMenu !== 'transfer' ? styles.panelHidden : undefined}><BNBTransfer domain={DEMO.fullName} /></div>
              <div className={selectedMenu !== 'pd'       ? styles.panelHidden : undefined}><ParkedDomains domain={DEMO.fullName} provider="bnb" /></div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
