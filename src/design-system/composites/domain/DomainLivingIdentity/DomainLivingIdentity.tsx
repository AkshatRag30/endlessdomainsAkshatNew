import React, { useEffect, useId, useRef, useState } from 'react'
import { PiLockKeyBold, PiWalletBold } from 'react-icons/pi'

import { ACTIVITY_ROWS, ACTIVITY_TICK_INTERVAL_MS, ORBIT_NODES } from './DomainLivingIdentityData'
import styles from './DomainLivingIdentity.module.scss'

// Height of one row in the activity carousel — kept in sync with the fixed row
// height in the stylesheet (.activityRow / .activityViewport) since the slide
// offset below is computed in px from this same number.
const ACTIVITY_ROW_HEIGHT = 64

// The Figma connector art: a straight "spine" plus two S-curves that bow out and
// converge back into it near the hub end — built from the shorter (right) segment
// of the original 474px-wide asset, at local coordinates with the hub at x=0, so it
// can be reused unflipped for the right connector and mirrored (scaleX(-1)) for the
// left one. Gradients use the SVG default objectBoundingBox units, so "0%" always
// lands on each path's own hub-side end regardless of that path's own width —
// solid near the hub, fading out toward the far edge, matching the original intent.
// Not reproduced: the large embedded blurred-ellipse texture and the tiny highlight
// tick mark from the original — decorative extras that don't carry the connector's
// visual identity and would add a large base64 blob for very little payoff.
function BridgeConnectorArt({ flipped }: { flipped?: boolean }) {
  const gradientId = `bridge-connector-${useId().replace(/:/g, '')}`
  return (
    <svg
      className={styles.connectorArt}
      viewBox="0 0 136 35"
      preserveAspectRatio="none"
      style={flipped ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2639ED" />
          <stop offset="100%" stopColor="#2639ED" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 17.4432H136" fill="none" stroke={`url(#${gradientId})`} strokeOpacity="0.4" strokeWidth="4" />
      <path d="M0 17.4432H136" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
      <path
        d="M121 0H86.651C81.215 0 76.107 2.5991 72.908 6.993L70.679 10.0539C67.48 14.4482 62.372 17.0472 56.936 17.0472H0"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeOpacity="0.4"
        strokeWidth="4"
      />
      <path
        d="M121 0H86.651C81.215 0 76.107 2.5991 72.908 6.993L70.679 10.0539C67.48 14.4482 62.372 17.0472 56.936 17.0472H0"
        fill="none"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="3"
      />
      <path
        d="M121 34.4902H86.651C81.215 34.4902 76.107 31.8912 72.908 27.4972L70.679 24.4362C67.48 20.0422 62.372 17.4432 56.936 17.4432H0"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeOpacity="0.4"
        strokeWidth="4"
      />
      <path
        d="M121 34.4902H86.651C81.215 34.4902 76.107 31.8912 72.908 27.4972L70.679 24.4362C67.48 20.0422 62.372 17.4432 56.936 17.4432H0"
        fill="none"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="3"
      />
      {/* A bright highlight duplicate of the same three lines, clipped down to a
          narrow band by the CSS mask sweep in .connectorGlow — the line itself
          appears to glow as that band travels across it, left to right. Reversed
          for the flipped (left) connector so the sweep still reads left-to-right
          on screen after the scaleX(-1) mirror, instead of right-to-left. */}
      <g className={styles.connectorGlow} style={{ animationDirection: flipped ? 'reverse' : 'normal' }}>
        <path d="M0 17.4432H136" fill="none" stroke="white" strokeWidth="3" />
        <path
          d="M121 0H86.651C81.215 0 76.107 2.5991 72.908 6.993L70.679 10.0539C67.48 14.4482 62.372 17.0472 56.936 17.0472H0"
          fill="none"
          stroke="white"
          strokeWidth="3"
        />
        <path
          d="M121 34.4902H86.651C81.215 34.4902 76.107 31.8912 72.908 27.4972L70.679 24.4362C67.48 20.0422 62.372 17.4432 56.936 17.4432H0"
          fill="none"
          stroke="white"
          strokeWidth="3"
        />
      </g>
    </svg>
  )
}

export function DomainLivingIdentity() {
  // useId()'s colons break as an SVG href="#..." fragment reference, so strip them.
  const captionPathId = `caption-circle-${useId().replace(/:/g, '')}`
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  // Single source of truth for the whole system: which activity row is highlighted,
  // which orbit node flashes, and how far the ring has rotated all derive from this one
  // counter, so they can never drift out of sync with each other.
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => setActive(entry.isIntersecting)), { threshold: 0.25 })
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Ticking-clock rhythm — rotate, stop, rotate, stop, on a fixed beat — and it only
  // runs while the section is actually in view.
  useEffect(() => {
    if (!active || reducedMotion) return
    const timer = setInterval(() => setTick(t => t + 1), ACTIVITY_TICK_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [active, reducedMotion])

  const activeRow = tick % ACTIVITY_ROWS.length
  const activeNodeIndex = tick % ORBIT_NODES.length
  const ringAngle = tick * (360 / ORBIT_NODES.length)
  const ActiveIcon = ACTIVITY_ROWS[activeRow].Icon

  return (
    <section className={styles.section} ref={sectionRef} data-active={(active && !reducedMotion) || undefined} aria-labelledby="living-identity-heading">
      <div className={styles.header}>
        <div className={styles.eyebrowWrap}>
          <span className={styles.eyebrowBracketTL} />
          <span className={styles.eyebrowBracketTR} />
          <span className={styles.eyebrowBracketBL} />
          <span className={styles.eyebrowBracketBR} />
          <p className={styles.eyebrowText}>Bringing Identities to Life</p>
        </div>

        <h2 id="living-identity-heading" className={styles.heading}>
          <span className={styles.headingLine1}>Millions Sit Dormant.</span>
          <span className={styles.headingLine2}>We&apos;re Making Them Come Alive</span>
        </h2>

        <p className={styles.description}>
          Most domains are minted then forgotten, an identity gathering dust. We wrap every wallet-linked domain in a living ecosystem so your identity earns,
          activates, and builds reputation on its own.
        </p>
      </div>

      <div className={styles.system}>
        {/* ── Left: identity network ─────────────────────────────────────── */}
        <div className={styles.network} aria-hidden="true">
          <span className={styles.networkHalo} />
          <span className={styles.networkRing} />
          <span className={styles.networkRingInner} />

          {/* Rotates the whole set of nodes one step per tick — the "og icons rotate one
              by one" ring turn. Each .orbitNode counter-rotates by the same amount (see
              the stylesheet) so the ".og" labels stay upright as the ring turns. */}
          <div className={styles.orbitRing} style={{ '--ring-angle': `${ringAngle}deg` } as React.CSSProperties}>
            {ORBIT_NODES.map((node, i) => (
              <div
                key={node.id}
                className={styles.orbitSlot}
                style={{ '--base-angle': `${node.angle}deg`, '--sway-duration': `${node.swayDuration}s` } as React.CSSProperties}
              >
                <div className={styles.orbitArm} style={{ '--breathe-duration': `${node.breatheDuration}s` } as React.CSSProperties}>
                  <span className={styles.orbitNode}>
                    {node.label}
                    {i === activeNodeIndex && <span className={styles.orbitNodeFlash} key={tick} />}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Curved along a circle sitting between the lock icon and .networkRingInner
              — an SVG textPath rather than a flat span, so it actually follows that gap
              instead of just sitting flat behind the lock. Sized off .network (380px),
              not .identityCore, so the circle is the right diameter. */}
          <svg className={styles.identityCoreCaption} viewBox="0 0 380 380" aria-hidden="true">
            <path id={captionPathId} d="M 190 268 A 78 78 0 1 1 190 112 A 78 78 0 1 1 190 268" fill="none" />
            <text>
              <textPath href={`#${captionPathId}`} startOffset="50%" textAnchor="middle">
                inactive domains today
              </textPath>
            </text>
          </svg>

          <div className={styles.identityCore}>
            <span className={styles.identityCoreGlow} />
            <PiLockKeyBold className={styles.identityCoreIcon} />
          </div>
        </div>

        {/* ── Middle: connector + identity core bridge ──────────────────── */}
        <div className={styles.bridge} aria-hidden="true">
          <div className={styles.connector}>
            {/* Hub end faces right, toward .core — flipped since the art's hub is
                built at local x=0 (its left edge). */}
            <BridgeConnectorArt flipped />
          </div>

          <div className={styles.core} key={`core-${tick}`}>
            <span className={styles.coreGlowFlash} />
            {/* Mirrors whichever activity row is currently active on the right, instead
                of a fixed wallet icon — the "middle icon changes with the side points" ask. */}
            <ActiveIcon className={styles.coreIcon} />
          </div>

          <div className={styles.connector}>
            {/* Hub end faces left, toward .core — matches the art's built-in orientation. */}
            <BridgeConnectorArt />
          </div>
        </div>

        {/* ── Right: living identity activity panel ──────────────────────── */}
        <div className={styles.panelWrap}>
          <img className={styles.panelBg} src="/landing/wallet-bg.svg" alt="" aria-hidden="true" />
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelHeaderIcon}>
                <PiWalletBold />
              </span>
              <div className={styles.panelHeaderText}>
                <p className={styles.panelTitle}>Living identity</p>
                <p className={styles.panelSubtitle}>alex.og &middot; reputation 847 &middot; 3 perks unlocked</p>
              </div>
              <span className={styles.liveBadge}>
                <span className={styles.liveDot} />
                Active &amp; earning
              </span>
            </div>

            {/* A 3-row window onto the activity feed. Every row is always mounted — only
                its slot (-1 above, 0 centered, 1 below, 2 queued off-screen) changes each
                tick — so the CSS transition on transform/opacity animates it sliding
                between those positions instead of popping in and out. */}
            <div className={styles.activityViewport} role="list" aria-label="Recent wallet activity">
              {ACTIVITY_ROWS.map((row, i) => {
                const Icon = row.Icon
                const distance = ((i - activeRow) % ACTIVITY_ROWS.length + ACTIVITY_ROWS.length) % ACTIVITY_ROWS.length
                const slot = distance === ACTIVITY_ROWS.length - 1 ? -1 : distance
                return (
                  <div
                    className={styles.activityRow}
                    data-slot={slot}
                    role="listitem"
                    key={row.id}
                    style={{
                      transform: `translateY(${(slot + 1) * ACTIVITY_ROW_HEIGHT}px) scale(${slot === 0 ? 1.06 : 0.94})`,
                      opacity: slot === 2 ? 0 : slot === 0 ? 1 : 0.55,
                    }}
                  >
                    <span className={styles.activityIcon}>
                      <Icon />
                    </span>
                    <div className={styles.activityText}>
                      <p className={styles.activityTitle}>{row.title}</p>
                      <p className={styles.activityDesc}>{row.desc}</p>
                    </div>
                    <span className={styles.activityValue}>{row.value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DomainLivingIdentity
