import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { createProgressController, STATE_COUNT } from './OwnershipComparisonAnimation'
import styles from './OwnershipComparison.module.scss'

const ICON_DIR = '/landing/ownership%20comparision%20icons'

// The 8 card icons are static SVG assets rather than react-icons components, so this
// wraps each one in a component with the same size-driven API the cards already call
// (<state.left.Icon size={18} />), instead of reshaping the card-rendering JSX for them.
function svgIcon(fileName: string): React.ComponentType<{ size?: number }> {
  function SvgIcon({ size = 18 }: { size?: number }) {
    return <Image src={`${ICON_DIR}/${fileName}`} alt="" width={size} height={size} unoptimized style={{ display: 'block' }} />
  }
  return SvgIcon
}

export interface ComparisonCardCopy {
  id: string
  label: string
  headline: string
  desc: string
  Icon: React.ComponentType<{ size?: number }>
}

interface ComparisonState {
  id: string
  left: ComparisonCardCopy
  right: ComparisonCardCopy
}

export const STATES: ComparisonState[] = [
  {
    id: 'identity',
    left: {
      id: 'own-identity',
      label: 'Renting',
      headline: 'They Own Your Identity',
      desc: "Your email, social media, and payment accounts live on their servers. You're just a tenant paying with your data.",
      Icon: svgIcon('Vector-1.svg'),
    },
    right: {
      id: 'no-one-can-take-it',
      label: 'Ownership',
      headline: 'No One Can Take It Away',
      desc: 'Not a company, not a government. Mint it once and it stays yours for life.',
      Icon: svgIcon('fi_9065181.svg'),
    },
  },
  {
    id: 'banning',
    left: {
      id: 'delete-overnight',
      label: 'Renting',
      headline: 'They Can Delete You Overnight',
      desc: 'Suspended or banned with no appeal. It happens to people every day.',
      Icon: svgIcon('Vector.svg'),
    },
    right: {
      id: 'never-banned',
      label: 'Ownership',
      headline: 'You Can Never Be Banned Or Deleted',
      desc: 'There is no account to suspend. Your name lives on-chain, not on their servers.',
      Icon: svgIcon('fi_2354573.svg'),
    },
  },
  {
    id: 'access',
    left: {
      id: 'access-revoked',
      label: 'Renting',
      headline: 'Access Can Be Revoked Anytime',
      desc: 'One policy change or takedown and your login simply stops working.',
      Icon: svgIcon('fi_7214281.svg'),
    },
    right: {
      id: 'data-stays',
      label: 'Ownership',
      headline: 'Your Data Stays With You',
      desc: 'You decide what to share and who sees it. Nothing is sold behind your back.',
      Icon: svgIcon('fi_10536486.svg'),
    },
  },
  {
    id: 'reputation',
    left: {
      id: 'reputation-trapped',
      label: 'Renting',
      headline: 'Your Reputation Is Trapped',
      desc: 'Years of followers and history vanish the moment you leave, or they push you out.',
      Icon: svgIcon('fi_7852774.svg'),
    },
    right: {
      id: 'reputation-yours',
      label: 'Ownership',
      headline: 'Your Reputation Is Permanently Yours',
      desc: 'Your followers, history, and trust move with you. No platform holding them hostage.',
      Icon: svgIcon('fi_879169.svg'),
    },
  },
]

function CardCorners() {
  return (
    <>
      <span className={styles.cardCornerTl} aria-hidden="true" />
      <span className={styles.cardCornerTr} aria-hidden="true" />
      <span className={styles.cardCornerBl} aria-hidden="true" />
      <span className={styles.cardCornerBr} aria-hidden="true" />
    </>
  )
}

export function OwnershipComparison() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftCardRefs = useRef<(HTMLElement | null)[]>([])
  const rightCardRefs = useRef<(HTMLElement | null)[]>([])
  const centerFrameRef = useRef<HTMLDivElement>(null)
  const centerGlowRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)

  const controllerRef = useRef<ReturnType<typeof createProgressController> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cleanup: (() => void) | undefined

    import('gsap').then(({ gsap }) => {
      if (!sectionRef.current) return
      const controller = createProgressController(gsap, {
        sectionEl: sectionRef.current,
        refs: {
          leftCards: leftCardRefs.current,
          rightCards: rightCardRefs.current,
          centerFrame: centerFrameRef.current,
          centerGlow: centerGlowRef.current,
          thumb: thumbRef.current,
          track: trackRef.current,
        },
        reducedMotion,
        onActiveIndexChange: setActiveIndex,
      })
      controllerRef.current = controller
      cleanup = controller.destroy
    })

    return () => cleanup?.()
  }, [])

  const handleThumbPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    const controller = controllerRef.current
    if (!controller) return
    controller.setDragging(true)
    // Imperative body-level lock for the duration of the drag only — not a component
    // inline style, and reverted the moment the pointer is released or cancelled.
    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    controller.setProgressFromPointer(e.clientX)
  }, [])

  const handleThumbPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0) return
    controllerRef.current?.setProgressFromPointer(e.clientX)
  }, [])

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    controllerRef.current?.setDragging(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    if ((e.target as HTMLElement).hasPointerCapture?.(e.pointerId)) {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    }
  }, [])

  const handleTrackPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target === thumbRef.current) return
    controllerRef.current?.setProgressFromPointer(e.clientX)
  }, [])

  const handleThumbKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      controllerRef.current?.stepProgress(1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      controllerRef.current?.stepProgress(-1)
    }
  }, [])

  return (
    <section className={styles.section} ref={sectionRef} aria-labelledby="ownership-compare-heading">
      <h2 id="ownership-compare-heading" className={styles.srHeading}>
        Renting an identity versus owning one
      </h2>

      <div className={styles.sticky}>
        <div className={styles.stage}>
          <div className={styles.ambientGlowLeft} aria-hidden="true" />
          <div className={styles.ambientGlowRight} aria-hidden="true" />
          <div className={styles.centerLine} aria-hidden="true" />

          <div className={styles.headerRow}>
            <div className={styles.headerBlock}>
              <span className={`${styles.badge} ${styles.badgeDark}`}>Today&apos;s Platforms &middot; You Rent</span>
              <p className={styles.headerHeadline}>Theirs. On rent.</p>
            </div>
            <div className={styles.headerBlock}>
              <span className={`${styles.badge} ${styles.badgeBlue}`}>Endless &middot; You Own It</span>
              <p className={styles.headerHeadline}>Yours. Forever.</p>
            </div>
          </div>

          <div className={styles.body}>
            <div className={styles.cardColumn} data-side="left">
              {STATES.map((state, i) => (
                <article
                  key={state.left.id}
                  className={styles.card}
                  data-active={activeIndex === i || undefined}
                  ref={el => {
                    leftCardRefs.current[i] = el
                  }}
                >
                  <CardCorners />
                  <span className={styles.cardEyebrow}>{state.left.label}</span>
                  <div className={styles.cardHeadRow}>
                    <span className={styles.cardIconBadge} aria-hidden="true">
                      <state.left.Icon size={18} />
                    </span>
                    <h3 className={styles.cardHeadline}>{state.left.headline}</h3>
                  </div>
                  <p className={styles.cardDesc}>{state.left.desc}</p>
                </article>
              ))}
            </div>

            <div className={styles.core}>
              <div className={styles.coreGlow} ref={centerGlowRef} aria-hidden="true" />
              <div className={styles.coreRings} aria-hidden="true">
                <span className={`${styles.coreRing} ${styles.coreRingOuter}`} />
                <span className={`${styles.coreRing} ${styles.coreRingMid}`} />
                <span className={`${styles.coreRing} ${styles.coreRingInner}`} />
              </div>
              <div className={styles.coreFrame} ref={centerFrameRef}>
                <Image
                  src="/landing/centerlogo.svg"
                  alt="Endless Domains identity mark"
                  width={300}
                  height={300}
                  className={styles.coreLogo}
                  unoptimized
                />
              </div>
            </div>

            <div className={styles.cardColumn} data-side="right">
              {STATES.map((state, i) => (
                <article
                  key={state.right.id}
                  className={styles.card}
                  data-active={activeIndex === i || undefined}
                  ref={el => {
                    rightCardRefs.current[i] = el
                  }}
                >
                  <CardCorners />
                  <span className={styles.cardEyebrow}>{state.right.label}</span>
                  <div className={styles.cardHeadRow}>
                    <span className={styles.cardIconBadge} aria-hidden="true">
                      <state.right.Icon size={18} />
                    </span>
                    <h3 className={styles.cardHeadline}>{state.right.headline}</h3>
                  </div>
                  <p className={styles.cardDesc}>{state.right.desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.scrollbarWrap}>
            <div className={styles.scrollbarTrack} ref={trackRef} onPointerDown={handleTrackPointerDown}>
              <Image src="/landing/customscroll.svg" alt="" width={336} height={40} className={styles.scrollbarBg} unoptimized />
              <div
                className={styles.scrollbarThumb}
                ref={thumbRef}
                role="slider"
                aria-orientation="horizontal"
                aria-label="Ownership story progress"
                aria-valuemin={0}
                aria-valuemax={STATE_COUNT - 1}
                aria-valuenow={activeIndex}
                aria-valuetext={STATES[activeIndex]?.id}
                tabIndex={0}
                onPointerDown={handleThumbPointerDown}
                onPointerMove={handleThumbPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={handleThumbKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OwnershipComparison
