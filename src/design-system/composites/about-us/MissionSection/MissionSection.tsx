import { useRef } from 'react'
import { useEntranceAnimation } from '../useEntranceAnimation'
import styles from './MissionSection.module.scss'

export default function MissionSection() {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)

  useEntranceAnimation([eyebrowRef, headingRef, descRef, card1Ref, card2Ref])

  return (
    <section className={styles.section} aria-labelledby="mission-heading">

      {/* ── Top text row ── */}
      <div className={styles.topRow}>

        {/* Left — eyebrow + heading */}
        <div className={styles.topLeft}>
          <div className={styles.eyebrow} aria-label="Mission and Vision" ref={eyebrowRef}>
            <span className={styles.eyebrowBracketTL} aria-hidden="true" />
            <span className={styles.eyebrowBracketTR} aria-hidden="true" />
            <span className={styles.eyebrowText}>Mission and Vision</span>
            <span className={styles.eyebrowBracketBL} aria-hidden="true" />
            <span className={styles.eyebrowBracketBR} aria-hidden="true" />
          </div>
          <h2 id="mission-heading" className={styles.heading} ref={headingRef}>
            <span className={styles.headingBlack}>We Are Not Building a Product.</span>
            <span className={styles.headingBlue}>We Are Building A Standard.</span>
          </h2>
        </div>

        {/* Right — description */}
        <p className={styles.topDesc} ref={descRef}>
          Your email, your username, everything you've built online exists at someone else's
          pleasure. An on-chain identity changes that: your payment address, your login, your
          public name, permanently yours.
        </p>

      </div>

      {/* ── Two cards ── */}
      <div className={styles.cardsRow}>

        {/* Card 1 — Mission (dark blue) */}
        <div className={styles.cardOuter} ref={card1Ref}>
          <div className={`${styles.cardWrap} ${styles.cardWrapDark}`}>
            <article className={`${styles.card} ${styles.cardDark}`} aria-label="Mission — The Foundation">
              <p className={styles.cardEyebrow}>Mission · The Foundation</p>
              <div className={styles.cardBody}>
                <h3 className={styles.cardHeadingLight}>
                  The OS belongs to the people who hold it. Not to us.
                </h3>
                <p className={styles.cardDescLight}>
                  To build the identity OS for the on-chain era. So that every individual, creator,
                  brand, and protocol can mint, own, and build on a self-sovereign on-chain identity
                  without depending on any centralised platform to allow it.
                </p>
              </div>
            </article>
          </div>
        </div>

        {/* Card 2 — Vision (light) */}
        <div className={styles.cardOuter} ref={card2Ref}>
          <div className={`${styles.cardWrap} ${styles.cardWrapLight}`}>
            <article className={`${styles.card} ${styles.cardLight}`} aria-label="Vision — The Standard">
              <p className={`${styles.cardEyebrow} ${styles.cardEyebrowDark}`}>Vision · The Standard</p>
              <div className={styles.cardBody}>
                <h3 className={styles.cardHeadingBlue}>
                  Where the question is never which platform holds your identity.
                </h3>
                <p className={styles.cardDescDark}>
                  An on-chain economy where your identity is as portable as your wallet, as permanent
                  as an on-chain entry, and as recognised as an email address. Only which chain it
                  lives on.
                </p>
              </div>
            </article>
          </div>
        </div>

      </div>

    </section>
  )
}
