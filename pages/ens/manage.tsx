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
              {selectedMenu === 'profile'  && <ENSProfile  domain={DEMO.fullName} />}
              {selectedMenu === 'reverse'  && <ENSReverseNew domain={DEMO.fullName} currentRecord="" />}
              {selectedMenu === 'crypto'   && <ENSCrypto   domain={DEMO.fullName} />}
              {selectedMenu === 'transfer' && <ENSTransfer domain={DEMO.fullName} />}
              {selectedMenu === 'pd'       && <ParkedDomains domain={DEMO.fullName} provider="ens" />}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
