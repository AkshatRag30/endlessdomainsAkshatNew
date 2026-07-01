import Image, { StaticImageData } from 'next/image'
import React, { useState, useCallback } from 'react'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import styles from './EventCard.module.scss'

export interface EventCardData {
  id: string
  title: string
  excerpt: string
  image: string | StaticImageData
  category: string
  date: string
  location: string
  href: string
}

interface EventCardProps {
  event: EventCardData
  onExplore?: (id: string) => void
}

export function EventCard({ event, onExplore }: EventCardProps) {
  const [hovered, setHovered] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => setHovered(false), [])

  const handleExplore = useCallback(() => {
    onExplore?.(event.id)
  }, [onExplore, event.id])

  return (
    <div
      className={`${styles.card} ${hovered ? styles.cardHovered : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={event.title}
    >
      {/* Cursor tooltip */}
      <span
        className={`${styles.tooltip} ${hovered ? styles.tooltipVisible : ''}`}
        style={{ '--tx': `${pos.x}px`, '--ty': `${pos.y}px` } as React.CSSProperties}
        aria-hidden="true"
      >Explore event</span>

      <div className={styles.cardInner}>

        {/* Image section */}
        <div className={styles.imagePolygon}>
          <Image
            src={event.image}
            alt=""
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className={styles.categoryBadge}>{event.category}</span>

          {/* Date + location pinned to bottom of photo */}
          <div className={styles.footer}>
            <span className={styles.footerItem}>
              <FiCalendar size={13} aria-hidden="true" />
              {event.date}
            </span>
            <span className={styles.footerSep} aria-hidden="true" />
            <span className={styles.footerItem}>
              <FiMapPin size={13} aria-hidden="true" />
              {event.location}
            </span>
          </div>
        </div>

        {/* Content section */}
        <div className={styles.contentPolygon}>
          <div className={styles.contentInner}>
            <div className={styles.textGroup}>
              <h3 className={styles.title}>{event.title}</h3>
              <p className={styles.excerpt}>{event.excerpt}</p>
            </div>

            {/* Primary CTA */}
            <div className={styles.btnWrap}>
              <PrimaryButton onClick={handleExplore} size="md">
                Explore Events
              </PrimaryButton>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default EventCard
