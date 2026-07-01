import { useState } from 'react'
import Image from 'next/image'
import frameBg from '/public/events/Frame.jpg'
import styles from './EventsNewsletter.module.scss'

const STATS = [
  { value: '100+', label: 'Events Hosted' },
  { value: '15', label: 'Cities Covered' },
  { value: '50K+', label: 'Attendees Reached' },
  { value: '8', label: 'Countries' },
]

export function EventsNewsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // subscription logic goes here
  }

  return (
    <section className={styles.section} aria-label="Events newsletter">

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div className={styles.statsRow} aria-label="Event statistics">
        {STATS.map((stat, i) => (
          <div key={stat.label} className={styles.statItem}>
            {i > 0 && <span className={styles.statDivider} aria-hidden="true" />}
            <p className={styles.statValue}>{stat.value}</p>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Newsletter banner ─────────────────────────────────────────────── */}
      <div className={styles.banner}>
        <Image
          src={frameBg}
          alt=""
          fill
          className={styles.bannerBg}
          aria-hidden="true"
        />

        <div className={styles.bannerContent}>
          <div className={styles.bannerText}>
            <h2 className={styles.bannerHeading}>Stay In The Loop</h2>
            <p className={styles.bannerDesc}>
              Get notified about upcoming events, exclusive meetups, and Web3 moments before anyone else
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} aria-label="Newsletter subscription">
            <label htmlFor="newsletter-email" className={styles.srOnly}>Email address</label>
            <input
              id="newsletter-email"
              type="email"
              className={styles.input}
              placeholder="Enter Your Email Id"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              aria-required="true"
            />
            <button type="submit" className={styles.submitBtn}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

    </section>
  )
}

export default EventsNewsletter
