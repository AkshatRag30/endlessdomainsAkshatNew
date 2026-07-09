import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { BugBountyHero, BugBountyTimeline, BugBountyOnboarding, BugBountyReportingHeader, BugBountyReportingBody, BugBountyWhatsNext, BugBountyFaq } from '@/design-system/composites/bug-bounty'
import styles from './bug-bounty.module.scss'

const BugBountyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bug Bounty Program — Endless Domains</title>
        <meta
          name="description"
          content="Find bugs before anyone else does. Get hands-on access to the Endless Domains staging environment, a guided five-phase path, and rewards up to $500 based on what you uncover."
        />
      </Head>
      <PerksNavBar onGoldClick={() => {}} />
      <main className={styles.main}>
        <BugBountyHero />
        <BugBountyTimeline />
        <BugBountyOnboarding />
        <BugBountyReportingHeader />
        <BugBountyReportingBody />
        <BugBountyWhatsNext />
        <BugBountyFaq />
      </main>
    </>
  )
}

export default BugBountyPage
