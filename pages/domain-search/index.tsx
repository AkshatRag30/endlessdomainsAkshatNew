import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { DomainSearchHero } from '@/design-system/composites/domain-search'
import styles from './domain-search.module.scss'

const DomainSearchPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Search Domains — Endless Domains</title>
        <meta
          name="description"
          content="Search, claim, and manage onchain domains across the extensions people actually use. Switch to AI search to generate name ideas instantly."
        />
      </Head>
      <PerksNavBar onGoldClick={() => {}} />
      <main className={styles.main}>
        <DomainSearchHero />
      </main>
    </>
  )
}

export default DomainSearchPage
