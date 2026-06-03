import { useCallback, useEffect, useState } from 'react'
import { FaStar, FaUser } from 'react-icons/fa'
import { BsPersonBadgeFill } from 'react-icons/bs'
import styles from './HowItWorksNew.module.scss'

type TextPosition = 'top' | 'bottom'

interface SliderCard {
  title: string
  description: string
  image: string
  textPosition: TextPosition
}

const CARDS: SliderCard[] = [
  {
    title: 'Claim Your Identity',
    description:
      'One transaction mints your .og directly to your wallet. No renewals. No expiry. No middlemen. You can mint across any supported identity in the ecosystem, but .og is the key that unlocks Identity OS.',
    image: '/new-assets/how-it-works/card4.svg',
    textPosition: 'bottom',
  },
  {
    title: 'Connect Your Wallets',
    description:
      'Your on-chain identity resolves across every major chain the moment you connect. EVM and Non-EVM all unified under one permanent on-chain identity',
    image: '/new-assets/how-it-works/card1.svg',
    textPosition: 'top',
  },
  {
    title: 'Explore the Use Cases',
    description:
      'Own it. Park it. Trade it. Activate it. Your identity opens every door the on-chain ecosystem has to offer.',
    image: '/new-assets/how-it-works/card2.svg',
    textPosition: 'bottom',
  },
  {
    title: 'Build Your Reputation',
    description:
      'Every action you take on-chain builds a permanent score. One number, zero to one thousand, that every protocol can read in a single call.',
    image: '/new-assets/how-it-works/card3.svg',
    textPosition: 'top',
  },
]

const Card4Illus = () => (
  <div className={styles.c4Wrap}>
    <div className={styles.c4Content}>
      {/* vertical line + horizontal cap going up */}
      <div className={styles.c4VTop} aria-hidden="true" />

      {/* left SVG — icon box — right SVG */}
      <div className={styles.c4Row}>
        <img src="/new-assets/how-it-works/card4left.svg" alt="" aria-hidden="true" className={styles.c4SideLeft} />
        <div className={styles.c4IconBox}>
          <BsPersonBadgeFill className={styles.c4Icon} aria-hidden="true" />
        </div>
        <img src="/new-assets/how-it-works/card4right.svg" alt="" aria-hidden="true" className={styles.c4SideRight} />
      </div>

      {/* vertical line going down */}
      <div className={styles.c4VBottom} aria-hidden="true" />
    </div>
  </div>
)

const Card3Illus = () => (
  <div className={styles.c3Wrap}>
    <img src="/new-assets/how-it-works/card3.svg" alt="" aria-hidden="true" className={styles.c3Curves} />
    <div className={styles.c3Avatar}>
      <div className={styles.c3Stars} aria-hidden="true">
        <FaStar className={styles.c3StarSm} />
        <FaStar className={styles.c3StarLg} />
        <FaStar className={styles.c3StarSm} />
      </div>
      <FaUser className={styles.c3UserIcon} aria-hidden="true" />
    </div>
  </div>
)

const VISIBLE_CARDS_DESKTOP = 2

const HowItWorksNew = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(CARDS.length - VISIBLE_CARDS_DESKTOP)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)')
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      const next = CARDS.length - (e.matches ? VISIBLE_CARDS_DESKTOP : 1)
      setMaxIndex(next)
      setActiveIndex(i => Math.min(i, next))
    }
    update(mq)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const prev = useCallback(() => setActiveIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setActiveIndex(i => Math.min(maxIndex, i + 1)), [maxIndex])

  return (
    <section className={styles.section}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className={styles.headerOuter}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.label}>
              <h4>LET'S KNOW</h4>
              <span />
            </div>
            <h2 className={styles.heading}>
              How Endless<br />
              <span className={styles.headingGray}>Domains works?</span>
            </h2>
          </div>

          <div className={styles.headerCenter} aria-hidden="true">
            <img src="/new-assets/how-it-works/khomu.gif" alt="" className={styles.decorImage} />
          </div>

          <div className={styles.headerRight}>
            <p className={styles.sectionDesc}>
              Set up your on-chain identity in minutes. One transaction. Permanent ownership.
              Your blockchain domain resolves across every integrated wallet and dApp –
              no renewals, no counterparty, no expiry.
            </p>
          </div>
        </div>
      </div>

      {/* ── Slider ──────────────────────────────────────────────────────── */}
      <div className={styles.sliderSection}>
        <div className={styles.bg_stripes} />
        <div className={styles.sliderViewport}>
          <div
            className={styles.sliderTrack}
            style={{ '--hiw-index': activeIndex } as React.CSSProperties}
          >
            {CARDS.map((card, i) => (
              <div key={i} className={styles.cardWrapper}>
                <article className={styles.card} aria-label={card.title}>

                  {/* ── Soft blue corner squares (background decoration) ── */}
                  <div className={styles.cardBg} aria-hidden="true" />

                  {/* ── Illustration ── */}
                  {i === 0 ? (
                    <Card4Illus />
                  ) : i === 3 ? (
                    <Card3Illus />
                  ) : (
                    <div className={[
                      styles.cardIllus,
                      card.textPosition === 'top' ? styles.cardIllusBottom : styles.cardIllusTop,
                      i === 1 ? styles.c1Illus : '',
                    ].filter(Boolean).join(' ')}>
                      <img src={card.image} alt="" aria-hidden="true" />
                    </div>
                  )}

                  {/* ── Text block ── */}
                  <div className={[
                    styles.cardText,
                    card.textPosition === 'top' ? styles.cardTextTop : styles.cardTextBottom,
                  ].join(' ')}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardDesc}>{card.description}</p>
                  </div>

                </article>

                <div className={styles.foldTopLeft} aria-hidden="true" />
                <div className={styles.foldBottomRight} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <div className={styles.navOuter}>
        <div className={styles.navigation}>
          <div className={styles.navArrows}>
            <button className={styles.arrowBtn} onClick={prev} disabled={activeIndex === 0} aria-label="Previous slide">
              <ChevronLeft />
            </button>
            <button className={styles.arrowBtn} onClick={next} disabled={activeIndex === maxIndex} aria-label="Next slide">
              <ChevronRight />
            </button>
          </div>

          <div className={styles.pagination} role="group" aria-label="Slide position">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide group ${i + 1}`}
                aria-pressed={i === activeIndex}
                className={[styles.pagBar, i === activeIndex ? styles.pagBarActive : ''].filter(Boolean).join(' ')}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default HowItWorksNew
