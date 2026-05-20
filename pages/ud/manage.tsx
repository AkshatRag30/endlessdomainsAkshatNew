import { useState } from 'react'

import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import { UdDomainDetails } from '@/components/manage-ud/UdDomainDetails'
import { UDSidebar } from '@/components/manage-ud/UDSidebar'
import { UDCrypto } from '@/components/manage-ud/UDCrypto'
import { UDReverseNew } from '@/components/manage-ud/UDReverseNew'
import { UDTransfer } from '@/components/manage-ud/UDTransfer'
import type { UDViewMenu } from '@/components/manage-ud/types'
import ParkedDomains from '@/components/manage-domain/park-domain'
import styles from './manage.module.scss'

// ── Demo data (replace with API call when ready) ───────────────────────────────

const DEMO = {
  fullName: 'myawesomeudomain.crypto',
  owner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  expiry: '2026-12-12',
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ManageUDPage() {
  const [selectedMenu, setSelectedMenu] = useState<UDViewMenu>('crypto')

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
          <UdDomainDetails
            domain={DEMO.fullName}
            owner={DEMO.owner}
            expiry={DEMO.expiry}
          />

          <div className={styles.workspace}>
            <UDSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

            <div className={styles.panel}>
              {selectedMenu === 'crypto'   && <UDCrypto domain={DEMO.fullName} />}
              {selectedMenu === 'reverse'  && <UDReverseNew domain={DEMO.fullName} currentRecord="" />}
              {selectedMenu === 'transfer' && <UDTransfer domain={DEMO.fullName} />}
              {selectedMenu === 'pd'       && (
                <ParkedDomains domain={DEMO.fullName} provider="ud" />
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
