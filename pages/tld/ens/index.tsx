import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { EnsHero, EnsAbout } from '@/design-system/composites/ens'
import styles from './ens.module.scss'

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
        <EnsHero />
        <EnsAbout />
      </main>
    </>
  )
}

export default EnsTldPage
