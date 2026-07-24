import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { GmTicker, GmHero, GmSubTabs, GmCreateNftSection } from '@/design-system/composites/gm'
import styles from '../gm.module.scss'

const CreateNftPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create NFT — Endless Domains</title>
        <meta
          name="description"
          content="Launch your own NFT collection directly from your dashboard. Configure, upload, choose your chain, and deploy in minutes with zero dev experience."
        />
      </Head>

      <PerksNavBar onGoldClick={() => {}} />

      <main className={styles.main}>
        <GmTicker />
        <GmHero
          heading="Mint It. Own It."
          description="Launch your own NFT collection directly from your dashboard. Configure, upload, choose your chain, and deploy in minutes with zero dev experience."
        />
        <GmSubTabs activeTab="create-nft" />
        <GmCreateNftSection />
      </main>
    </>
  )
}

export default CreateNftPage
