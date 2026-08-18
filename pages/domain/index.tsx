import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { DomainHero, DomainStats, DomainHowItWorks, DomainUnlocks, DomainOwnership, OwnershipComparison, OnchainIdentityNetwork, DomainBrowse, DomainWhy, DomainReviews, DomainFaq } from '@/design-system/composites/domain'
import styles from './domain.module.scss'

const DomainPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Domains — Endless Domains</title>
        <meta
          name="description"
          content="Find, register, and own your permanent on-chain identity across every chain that matters. One identity. No renewals. No expiry."
        />
      </Head>
      <PerksNavBar onGoldClick={() => {}} />
      <main className={styles.main}>
        <DomainHero />
        <DomainStats />
        <DomainHowItWorks />
        <DomainBrowse />
        <DomainUnlocks />
        <OwnershipComparison />
        <OnchainIdentityNetwork />
        <DomainOwnership />
        <DomainWhy />
        <DomainReviews />
        <DomainFaq />
      </main>
    </>
  )
}

export default DomainPage
