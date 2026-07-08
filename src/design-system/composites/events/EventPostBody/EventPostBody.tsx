import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiCalendar, FiMapPin, FiUsers, FiGlobe, FiVideo, FiShare2, FiExternalLink } from 'react-icons/fi'
import { MdOutlineLanguage } from 'react-icons/md'
import styles from './EventPostBody.module.scss'
import type { EventDetail } from '@/data/eventDetails'

export interface EventPostBodyProps {
  detail: EventDetail
}

const DETAIL_ICONS: Record<string, React.ReactNode> = {
  date: <FiCalendar size={14} aria-hidden="true" />,
  location: <FiMapPin size={14} aria-hidden="true" />,
  duration: <FiGlobe size={14} aria-hidden="true" />,
  attendees: <FiUsers size={14} aria-hidden="true" />,
  eventType: <FiVideo size={14} aria-hidden="true" />,
  language: <MdOutlineLanguage size={14} aria-hidden="true" />,
}

export function EventPostBody({ detail }: EventPostBodyProps) {
  const isConcluded = detail.status === 'concluded'

  return (
    <div className={styles.layout}>

      {/* ── Article (left) ── */}
      <article className={styles.article}>

        {/* About this event */}
        <section className={styles.aboutSection} aria-labelledby="about-heading">
          <div className={styles.sectionEyebrow}>
            <span className={styles.eyebrowBracketTL} aria-hidden="true" />
            <span className={styles.eyebrowBracketTR} aria-hidden="true" />
            <span className={styles.eyebrowBracketBL} aria-hidden="true" />
            <span className={styles.eyebrowBracketBR} aria-hidden="true" />
            <p className={styles.eyebrowText}>ABOUT THIS EVENT</p>
          </div>

          <h2 id="about-heading" className={styles.sectionTitle}>{detail.aboutTitle}</h2>

          <div className={styles.tagRow}>
            {detail.aboutTags.map((tag, i) => (
              <span key={i} className={styles.tag}>{tag}</span>
            ))}
          </div>

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: detail.aboutContent }}
          />
        </section>

        {/* Event gallery */}
        {detail.galleryImages.length > 0 && (
          <section className={styles.gallerySection} aria-labelledby="gallery-heading">
            <div className={styles.sectionEyebrow}>
              <span className={styles.eyebrowBracketTL} aria-hidden="true" />
              <span className={styles.eyebrowBracketTR} aria-hidden="true" />
              <span className={styles.eyebrowBracketBL} aria-hidden="true" />
              <span className={styles.eyebrowBracketBR} aria-hidden="true" />
              <p className={styles.eyebrowText}>{detail.galleryEyebrow}</p>
            </div>

            <h2 id="gallery-heading" className={styles.sectionTitle}>{detail.galleryTitle}</h2>

            <div className={styles.tagRow}>
              {detail.galleryTags.map((tag, i) => (
                <span key={i} className={styles.tag}>{tag}</span>
              ))}
            </div>

            <div className={styles.photoGrid}>
              {detail.galleryImages.slice(0, 2).map((src, i) => (
                <div key={i} className={styles.photoLarge}>
                  <Image
                    src={src}
                    alt={`${detail.galleryTitle} photo ${i + 1}`}
                    fill
                    className={styles.photo}
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              ))}
              {detail.galleryImages.slice(2).map((src, i) => (
                <div key={i + 2} className={styles.photoSmall}>
                  <Image
                    src={src}
                    alt={`${detail.galleryTitle} photo ${i + 3}`}
                    fill
                    className={styles.photo}
                    sizes="(max-width: 768px) 50vw, 27vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

      </article>

      {/* ── Sidebar (right) ── */}
      <aside className={styles.sidebar} aria-label="Event sidebar">
        <div className={styles.sidebarInner}>

          {/* Status CTA card — flush at top, gradient bg, matches blog ctaCard */}
          <div className={styles.statusCard}>
            <p className={styles.statusEyebrow}>Event Status</p>
            <h3 className={styles.statusTitle}>
              {isConcluded ? 'This event has concluded.' : detail.status === 'ongoing' ? 'Happening right now.' : 'Coming up soon.'}
            </h3>
            {detail.statusLabel && (
              <p className={styles.statusDesc}>{detail.statusLabel}</p>
            )}
            {isConcluded && detail.recapUrl && (
              <Link href={detail.recapUrl} className={styles.watchRecapBtn} aria-label="Watch event recap">
                <FiVideo size={14} aria-hidden="true" />
                Watch Recap
              </Link>
            )}
            {!isConcluded && (
              <Link href="#register" className={styles.watchRecapBtn}>
                Register Now
              </Link>
            )}
            <p className={styles.statusMeta}>Free to attend · Open to all</p>
            <button type="button" className={styles.shareEventBtn} aria-label="Share this event">
              <FiShare2 size={13} aria-hidden="true" />
              Share Event
            </button>
          </div>

          {/* Event details — inset white card matching blog tocCard / popularCard */}
          <div className={styles.detailsCard}>
            <p className={styles.cardLabel}>Event Details</p>
            <ul className={styles.detailsList}>
              <li className={styles.detailItem}>
                {DETAIL_ICONS.date}
                <span className={styles.detailText}>{detail.details.date}</span>
              </li>
              <li className={styles.detailItem}>
                {DETAIL_ICONS.location}
                <span className={styles.detailText}>
                  {detail.details.locationUrl
                    ? <Link href={detail.details.locationUrl} className={styles.detailLink} target="_blank" rel="noopener noreferrer">
                        {detail.details.location}
                        <FiExternalLink size={11} aria-hidden="true" />
                      </Link>
                    : detail.details.location
                  }
                </span>
              </li>
              <li className={styles.detailItem}>
                {DETAIL_ICONS.duration}
                <span className={styles.detailText}>{detail.details.duration}</span>
              </li>
              <li className={styles.detailItem}>
                {DETAIL_ICONS.attendees}
                <span className={styles.detailText}>{detail.details.attendees}</span>
              </li>
              <li className={styles.detailItem}>
                {DETAIL_ICONS.eventType}
                <span className={styles.detailText}>{detail.details.eventType}</span>
              </li>
              <li className={styles.detailItem}>
                {DETAIL_ICONS.language}
                <span className={styles.detailText}>{detail.details.language}</span>
              </li>
            </ul>
          </div>

          {/* Sidebar image */}
          {detail.sidebarImage && (
            <div className={styles.sidebarImageWrap}>
              <Image
                src={detail.sidebarImage}
                alt=""
                fill
                className={styles.sidebarImg}
                sizes="(max-width: 768px) 100vw, 320px"
                aria-hidden="true"
              />
            </div>
          )}

          {/* Organised by — same row structure as blog popularCard */}
          <div className={styles.organisedCard}>
            <p className={styles.cardLabel}>Organised by</p>
            <div className={styles.organiserRow}>
              <span className={styles.organiserNum}>1</span>
              <div className={styles.organiserContent}>
                <span className={styles.organiserRoleLabel}>{detail.organisedBy.roleLabel}</span>
                <span className={styles.organiserName}>{detail.organisedBy.name}</span>
              </div>
            </div>
            <div className={styles.organiserRow}>
              <span className={styles.organiserNum}>2</span>
              <div className={styles.organiserContent}>
                <span className={styles.organiserRoleLabel}>Event Organiser</span>
                <span className={styles.organiserName}>{detail.organisedBy.eventOrganiser}</span>
              </div>
            </div>
          </div>

        </div>
      </aside>

    </div>
  )
}

export default EventPostBody
