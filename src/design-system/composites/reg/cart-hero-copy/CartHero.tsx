import React from 'react'

import styles from './CartHero.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartHeroProps {
  headerStatus?: 'cart' | 'pay' | 'success'
}

// ─── Hero content per page ────────────────────────────────────────────────────

const HERO_CONTENT: Record<'cart' | 'pay' | 'success', { label: string; title: string; subtitle: string }> = {
  cart: {
    label: 'Your Cart',
    title: 'Your Cart',
    subtitle: 'Adding a domain to your cart does not block others from purchasing it.',
  },
  pay: {
    label: 'Payments',
    title: 'Checkout',
    subtitle: 'Select your desired mode of payment and complete payment.',
  },
  success: {
    label: 'Success',
    title: 'Payment Complete',
    subtitle: 'Your domain purchase is complete. Check your email for confirmation.',
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const BarMarker = ({ active }: { active: boolean }) => (
  <div className={`${styles.bar_marker} ${active ? styles.bar_marker_active : styles.bar_marker_inactive}`}>
    <div className={styles.bar_marker_inner} />
  </div>
)

const StepPill = ({ label, active }: { label: string; active: boolean }) => (
  <div className={`${styles.step_pill} ${active ? styles.step_pill_active : styles.step_pill_inactive}`}>
    <div className={styles.step_pill_inner} aria-hidden="true" />
    <span className={styles.step_label}>{label}</span>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────

const CartHero = ({ headerStatus = 'cart' }: CartHeroProps) => {
  const payActive = headerStatus === 'pay' || headerStatus === 'success'
  const successActive = headerStatus === 'success'
  const { label, title, subtitle } = HERO_CONTENT[headerStatus]

  return (
    <div className={styles.cart_hero}>
      {/* ── Top Shape ── */}
      <div className={styles.top_shape}>
        <div className={styles.trapezoid_wrapper}>
          <div className={styles.trapezoid}></div>
        </div>
      </div>

      {/* ── Progress Strip ── */}
      <div className={styles.progress_strip}>
        <div className="container">
          <div className={styles.progress_inner}>
            <BarMarker active={true} />
            <div className={`${styles.track} ${styles.track_active}`} />
            <StepPill label="Cart" active={true} />
            <div className={`${styles.track} ${payActive ? styles.track_active : styles.track_inactive}`} />
            <StepPill label="Pay" active={payActive} />
            <div className={`${styles.track} ${successActive ? styles.track_active : styles.track_inactive}`} />
            <StepPill label="Success" active={successActive} />
            <div className={`${styles.track} ${styles.track_tail} ${successActive ? styles.track_active : styles.track_inactive}`} />
            <BarMarker active={successActive} />
          </div>
        </div>
        <div className={styles.accent_line} />
      </div>

      {/* ── Hero Section ── */}
      {/* ── Hero Section ── */}
      {headerStatus === 'cart' && (
        <section className={styles.hero} aria-label={title}>
          <div className={styles.heroWrapper}>
            <div className={styles.hero_content}>
              <div className={styles.count_badge} aria-hidden="true">
                <div className={styles.badge_corners} />
                <span className={styles.count_text}>{label}</span>
              </div>

              <h1 className={styles.hero_title}>{title}</h1>

              <p className={styles.hero_subtitle}>{subtitle}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default CartHero
