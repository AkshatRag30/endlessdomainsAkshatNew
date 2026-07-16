import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { EnsHero, EnsAbout, EnsWhy, EnsUtility, EnsFaq } from '@/design-system/composites/ens'
import { getTldPageData } from '@/data/tldPages'
import styles from './ens.module.scss'

const data = getTldPageData('ens')!

const EnsTldPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>.eth Domains — Endless Domains</title>
        <meta
          name="description"
          content="Register your .eth identity through ENS. The original on-chain identity on Ethereum — one name for payments, login, governance, and digital ownership."
        />
      </Head>
      <PerksNavBar onGoldClick={() => {}} />
      <main className={styles.main}>
        <EnsHero data={data} />
        <EnsAbout data={data} />
        <EnsWhy data={data} />
        <EnsUtility data={data} />
        <EnsFaq data={data} />
      </main>
    </>
  )
}

export default EnsTldPage
