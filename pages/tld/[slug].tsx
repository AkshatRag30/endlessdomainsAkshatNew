import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { EnsHero, EnsAbout, EnsWhy, EnsUtility, EnsFaq } from '@/design-system/composites/ens'
import { getTldPageData } from '@/data/tldPages'
import styles from './ens/ens.module.scss'

// design-specific: resolved client-side from the router's slug rather than via getStaticProps —
// TldPageData carries live react-icons component references (providerIcon, utility Icon fields),
// which Next.js can't serialize across the getStaticProps JSON boundary. Once this is backed by a
// real API, icons should become string keys resolved through a client-side icon registry instead.
const TldPage: NextPage = () => {
  const router = useRouter()
  const slug = typeof router.query.slug === 'string' ? router.query.slug : undefined
  const data = slug ? getTldPageData(slug) : undefined

  if (!router.isReady || !data) return null

  return (
    <>
      <Head>
        <title>{data.tld} Domains — Endless Domains</title>
        <meta
          name="description"
          content={`Register your ${data.tld} identity through ${data.providerShort}. ${data.hero.description}`}
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

export default TldPage
