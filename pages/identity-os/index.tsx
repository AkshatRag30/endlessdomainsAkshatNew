import type { NextPage } from 'next'
import Head from 'next/head'
import {
  IdentityOsHero,
  IdentityOsProvidersStats,
  DomainIdentityOS,
  OwnershipComparison,
  OwnershipComparisonMobile,
  OnchainIdentityNetwork,
  OnchainIdentityNetworkMobile,
  DomainOnchainStats,
  DomainAdoptionGap,
  DomainGrowthComparison,
  DomainLivingIdentity,
  HowItWorksJourney,
  DomainRoadmap,
  IdentityOsStatsAndPartners,
  DomainBlogTeaser,
  LandingFaq,
} from '@/design-system/composites/domain'
import { LandingHeader } from '@/design-system/layouts/landingHeader/LandingHeader'
import { LandingFooter } from '@/design-system/layouts/landingFooter/LandingFooter'
import { LANDING_BLOG_POSTS } from '@/data/landingBlogSummary'
import styles from './identity-os.module.scss'

// Static replica of the real site's homepage, for a design review copy on its own
// Vercel deployment. Every section here matches the live landing page's current
// content and behavior — the only things stripped out are auth/cart/wallet wiring
// (this page needs none of it) and the blog teaser's live Ghost fetch, which is now
// a baked-in content snapshot (see src/data/landingBlogSummary.ts) since this project
// has no Ghost credentials of its own.

const IdentityOsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Own Your Web3 Digital Identity — Endless Domains</title>
        <meta
          name="description"
          content="Secure your Web3 digital identity for just $2. No renewals, no subscriptions. Manage, trade, and build your decentralized identity with Endless Domains."
        />
      </Head>
      <LandingHeader />
      <main className={styles.main}>
        <IdentityOsHero />
        <IdentityOsProvidersStats />
        <DomainIdentityOS />
        <OwnershipComparison />
        <OwnershipComparisonMobile />
        <OnchainIdentityNetwork />
        <OnchainIdentityNetworkMobile />
        <DomainOnchainStats />
        <DomainAdoptionGap />
        <DomainGrowthComparison />
        <DomainLivingIdentity />
        <HowItWorksJourney />
        <DomainRoadmap />
        <IdentityOsStatsAndPartners />
        <DomainBlogTeaser posts={LANDING_BLOG_POSTS} />
        <LandingFaq />
      </main>
      <LandingFooter />
    </>
  )
}

export default IdentityOsPage
