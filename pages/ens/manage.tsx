import { useState } from 'react'

import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import { ENSDomainDetails } from '@/components/manage-ens/ENSDomainDetails'
import { ENSSidebar } from '@/components/manage-ens/ENSSidebar'
import { ENSReverseNew } from '@/components/manage-ens/ENSReverseNew'
import { ENSTransfer } from '@/components/manage-ens/ENSTransfer'
import { ENSCrypto } from '@/components/manage-ens/ENSCrypto'
import { ENSProfile } from '@/components/manage-ens/ENSProfile'
import type { ENSViewMenu } from '@/components/manage-ens/types'
import ParkedDomains from '@/components/manage-domain/park-domain'
import styles from './manage.module.scss'

// ── Demo data (replace with router.query.domain + on-chain reads when ready) ──

const DEMO = {
  fullName: 'myawesomeens.eth',
  owner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  expiry: '2028-03-15',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ManageENSPage() {
  const [selectedMenu, setSelectedMenu] = useState<ENSViewMenu>('profile')

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
          <ENSDomainDetails
            domain={DEMO.fullName}
            owner={DEMO.owner}
            expiry={DEMO.expiry}
          />

          <div className={styles.workspace}>
            <ENSSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

            <div className={styles.panel}>
              <div className={selectedMenu !== 'profile'  ? styles.panelHidden : undefined}><ENSProfile  domain={DEMO.fullName} /></div>
              <div className={selectedMenu !== 'reverse'  ? styles.panelHidden : undefined}><ENSReverseNew domain={DEMO.fullName} currentRecord="" /></div>
              <div className={selectedMenu !== 'crypto'   ? styles.panelHidden : undefined}><ENSCrypto   domain={DEMO.fullName} /></div>
              <div className={selectedMenu !== 'transfer' ? styles.panelHidden : undefined}><ENSTransfer domain={DEMO.fullName} /></div>
              <div className={selectedMenu !== 'pd'       ? styles.panelHidden : undefined}><ParkedDomains domain={DEMO.fullName} provider="ens" /></div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
