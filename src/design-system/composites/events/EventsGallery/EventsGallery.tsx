import Image from 'next/image'
import ibwLogoSvg from '/public/events/Group 2085666495.svg'
import ibwBadgeSvg from '/public/events/Group 2085666496.svg'
import token2049Svg from '/public/events/Link - Go to the Homepage.svg'
import ethGlobalSvg from '/public/events/Link (ETHGlobal New Delhi).svg'
import photo1 from '/public/events/gallery/44 (1).png'
import photo2 from '/public/events/gallery/DSC05432 (1).JPG'
import photo3 from '/public/events/gallery/IMG_0423 (1).jpeg'
import photo4 from '/public/events/gallery/IMG_1222.JPG (1) (2).jpeg'
import photo5 from '/public/events/gallery/WhatsApp Image 2025-05-01 at 12.14.11 PM (1).jpeg'
import styles from './EventsGallery.module.scss'

export function EventsGallery() {
  return (
    <section className={styles.section} aria-label="Events gallery">
      <div className={styles.inner}>

        {/* ── Logo strip ── */}
        <div className={styles.logoStrip}>

          <div className={styles.logoItem}>
            <Image src={ibwBadgeSvg} alt="Domainer Expo" height={48} width={115} unoptimized />
          </div>

          <div className={styles.logoItem}>
            <p className={styles.domainerExpo}>
              DOMAINER <span className={styles.domainerExpoAccent}>EXPO</span>
            </p>
          </div>

          <div className={styles.logoItem}>
            <Image src={token2049Svg} alt="Token 2049 Dubai" height={46} width={94} unoptimized />
          </div>

          <div className={styles.logoItem}>
            <Image src={ibwLogoSvg} alt="IBW 2024" height={57} width={222} unoptimized />
          </div>

          <div className={styles.logoItem}>
            <Image src={ethGlobalSvg} alt="ETHGlobal New Delhi" height={85} width={228} unoptimized />
          </div>

        </div>

        {/* ── Photo mosaic ── */}
        {/*
          Grid layout (desktop):
          ┌─────────────────┬──────────┐
          │   photoWide     │ photoR1  │
          │  (col 1-2, r1)  │ (c3, r1) │
          ├────────┬────────┼──────────┤
          │ sm-1   │ sm-2   │ photoR2  │
          │(c1,r2) │(c2,r2) │ (c3, r2) │
          └────────┴────────┴──────────┘
        */}
        <div className={styles.grid} aria-label="Event photos">

          <div className={styles.photoWide}>
            <Image src={photo1} alt="Endless Domains team at event" fill className={styles.photo} />
          </div>

          <div className={styles.photoR1}>
            <Image src={photo2} alt="Endless Domains team at event" fill className={styles.photo} />
          </div>

          <div className={styles.photoSmall1}>
            <Image src={photo3} alt="Endless Domains team at event" fill className={styles.photo} />
          </div>

          <div className={styles.photoSmall2}>
            <Image src={photo4} alt="Endless Domains team at event" fill className={styles.photo} />
          </div>

          <div className={styles.photoR2}>
            <Image src={photo5} alt="Endless Domains team at event" fill className={styles.photo} />
          </div>

        </div>

      </div>

      <div className={styles.bottomDivider} aria-hidden="true" />
    </section>
  )
}

export default EventsGallery
