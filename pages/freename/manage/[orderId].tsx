import { useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import { FreenameDomainDetails } from '@/components/manage-freename/FreenameDomainDetails'
import { FreenameSidebar } from '@/components/manage-freename/FreenameSidebar'
import { FreenameRecords } from '@/components/manage-freename/FreenameRecords'
import { FreenameToken } from '@/components/manage-freename/FreenameToken'
import { FreenameTransfer } from '@/components/manage-freename/FreenameTransfer'
import type { FreenameViewMenu } from '@/components/manage-freename/types'
import styles from './manage.module.scss'

// ── Demo data ─────────────────────────────────────────────────────────────────
// Replace this object by calling fetchDomainRecords(orderId) in a useEffect
// and mapping the API response to FreenameDomainData (see types.ts).
// The orderId comes from router.query.orderId (already resolved below).

const DEMO = {
  fullName: 'myawesomesite.x',
  orderId: 'FN-7A3C8D912E',
  status: 'active',
  registrationDate: '2024-01-15',
}

// ── Page ──────────────────────────────────────────────────────────────────────

function FreenameManagePage() {
  const router = useRouter()

  const orderIdParam = router.query.orderId
  // orderId is available for future API integration — pass to child components as needed
  const orderId = Array.isArray(orderIdParam) ? orderIdParam[0] : (orderIdParam ?? DEMO.orderId)

  const [selectedMenu, setSelectedMenu] = useState<FreenameViewMenu>('records')

  if (!router.isReady) return null

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
          <FreenameDomainDetails
            domain={DEMO.fullName}
            orderId={orderId}
            status={DEMO.status}
          />

          <div className={styles.workspace}>
            <FreenameSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

            <div className={styles.panel}>
              {selectedMenu === 'records'  && <FreenameRecords  orderId={orderId} />}
              {selectedMenu === 'token'    && <FreenameToken    domain={DEMO.fullName} />}
              {selectedMenu === 'transfer' && <FreenameTransfer domain={DEMO.fullName} />}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default dynamic(() => Promise.resolve(FreenameManagePage), { ssr: false })
