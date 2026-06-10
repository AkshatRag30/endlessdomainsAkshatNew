import { useRef } from 'react'
import { useEntranceAnimation } from '../useEntranceAnimation'
import styles from './StorySection.module.scss'

export default function StorySection() {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEntranceAnimation([eyebrowRef, headingRef, rightRef])

  return (
    <section className={styles.section} aria-labelledby="story-heading">

      {/* ── Left — sticky heading ── */}
      <div className={styles.leftCol}>
        <div className={styles.stickyLeft}>

          <div className={styles.eyebrow} ref={eyebrowRef}>
            <span className={styles.eyebrowBracketTL} aria-hidden="true" />
            <span className={styles.eyebrowBracketTR} aria-hidden="true" />
            <span className={styles.eyebrowText}>THE STORY</span>
            <span className={styles.eyebrowBracketBL} aria-hidden="true" />
            <span className={styles.eyebrowBracketBR} aria-hidden="true" />
          </div>

          <h2 id="story-heading" className={styles.heading} ref={headingRef}>
            <span className={styles.headingBlack}>It Started With a Bitcoin</span>
            <span className={styles.headingBlue}>Donation.</span>
          </h2>

        </div>
      </div>

      {/* ── Vertical dashed divider ── */}
      <div className={styles.divider} aria-hidden="true" />

      {/* ── Right — scrolling story text ── */}
      <div className={styles.rightCol} ref={rightRef}>

        {/* Corner brackets on right column */}
        <span className={styles.bracketTL} aria-hidden="true" />
        <span className={styles.bracketBR} aria-hidden="true" />

        <div className={styles.storyContent}>

          <p className={styles.para}>
            Year 2013.
          </p>

          <p className={styles.para}>
            When most people saw a weird string of characters, the founder saw something that had
            never existed before. A system that worked without anyone in charge. No bank in the
            middle. No permission needed. Just code that ran and trusted no one.
            That single moment became a career.
          </p>

          <p className={styles.para}>
            Trading. Mining operations in Iceland. A CFD exchange in Estonia. NFTs, ICOs. A decade
            inside every corner of the on-chain economy, not watching from the outside but building
            and operating through every cycle of it.
          </p>

          <blockquote className={styles.pullQuote}>
            <p>"The one thing that could actually belong to you, permanently, was identity."</p>
          </blockquote>

          <p className={styles.para}>
            When international travel shut down, a good exit from the mining business opened up.
            The timing was right. With that chapter closed, there was finally space to look at the
            bigger picture honestly.
          </p>

          <p className={styles.para}>
            The question was not whether blockchain worked. It did. The question was what any of it
            actually gave you. You could hold assets, trade them, and build on top of them and still
            have no real control. One change at the top and you were watching from the outside with
            nothing in your hands. Ownership existed on paper. Control never did.
          </p>

          <p className={styles.para}>
            The one thing that could actually belong to you, permanently, regardless of what any
            project or platform decided, was identity. Your name. Your address on the internet.
            Something that no one else could revoke or change or take away. That gap had been
            sitting in plain sight the whole time.
          </p>

          <p className={styles.para}>
            Endless Domains was founded in 2020 to close it. Not as a product. As the foundation
            that should have existed from the beginning.
          </p>

        </div>
      </div>

    </section>
  )
}
