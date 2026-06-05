import type { NextPage } from 'next'
import Head from 'next/head'
import Perks from '@/design-system/composites/reputation/perks'

const PerksPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Perks Catalog | Endless Domains</title>
        <meta name="description" content="Discover and claim exclusive perks available to Endless Domains reputation holders." />
      </Head>
      <Perks />
    </>
  )
}

export default PerksPage
