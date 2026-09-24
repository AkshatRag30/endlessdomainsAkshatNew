import React from 'react'
import Image from 'next/image'
import styles from './StatusIcon.module.scss'

export interface StatusIconProps {
  /**
   * 'success' — green disc + check (Figma 1:938, "Bought").
   * 'error' — red disc + X (Figma 1:1046, "Reject"), or + "!" for
   * "No longer available" (1:1482) via glyph="exclamation".
   */
  variant?: 'success' | 'error'
  /** Color and glyph are separate (plan §4.6) — "No longer available" pairs the red variant with an exclamation. Defaults to check for success, x for error. */
  glyph?: 'check' | 'x' | 'exclamation'
  className?: string
}

const GLYPHS: Record<NonNullable<StatusIconProps['glyph']>, { src: string; width: number; height: number }> = {
  check: { src: '/assets/img/buying-flow/status-check.svg', width: 54, height: 54 },
  x: { src: '/assets/img/buying-flow/status-x.svg', width: 35, height: 35 },
  exclamation: { src: '/assets/img/buying-flow/status-exclamation.svg', width: 16, height: 58 },
}

/**
 * Figma nodes 1:938 / 1:1046 — the buying flow's "glow icon": 96px gradient
 * disc, a faint grain texture blended plus-lighter on top (the same PNG for
 * both colors), a 10px white ring, soft colored blooms outside and an inner
 * glow, with the glyph centered. Richer than the listing flow's flat 56px
 * success icon (ListingSuccessStep) — backporting this there is an optional
 * follow-up.
 */
export const StatusIcon = ({ variant = 'success', glyph: glyphName, className = '' }: StatusIconProps) => {
  const glyph = GLYPHS[glyphName ?? (variant === 'success' ? 'check' : 'x')]

  return (
    <span className={[styles.icon, styles[variant], className].filter(Boolean).join(' ')} aria-hidden="true">
      <span className={styles.grain} />
      <Image src={glyph.src} alt="" width={glyph.width} height={glyph.height} className={styles.glyph} />
    </span>
  )
}

export default StatusIcon
