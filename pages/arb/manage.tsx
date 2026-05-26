import { useState } from 'react'

import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import { ARBDomainDetails } from '@/components/manage-arb/ARBDomainDetails'
import { ARBSidebar } from '@/components/manage-arb/ARBSidebar'
import { ARBReverseNew } from '@/components/manage-arb/ARBReverseNew'
import { ARBTransfer } from '@/components/manage-arb/ARBTransfer'
import type { ARBViewMenu } from '@/components/manage-arb/types'
import ParkedDomains from '@/components/manage-domain/park-domain'
import styles from './manage.module.scss'

// ── Demo data (replace with router.query.domain + on-chain reads when ready) ──

const DEMO = {
  fullName: 'myawesomearb.arb',
  owner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  expiry: '2028-03-15',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ManageARBPage() {
  const [selectedMenu, setSelectedMenu] = useState<ARBViewMenu>('reverse')

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
          <ARBDomainDetails
            domain={DEMO.fullName}
            owner={DEMO.owner}
            expiry={DEMO.expiry}
          />

          <div className={styles.workspace}>
            <ARBSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

            <div className={styles.panel}>
              {selectedMenu === 'reverse'  && <ARBReverseNew domain={DEMO.fullName} currentRecord="" />}
              {selectedMenu === 'transfer' && <ARBTransfer domain={DEMO.fullName} />}
              {selectedMenu === 'pd'       && <ParkedDomains domain={DEMO.fullName} provider="arb" />}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
