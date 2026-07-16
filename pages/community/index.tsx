import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { CommunityHero, CommunityDifferent, CommunityGather, CommunityDivider, CommunityAmbassador, CommunitySpotlight, CommunityCta } from '@/design-system/composites/community'
import styles from './community.module.scss'

const CommunityPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Community — Endless Domains</title>
        <meta
          name="description"
          content="Endless Domains is built by its community. Join thousands of builders, creators, and contributors shaping the future of onchain identity together."
        />
      </Head>
      <PerksNavBar onGoldClick={() => {}} />
      <main className={styles.main}>
        <CommunityHero />
        <CommunityDifferent />
        <CommunityGather />
        <CommunityDivider hideOnMobile />
        <CommunityAmbassador />
        <CommunityDivider rotate hideOnMobile />
        <CommunitySpotlight />
        <CommunityCta />
      </main>
    </>
  )
}

export default CommunityPage
