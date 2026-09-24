import React from 'react'
import styles from './NoticeBanner.module.scss'

export interface NoticeBannerProps {
  /** 'error' = the red wrong-network banner (1:1297). 'warning' = the buying flow's amber insufficient-funds banner (1:1685). */
  tone?: 'error' | 'warning'
  /** Caller-styled, so each flow keeps its own Figma icon and offset. */
  icon: React.ReactNode
  title: string
  body: string
  /** Usually a PrimaryButton size="sm" variant="error" ("Switch"); caller-styled for the same reason as `icon`. */
  action?: React.ReactNode
  className?: string
}

/**
 * The drawer flows' inline warning banner — extracted from the listing
 * flow's wrong-network banner (ListingFormStep, Figma listing-flow 1:9355)
 * so the buying flow reuses it instead of a copy (buying-flow plan §3: its
 * Figma layer, 1:1297, is literally named "Container (My domains · listing
 * drawer — Endless Domains)"). Owns the container and text; the icon and
 * action button are passed in already styled.
 */
export const NoticeBanner = ({ tone = 'error', icon, title, body, action, className = '' }: NoticeBannerProps) => (
  <div className={[styles.banner, styles[tone], className].filter(Boolean).join(' ')} role="alert">
    {icon}
    <div className={styles.text}>
      <p className={styles.title}>{title}</p>
      <p className={styles.body}>{body}</p>
    </div>
    {action}
  </div>
)

export default NoticeBanner
