import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import {
  DomainIdentityOS,
  OwnershipComparison,
  OnchainIdentityNetwork,
  DomainOnchainStats,
  DomainAdoptionGap,
  DomainGrowthComparison,
  DomainLivingIdentity,
  HowItWorksJourney,
  DomainRoadmap,
  DomainBlogTeaser,
} from '@/design-system/composites/domain'
import styles from './identity-os.module.scss'

const IdentityOsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Identity OS — Endless Domains</title>
        <meta
          name="description"
          content="Identity OS goes beyond ownership — reputation, on-chain identity networks, and everything your permanent domain unlocks."
        />
      </Head>
      <PerksNavBar onGoldClick={() => {}} />
      <main className={styles.main}>
        <DomainIdentityOS />
        <OwnershipComparison />
        <OnchainIdentityNetwork />
        <DomainOnchainStats />
        <DomainAdoptionGap />
        <DomainGrowthComparison />
        <DomainLivingIdentity />
        <HowItWorksJourney />
        <DomainRoadmap />
        <DomainBlogTeaser />
      </main>
    </>
  )
}

export default IdentityOsPage
