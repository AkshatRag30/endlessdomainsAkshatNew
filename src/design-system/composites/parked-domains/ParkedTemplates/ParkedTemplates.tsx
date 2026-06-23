import React, { useRef } from 'react'
import Image from 'next/image'
import tplIndividual from '../../../../../public/parked-domains/tplIndividual.png'
import tplCreator from '../../../../../public/parked-domains/tplCreator.png'
import tplBusiness from '../../../../../public/parked-domains/tplBusiness.png'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './ParkedTemplates.module.scss'

const TEMPLATES = [
  {
    id: 'individual',
    badge: 'Individual',
    accentClass: 'accentBlue' as const,
    title: 'Personal identity',
    subtitle: 'For individuals',
    desc: 'For people parking their own name or personal brand domain',
    image: tplIndividual,
    features: ['Name and short bio', 'Profile photo', 'Social links and wallet address', 'Contact CTA'],
  },
  {
    id: 'creator',
    badge: 'Creator',
    accentClass: 'accentPurple' as const,
    title: 'Creator presence',
    subtitle: 'For influencers',
    desc: 'For creators, educators, and community builders growing an audience',
    image: tplCreator,
    features: ['Channel or creator name', 'Featured content links', 'Platform badges and follower count', 'Collaboration CTA'],
  },
  {
    id: 'business',
    badge: 'Business',
    accentClass: 'accentOrange' as const,
    title: 'Brand landing page',
    subtitle: 'For businesses',
    desc: 'For projects, startups, and brands using a domain as a presence holder',
    image: tplBusiness,
    features: ['Logo, brand name and description', 'Product or service links', 'Team or about section', 'Primary action CTA'],
  },
]

export function ParkedTemplates() {
  const eyebrowRef     = useRef<HTMLDivElement>(null)
  const headingRef     = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const card0Ref       = useRef<HTMLDivElement>(null)
  const card1Ref       = useRef<HTMLDivElement>(null)
  const card2Ref       = useRef<HTMLDivElement>(null)
  const cardRefs = [card0Ref, card1Ref, card2Ref]

  useEntranceAnimation([eyebrowRef, headingRef, descriptionRef, card0Ref, card1Ref, card2Ref])

  return (
    <section className={styles.section} aria-labelledby="templates-heading">

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.eyebrow} ref={eyebrowRef}>
          <span className={styles.bracketTL} aria-hidden="true" />
          <span className={styles.bracketTR} aria-hidden="true" />
          <span className={styles.bracketBL} aria-hidden="true" />
          <span className={styles.bracketBR} aria-hidden="true" />
          <span className={styles.eyebrowText}>Templates</span>
        </div>

        <h2 id="templates-heading" className={styles.heading} ref={headingRef}>
          <span className={styles.headingBlack}>Choose your parked</span>{' '}
          <span className={styles.headingBlue}>domain template</span>
        </h2>

        <p className={styles.description} ref={descriptionRef}>
          Three purpose-built designs for different types of domain owners. Pick once, fill in your details, and your branded page goes live instantly.
        </p>
      </div>

      {/* ── Cards row ── */}
      <div className={styles.cardsRow}>
        {TEMPLATES.map((tpl, i) => (
          <div key={tpl.id} className={styles.cardOuter} ref={cardRefs[i]}>

            {i > 0 && <div className={styles.divider} aria-hidden="true" />}

            {/* Outer border layer — accent colour on hover */}
            <article className={`${styles.card} ${styles[tpl.accentClass]}`}>

              {/* Inner — diagonal grid bg, 1px margin exposes outer as border */}
              <div className={styles.cardInner}>

                {/* Image polygon — top section */}
                <div className={styles.imagePolygon}>
                  <Image
                    src={tpl.image}
                    alt={`${tpl.title} template preview`}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                </div>

                {/* Content polygon — bottom section */}
                <div className={styles.contentPolygon}>
                  <div className={styles.contentInner}>

                    <div className={`${styles.badgeWrap} ${styles[`badge_${tpl.accentClass}`]}`}>
                      <span className={styles.badgeText}>{tpl.badge}</span>
                    </div>

                    <h3 className={`${styles.title} ${styles[`title_${tpl.accentClass}`]}`}>
                      {tpl.title}
                    </h3>

                    <div className={styles.sep} aria-hidden="true" />

                    <div className={styles.textGroup}>
                      <p className={styles.subtitle}>{tpl.subtitle}</p>
                      <p className={styles.desc}>{tpl.desc}</p>
                    </div>

                    <ul className={styles.features}>
                      {tpl.features.map(f => (
                        <li key={f} className={styles.featureItem}>
                          <span
                            className={`${styles.dot} ${styles[`dotFilled_${tpl.accentClass}`]}`}
                            aria-hidden="true"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                  </div>
                </div>

              </div>
            </article>

          </div>
        ))}
      </div>

    </section>
  )
}

export default ParkedTemplates
