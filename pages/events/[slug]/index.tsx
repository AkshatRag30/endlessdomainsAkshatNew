import React, { useRef, useState, useCallback } from 'react'
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { EVENTS, getEventBySlug, getAllEvents } from '@/data/events'
import { getEventDetailBySlug } from '@/data/eventDetails'
import { EventPostHeader } from '@/design-system/composites/events/EventPostHeader'
import { EventPostBody } from '@/design-system/composites/events/EventPostBody'
import { EventCard } from '@/design-system/composites/events/EventCard'
import type { EventCardData } from '@/design-system/composites/events/EventCard'
import type { EventSummary } from '@/data/events'
import type { EventDetail } from '@/data/eventDetails'
import styles from './slug.module.scss'

function toCardData(ev: EventSummary): EventCardData {
  return {
    id: ev.id,
    title: ev.title,
    excerpt: ev.excerpt,
    image: ev.image,
    category: ev.category,
    date: ev.date,
    location: ev.location,
    href: `/events/${ev.slug}`,
  }
}

interface EventPostPageProps {
  event: EventSummary
  detail: EventDetail
  relatedEvents: EventSummary[]
}

const EventPostPage: NextPage<EventPostPageProps> = ({ event, detail, relatedEvents }) => {
  const gridRef = useRef<HTMLUListElement | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const updateArrows = useCallback((el: HTMLUListElement) => {
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    const max = el.scrollWidth - el.clientWidth
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0)
  }, [])

  const setGridRef = useCallback((el: HTMLUListElement | null) => {
    gridRef.current = el
    if (!el) return
    requestAnimationFrame(() => updateArrows(el))
  }, [updateArrows])

  const handleScroll = useCallback(() => {
    if (gridRef.current) updateArrows(gridRef.current)
  }, [updateArrows])

  const slide = useCallback((dir: 'prev' | 'next') => {
    const el = gridRef.current
    if (!el) return
    const card = el.querySelector('li') as HTMLElement
    const cardWidth = card ? card.getBoundingClientRect().width : el.clientWidth / 3
    const target = el.scrollLeft + (dir === 'next' ? cardWidth : -cardWidth)
    el.scrollTo({ left: target, behavior: 'smooth' })
    setTimeout(() => updateArrows(el), 400)
  }, [updateArrows])

  return (
    <>
      <Head>
        <title>{detail.seo.title}</title>
        <meta name="description" content={detail.seo.description} />
        <meta name="keywords" content={detail.seo.keywords.join(', ')} />
        <meta property="og:title" content={detail.seo.title} />
        <meta property="og:description" content={detail.seo.description} />
        <meta property="og:image" content={detail.heroImage} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://endlessdomains.io/events/${event.slug}`} />
      </Head>

      <main className={styles.page}>
        <EventPostHeader event={event} />
        <div className={styles.heroDivider} aria-hidden="true" />
        <EventPostBody detail={detail} />

        {/* ── Related events slider ── */}
        {relatedEvents.length > 0 && (
          <section className={styles.related} aria-labelledby="related-heading">
            <div className={styles.relatedInner}>
              <div className={styles.relatedEyebrow}>
                <span className={styles.eyebrowBracket} aria-hidden="true" />
                <span className={styles.eyebrowText}>YOU MIGHT ALSO LIKE</span>
                <span className={styles.eyebrowBracket} aria-hidden="true" />
              </div>
              <div className={styles.relatedTitleRow}>
                <h2 id="related-heading" className={styles.relatedTitle}>More from Endless Domains</h2>
                <div className={styles.sliderBtns}>
                  <button className={styles.sliderBtn} onClick={() => slide('prev')} disabled={!canPrev} aria-label="Previous events">
                    <FiChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <div className={styles.sliderProgress} aria-hidden="true">
                    <div className={styles.sliderProgressFill} style={{ width: `${scrollProgress * 100}%` }} />
                  </div>
                  <button className={styles.sliderBtn} onClick={() => slide('next')} disabled={!canNext} aria-label="Next events">
                    <FiChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.relatedBorder} aria-hidden="true" />

            <div className={styles.relatedGridWrap}>
              <ul
                className={styles.relatedGrid}
                ref={setGridRef}
                onScroll={handleScroll}
                aria-label="Related events"
              >
                {relatedEvents.map(ev => (
                  <li key={ev.id} className={styles.relatedItem}>
                    <EventCard event={toCardData(ev)} />
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.relatedBorder} aria-hidden="true" />
          </section>
        )}

        {/* ── Dark footer CTA banner ── */}
        <div className={styles.footerBanner}>
          <div className={styles.footerBannerBg} aria-hidden="true" />
          <div className={styles.footerBannerInner}>
            <div className={styles.footerBannerText}>
              <p className={styles.footerBannerEyebrow}>Endless Domains</p>
              <h2 className={styles.footerBannerTitle}>Take control of your crypto.</h2>
            </div>
            <Link href="/" className={styles.footerBannerBtn}>
              Get your domain
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = EVENTS.map(ev => ({ params: { slug: ev.slug } }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<EventPostPageProps> = async ({ params }) => {
  const slug = params?.slug as string
  const event = getEventBySlug(slug)
  const detail = getEventDetailBySlug(slug)

  if (!event || !detail) return { notFound: true }

  const allEvents = getAllEvents()
  const relatedEvents = allEvents
    .filter(e => e.slug !== slug)
    .slice(0, 6)

  return {
    props: { event, detail, relatedEvents },
  }
}

export default EventPostPage
