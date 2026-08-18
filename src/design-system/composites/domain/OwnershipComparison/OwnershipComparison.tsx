import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  PiKeyBold,
  PiFingerprintBold,
  PiUserCircleBold,
  PiStackBold,
  PiLockKeyOpenBold,
  PiWalletBold,
  PiPlugsConnectedBold,
  PiInfinityBold,
} from 'react-icons/pi'

import { createProgressController, STATE_COUNT } from './OwnershipComparisonAnimation'
import styles from './OwnershipComparison.module.scss'

interface ComparisonCardCopy {
  id: string
  label: string
  headline: string
  desc: string
  Icon: typeof PiKeyBold
}

interface ComparisonState {
  id: string
  left: ComparisonCardCopy
  right: ComparisonCardCopy
}

const STATES: ComparisonState[] = [
  {
    id: 'problem',
    left: {
      id: 'renting',
      label: 'Renting',
      headline: "Your identity is still on someone else's terms.",
      desc: "Most digital identities live inside platforms you don't truly control. Access, portability and value remain tied to the platform.",
      Icon: PiKeyBold,
    },
    right: {
      id: 'old-model',
      label: 'The Old Model',
      headline: "You use an identity. You don't own it.",
      desc: 'Platforms decide how your identity works, where it can be used and what happens when you leave.',
      Icon: PiLockKeyOpenBold,
    },
  },
  {
    id: 'shift',
    left: {
      id: 'ownership',
      label: 'Ownership',
      headline: 'Your identity should belong to you.',
      desc: 'Web3 changes the model by making identity something you can actually own, hold in your wallet and carry across the ecosystem.',
      Icon: PiFingerprintBold,
    },
    right: {
      id: 'on-chain',
      label: 'On-Chain',
      headline: 'One identity. Held by your wallet.',
      desc: 'Your identity becomes a blockchain-owned asset instead of another account locked inside a platform.',
      Icon: PiWalletBold,
    },
  },
  {
    id: 'utility',
    left: {
      id: 'one-identity',
      label: 'One Identity',
      headline: 'Use one identity everywhere.',
      desc: 'Turn a human-readable domain into a persistent identity for payments, applications, communities and the on-chain ecosystem.',
      Icon: PiUserCircleBold,
    },
    right: {
      id: 'utility',
      label: 'Utility',
      headline: 'Ownership is only the beginning.',
      desc: 'Your identity can connect to wallets, dApps, profiles, reputation and future on-chain experiences.',
      Icon: PiPlugsConnectedBold,
    },
  },
  {
    id: 'future',
    left: {
      id: 'identity-os',
      label: 'Identity OS',
      headline: 'Build something that grows with you.',
      desc: 'Your identity becomes a foundation for reputation, ownership, discovery, earning and everything you build on-chain.',
      Icon: PiStackBold,
    },
    right: {
      id: 'endless-domains',
      label: 'Endless Domains',
      headline: 'One identity. Everything it unlocks.',
      desc: 'Own your identity once. Carry it across chains, platforms and experiences as the Web3 ecosystem evolves.',
      Icon: PiInfinityBold,
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

          <div className={styles.connectorBeam} aria-hidden="true" />

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
