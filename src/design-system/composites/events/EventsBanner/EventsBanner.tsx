import Image from 'next/image'
import styles from './EventsBanner.module.scss'

export function EventsBanner() {
  return (
    <section className={styles.section} aria-label="Events We Attached">
      <div className={styles.bannerWrap}>
        <Image
          src="/providers/freename/union.svg"
          alt=""
          aria-hidden="true"
          fill
          unoptimized
          className={styles.unionBg}
        />
        <p className={styles.label}>Events We Attached</p>
      </div>
    </section>
  )
}

export default EventsBanner
