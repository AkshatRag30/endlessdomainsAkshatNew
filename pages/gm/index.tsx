import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { GmTicker, GmHero, GmGrid } from '@/design-system/composites/gm'
import styles from './gm.module.scss'

const GmPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Say GM — Endless Domains</title>
        <meta
          name="description"
          content="Send your daily GM across every supported chain with a single click. Build your streak and grow your reputation score tied to your on-chain identity."
        />
      </Head>

      <PerksNavBar onGoldClick={() => {}} />

      <main className={styles.main}>
        <GmTicker />
        <GmHero />
        <GmGrid />
      </main>
    </>
  )
}

export default GmPage
