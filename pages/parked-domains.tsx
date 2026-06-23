import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { ParkedHero, ParkedStats, ParkedConcept, ParkedRoadmap, ParkedTemplates, ParkedWhy, ParkedFaq } from '@/design-system/composites/parked-domains'

const ParkedDomainsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Parked Domains — Endless Domains</title>
        <meta
          name="description"
          content="Park your idle Web3 domains and earn passive revenue. Link .crypto, .x, .wallet domains to our ad network via IPFS. No developer needed. No annual fees."
        />
      </Head>
      <PerksNavBar />
      <main>
        <ParkedHero />
        <ParkedStats />
        <ParkedConcept />
        <ParkedRoadmap />
        <ParkedTemplates />
        <ParkedWhy />
        <ParkedFaq />
      </main>
    </>
  )
}

export default ParkedDomainsPage
