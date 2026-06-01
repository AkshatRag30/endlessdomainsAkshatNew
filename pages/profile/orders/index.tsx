import React from 'react'

import { DashboardTabBar } from '@/components/userprofile/DashboardTabBar'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import { TopNavBar } from '@/components/userprofile/TopNavBar'
import { OrdersList } from '@/design-system/composites/orders'

import styles from './orders-page.module.scss'

const OrdersPage: React.FC = () => (
  <div className={styles.shell}>
    <TopNavBar
      logoSrc="/user-profile/endlessnewlogo.svg"
      avatarSrc="/user-profile/userpfp.png"
      avatarAlt="User avatar"
    />
    <DashboardTabBar />
    <main className={styles.mainArea}>
      <div className={styles.page}>
        <OrdersList />
      </div>
    </main>
    <SiteFooter />
  </div>
)

export default OrdersPage
