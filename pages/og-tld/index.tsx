import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { OgTldHero, OgTldAbout, OgTldWhy, OgTldUtility, OgTldFaq } from '@/design-system/composites/og-tld'
import styles from './og-tld.module.scss'

const OgTldPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>.og Domains — Endless Domains</title>
        <meta
          name="description"
          content="Register your .og identity for just $2. The native identity of the Endless ecosystem — one name for payments, reputation, login, and ownership across Web3."
        />
      </Head>
      <PerksNavBar onGoldClick={() => {}} />
      <main className={styles.main}>
        <OgTldHero />
        <OgTldAbout />
        <OgTldWhy />
        <OgTldUtility />
        <OgTldFaq />
      </main>
    </>
  )
}

export default OgTldPage
