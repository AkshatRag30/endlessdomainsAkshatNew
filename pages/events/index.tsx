import type { NextPage } from 'next'
import Head from 'next/head'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar'
import { EventsHero, EventsGallery, EventsGrid, EventsPurpose, EventsNewsletter } from '@/design-system/composites/events'
import styles from './events.module.scss'

const EventsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Events — Endless Domains</title>
        <meta
          name="description"
          content="From global conferences to curated community meetups, Endless Domains shapes the future of Web3 identity, ownership, and digital culture — one event at a time."
        />
      </Head>
      <PerksNavBar />
      <main className={styles.main}>
        <EventsHero />
        <EventsGallery />
        <EventsGrid />
        <EventsPurpose />
        <EventsNewsletter />
      </main>
    </>
  )
}

export default EventsPage
