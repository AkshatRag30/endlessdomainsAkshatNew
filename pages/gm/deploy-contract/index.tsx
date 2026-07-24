import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { GmTicker, GmHero, GmHeroAccent, GmSubTabs, GmDeployContractSection } from '@/design-system/composites/gm'
import styles from '../gm.module.scss'

const DeployContractPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Deploy Contract — Endless Domains</title>
        <meta
          name="description"
          content="Ship a smart contract to any supported chain without leaving the platform. Pick your standard, set your parameters, and go live from your Web3 identity."
        />
      </Head>

      <PerksNavBar onGoldClick={() => {}} />

      <main className={styles.main}>
        <GmTicker />
        <GmHero
          heading={<>Build Onchain, <GmHeroAccent>Deploy Everywhere.</GmHeroAccent></>}
          description="Ship a smart contract to any supported chain without leaving the platform. Pick your standard, set your parameters, and go live from your Web3 identity."
        />
        <GmSubTabs activeTab="deploy-contract" />
        <GmDeployContractSection />
      </main>
    </>
  )
}

export default DeployContractPage
