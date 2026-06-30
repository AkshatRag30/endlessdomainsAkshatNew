import Image from 'next/image'
import domainDaysSvg from '/public/events/Frame 2147239463.svg'
import ibwLogoSvg from '/public/events/Group 2085666495.svg'
import ibwBadgeSvg from '/public/events/Group 2085666496.svg'
import token2049Svg from '/public/events/Link - Go to the Homepage.svg'
import ethGlobalSvg from '/public/events/Link (ETHGlobal New Delhi).svg'
import photo1 from '/public/events/Frame 1.jpg'
import photo2 from '/public/events/Frame 2.jpg'
import photo3 from '/public/events/Frame 3.jpg'
import photo4 from '/public/events/Frame 4.jpg'
import photo5 from '/public/events/Frame 6.jpg'
import styles from './EventsGallery.module.scss'

export function EventsGallery() {
  return (
    <section className={styles.section} aria-labelledby="events-gallery-heading">
      <div className={styles.inner}>

        {/* ── Heading ── */}
        <h2 id="events-gallery-heading" className={styles.heading}>
          Events <span className={styles.headingLight}>we attended</span>
        </h2>

        {/* ── Logo strip ── */}
        <div className={styles.logoStrip}>

          <div className={styles.logoItem}>
            <Image src={domainDaysSvg} alt="Domain Days" height={48} unoptimized />
          </div>

          <span className={styles.logoDivider} aria-hidden="true" />

          <div className={styles.logoItem}>
            <p className={styles.domainerExpo}>
              DOMAINER <span className={styles.domainerExpoAccent}>EXPO</span>
            </p>
          </div>

          <span className={styles.logoDivider} aria-hidden="true" />

          <div className={styles.logoItem}>
            <Image src={token2049Svg} alt="Token 2049 Dubai" height={46} unoptimized />
          </div>

          <span className={styles.logoDivider} aria-hidden="true" />

          <div className={styles.logoItem}>
            <Image src={ibwLogoSvg} alt="IBW 2024" height={46} unoptimized />
          </div>

          <span className={styles.logoDivider} aria-hidden="true" />

          <div className={styles.logoItem}>
            <Image src={ethGlobalSvg} alt="ETHGlobal New Delhi" height={86} unoptimized />
          </div>

        </div>

        {/* ── Photo mosaic ── */}
        {/*
          Grid layout (desktop):
          ┌─────────────────┬──────────┐
          │   photoWide     │          │
          │  (col 1-2, r1)  │ photoTall│
          ├────────┬────────┤ (col3,   │
          │ sm-1   │ sm-2   │  r1-2)   │
          │(c1,r2) │(c2,r2) │          │
          └────────┴────────┴──────────┘
          photoSmall-3 placed col3 row3 via auto row
        */}
        <div className={styles.grid} aria-label="Event photos">

          <div className={styles.photoWide}>
            <Image src={photo1} alt="Endless Domains team at event" fill className={styles.photo} />
          </div>

          <div className={styles.photoTall}>
            <Image src={photo2} alt="Endless Domains team at event" fill className={styles.photo} />
          </div>

          <div className={styles.photoSmall1}>
            <Image src={photo3} alt="Endless Domains team at event" fill className={styles.photo} />
          </div>

          <div className={styles.photoSmall2}>
            <Image src={photo4} alt="Endless Domains team at event" fill className={styles.photo} />
          </div>

          <div className={styles.photoSmall3}>
            <Image src={photo5} alt="Endless Domains team at event" fill className={styles.photo} />
          </div>

        </div>

      </div>
    </section>
  )
}

export default EventsGallery
