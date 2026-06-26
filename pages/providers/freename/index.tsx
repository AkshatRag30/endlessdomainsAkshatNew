import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { FreenameHero, FreenameBanner, FreenameAbout, FreenameTlds, FreenameCompare, FreenameFaq } from '@/design-system/composites/providers/freename'
import styles from './freename.module.scss'

const FreenamePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Register Through Freename — Endless Domains</title>
        <meta
          name="description"
          content="Access 8 Web3-native TLDs from Freename, one of the leading decentralized naming providers. Permanent ownership. Custom namespaces. Starting from $5."
        />
      </Head>
      <PerksNavBar />
      <main className={styles.main}>
        <FreenameHero />
        <FreenameBanner />
        <FreenameAbout />
        <FreenameTlds />
        <FreenameCompare />
        <FreenameFaq />
      </main>
    </>
  )
}

export default FreenamePage
