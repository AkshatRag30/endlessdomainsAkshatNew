import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi'
import { PiArrowBendUpLeft } from 'react-icons/pi'
import styles from './EventPostHeader.module.scss'
import type { EventSummary } from '@/data/events'

export interface EventPostHeaderProps {
  event: EventSummary
}

export function EventPostHeader({ event }: EventPostHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* Left column */}
        <div className={styles.left}>

          <Link href="/events#browse" className={styles.backLink} aria-label="Back to events browse section">
            <PiArrowBendUpLeft size={15} aria-hidden="true" />
            <span>Back to Event</span>
          </Link>

          {/* Category badge + status */}
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge}>
              {event.category}
              {event.status === 'concluded' && <span className={styles.concludedDot} aria-label="Concluded" />}
            </span>
          </div>

          {/* Date / Location / Attendees meta pills */}
          <div className={styles.detailsMeta}>
            <div className={styles.metaPill}>
              <FiCalendar size={13} aria-hidden="true" />
              <span>{event.date}</span>
            </div>
            <div className={styles.metaPill}>
              <FiMapPin size={13} aria-hidden="true" />
              <span>{event.location}</span>
            </div>
            <div className={styles.metaPill} data-highlight="true">
              <FiUsers size={13} aria-hidden="true" />
              <span>{event.attendees}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className={styles.title}>{event.title}</h1>

          {/* Excerpt */}
          <p className={styles.excerpt}>{event.excerpt}</p>

        </div>

        {/* Right column — hero image */}
        <div className={styles.right}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardTexture} aria-hidden="true" />
            <div className={styles.imageWrap}>
              <Image
                src={event.image}
                alt={event.title}
                fill
                priority
                className={styles.heroImage}
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>

      </div>
    </header>
  )
}

export default EventPostHeader
