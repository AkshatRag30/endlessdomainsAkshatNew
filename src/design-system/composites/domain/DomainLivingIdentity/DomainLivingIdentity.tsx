import React, { useEffect, useRef, useState } from 'react'
import { PiLockKeyBold, PiWalletBold } from 'react-icons/pi'

import { ACTIVITY_PAUSE_RANGE, ACTIVITY_ROWS, ORBIT_NODES } from './DomainLivingIdentityData'
import styles from './DomainLivingIdentity.module.scss'

function randomInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min))
}

export function DomainLivingIdentity() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeRow, setActiveRow] = useState(0)
  // Bumped once per activity event — used as a React `key` on the one-shot pulse/glow/
  // node-flash elements so each remounts and replays its animation from scratch, with no
  // manual timeout bookkeeping needed to reset a "just pulsed" boolean.
  const [eventTick, setEventTick] = useState(0)

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

  // The activity feed's continuous loop (requirement: "CONTINUOUS LOOP" / "ACTIVITY EVENT
  // TIMING") — irregular pauses, not a fixed setInterval, and it only runs while the
  // section is actually in view.
  useEffect(() => {
    if (!active || reducedMotion) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    function advance() {
      if (cancelled) return
      setActiveRow(r => (r + 1) % ACTIVITY_ROWS.length)
      setEventTick(t => t + 1)
      timer = setTimeout(advance, randomInt(ACTIVITY_PAUSE_RANGE[0], ACTIVITY_PAUSE_RANGE[1]))
    }

    timer = setTimeout(advance, randomInt(ACTIVITY_PAUSE_RANGE[0], ACTIVITY_PAUSE_RANGE[1]))
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [active, reducedMotion])

  const activeNodeIndex = eventTick % ORBIT_NODES.length

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
          <span className={styles.networkRing} data-ring="outer" />
          <span className={styles.networkRing} data-ring="mid" />
          <span className={styles.networkRing} data-ring="inner" />

          {ORBIT_NODES.map((node, i) => (
            <div
              key={node.id}
              className={styles.orbitSlot}
              style={{ '--base-angle': `${node.angle}deg`, '--sway-duration': `${node.swayDuration}s` } as React.CSSProperties}
            >
              <div className={styles.orbitArm} style={{ '--breathe-duration': `${node.breatheDuration}s` } as React.CSSProperties}>
                <span className={styles.orbitNode}>
                  {node.label}
                  {i === activeNodeIndex && <span className={styles.orbitNodeFlash} key={eventTick} />}
                </span>
              </div>
            </div>
          ))}

          <div className={styles.identityCore}>
            <span className={styles.identityCoreCaption}>Active domain today</span>
            <span className={styles.identityCoreGlow} />
            <PiLockKeyBold className={styles.identityCoreIcon} />
          </div>
        </div>

        {/* ── Middle: connector + identity core bridge ──────────────────── */}
        <div className={styles.bridge} aria-hidden="true">
          <div className={styles.connector}>
            {/* Continuous ambient flow — independent of the activity feed (requirement:
                "data pulses happen independently"). */}
            <span className={styles.connectorPulseAmbient} />
          </div>

          <div className={styles.core} key={`core-${eventTick}`}>
            <span className={styles.coreGlowFlash} />
            <PiWalletBold className={styles.coreIcon} />
          </div>

          <div className={styles.connector}>
            {/* Fires exactly once per activity event via the remount key — the visible
                "identity → activity" causality the brief calls the most important beat. */}
            <span className={styles.connectorPulseEvent} key={`pulse-${eventTick}`} />
          </div>
        </div>

        {/* ── Right: living identity activity panel ──────────────────────── */}
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

          <div className={styles.activityList} role="list">
            {ACTIVITY_ROWS.map((row, i) => {
              const Icon = row.Icon
              const isActive = i === activeRow
              return (
                <div className={styles.activityRow} data-active={isActive || undefined} role="listitem" key={row.id}>
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
    </section>
  )
}

export default DomainLivingIdentity
