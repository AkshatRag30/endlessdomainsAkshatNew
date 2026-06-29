import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { UdHero, UdBanner, UdAbout, UdTlds, UdCompare, UdFaq } from '@/design-system/composites/providers/ud'
import styles from './ud.module.scss'

const UdPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Register Through Unstoppable Domains — Endless Domains</title>
        <meta
          name="description"
          content="Access 55 Web3-native TLDs from Unstoppable Domains, the world's largest decentralized naming provider. Permanent ownership. No renewal fees. Starting from $5."
        />
      </Head>
      <PerksNavBar />
      <main className={styles.main}>
        <UdHero />
        <UdBanner />
        <UdAbout />
        <UdTlds />
        <UdCompare />
        <UdFaq />
      </main>
    </>
  )
}

export default UdPage
