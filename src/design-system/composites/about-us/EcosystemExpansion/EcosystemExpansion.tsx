import { useEffect, useRef, useState } from 'react'
import type { RefObject, ComponentType } from 'react'
import { HiOutlineMail, HiOutlineChatAlt2, HiOutlineUserGroup, HiOutlineGlobe } from 'react-icons/hi'

import {
  runOrbitRotation,
  runCounterRotation,
  bindEcosystemParallax,
  runEcosystemEntrance,
} from './EcosystemExpansionAnimation'
import styles from './EcosystemExpansion.module.scss'

// ── Module data ───────────────────────────────────────────────────────────────
// angleDeg: degrees from top (0° = 12 o'clock), clockwise

interface EcosystemModule {
  id: string
  name: string
  description: string
  Icon: ComponentType<{ className?: string; 'aria-label'?: string }>
  iconLabel: string
  angleDeg: number
}

const MODULES: EcosystemModule[] = [
  {
    id: 'dMail',
    name: 'dMail',
    description: 'On-chain email. No server. No platform. Your inbox, owned by you.',
    Icon: HiOutlineMail,
    iconLabel: 'Mail',
    angleDeg: 315, // top-left — matches Figma dMail position
  },
  {
    id: 'dChat',
    name: 'dChat',
    description: 'Wallet-to-wallet messaging. Identity-native. No middleman.',
    Icon: HiOutlineChatAlt2,
    iconLabel: 'Chat',
    angleDeg: 45, // top-right — matches Figma dChat position
  },
  {
    id: 'dSocial',
    name: 'dSocial',
    description: 'Your social graph lives on-chain. You own your followers, your content, your reach.',
    Icon: HiOutlineUserGroup,
    iconLabel: 'Social',
    angleDeg: 225, // bottom-left — matches Figma dSocial position
  },
  {
    id: 'andMore',
    name: 'And More',
    description: 'The ecosystem grows as builders plug into the OS. Every new app makes every identity more powerful.',
    Icon: HiOutlineGlobe,
    iconLabel: 'More',
    angleDeg: 135, // bottom-right — matches Figma And More position
  },
]

// CARD_BLEED: how far a card extends outward from its orbit-edge center point.
// Canvas = orbitRadius * 2. Cards are positioned at orbitRadius from canvas center,
// then extend CARD_BLEED further — so the total visual radius is orbitRadius + CARD_BLEED.
// We use overflow:visible on canvas and account for this in orbitColWidth below.
const CARD_BLEED = 160

// Compute left/top pixel offset for a module node centred on the orbit boundary
function getModulePosition(angleDeg: number, orbitRadius: number): { left: string; top: string } {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  const x = orbitRadius + orbitRadius * Math.cos(rad)
  const y = orbitRadius + orbitRadius * Math.sin(rad)
  return { left: `${x}px`, top: `${y}px` }
}

// Orbit radius at each breakpoint — sized so the full visual (orbit + card bleed)
// fits within the available right-column space at that viewport width.
// Available right space ≈ viewport - left padding - right padding - textCol - gap.
// textCol ≈ 480px on desktop, gap ≈ 64-120px, padding ≈ 80px each side.
// Total visual diameter = (orbitRadius + CARD_BLEED) * 2 must fit available space.
function getOrbitRadius(): number {
  if (typeof window === 'undefined') return 200
  const vw = window.innerWidth
  if (vw <= 767) return 120   // mobile — stacked
  if (vw <= 991) return 160   // tablet — stacked
  if (vw <= 1100) return 130  // 1100px: tight two-col
  if (vw <= 1280) return 150  // 1280px laptop
  return 200                  // 1440px+ monitor
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EcosystemExpansion() {
  const orbitRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const ringsRef = useRef<HTMLDivElement>(null)
  const dotGridRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])

  const [orbitRadius, setOrbitRadius] = useState(280)

  useEffect(() => {
    const updateRadius = () => setOrbitRadius(getOrbitRadius())
    updateRadius()
    window.addEventListener('resize', updateRadius)
    return () => window.removeEventListener('resize', updateRadius)
  }, [])

  useEffect(() => {
    let cleanupParallax: (() => void) | undefined

    const init = async () => {
      const { gsap } = await import('gsap')

      runOrbitRotation(gsap, orbitRef.current)
      runCounterRotation(gsap, labelRefs.current)
      runEcosystemEntrance(gsap, {
        eyebrow: eyebrowRef as RefObject<HTMLElement>,
        heading: headingRef as RefObject<HTMLElement>,
        description: descriptionRef as RefObject<HTMLElement>,
        ring: canvasRef as RefObject<HTMLElement>,
      })
      cleanupParallax = bindEcosystemParallax(gsap, {
        glow: glowRef as RefObject<HTMLElement>,
        rings: ringsRef as RefObject<HTMLElement>,
        dotGrid: dotGridRef as RefObject<HTMLElement>,
      })
    }

    init()
    return () => { cleanupParallax?.() }
  }, [])

  return (
    <section className={styles.section} aria-label="Ecosystem Expansion">
      <div className={styles.stage}>

        {/* Left column — text content */}
        <div className={styles.textCol}>
          <div className={styles.eyebrow} ref={eyebrowRef}>
            <span className={styles.eyebrowBracketTL} aria-hidden="true" />
            <span className={styles.eyebrowBracketTR} aria-hidden="true" />
            <span className={styles.eyebrowBracketBL} aria-hidden="true" />
            <span className={styles.eyebrowBracketBR} aria-hidden="true" />
            <span className={styles.eyebrowText}>What Comes Next</span>
          </div>

          <div ref={headingRef}>
            <h2 className={styles.heading}>Ecosystem Expansion.</h2>
            <span className={styles.headingGradient}>Own the Internet. Stop Renting It.</span>
          </div>

          <p className={styles.description} ref={descriptionRef}>
            We are building the complete on-chain ecosystem where your identity is the foundation of everything
            you do online. Every tool you use today on the internet, rebuilt natively on-chain, owned by you,
            powered by your Identity.
          </p>
        </div>

        {/* Right column — circular orbit visual (desktop/tablet only) */}
        <div className={styles.orbitCol}>
          {/* GSAP writes inline width/height for animation — narrow exception (animation library) */}
          <div className={styles.canvas} ref={canvasRef} style={{ width: orbitRadius * 2, height: orbitRadius * 2 }}>

            {/* Soft blue radial glow — parallax layer */}
            <div className={styles.glow} ref={glowRef} aria-hidden="true" />

            {/* Concentric ring outlines — parallax layer */}
            <div className={styles.rings} ref={ringsRef} aria-hidden="true">
              <div className={styles.ring} />
              <div className={styles.ring} />
              <div className={styles.ring} />
              <div className={styles.ring} />
            </div>

            {/* Dot grid centred behind the rings — parallax counter-layer */}
            <div className={styles.dotGrid} ref={dotGridRef} aria-hidden="true" />

            {/* Orbit ring — this entire div rotates via GSAP; each child counter-rotates */}
            <div className={styles.orbit} ref={orbitRef} aria-hidden="true">
              {MODULES.map((mod, i) => {
                const pos = getModulePosition(mod.angleDeg, orbitRadius)
                return (
                  <div
                    key={mod.id}
                    className={styles.moduleNode}
                    // GSAP writes inline transform for rotation — narrow exception (animation library)
                    style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
                    ref={el => { labelRefs.current[i] = el }}
                  >
                    <div className={styles.moduleLabelRow}>
                      <div className={styles.moduleIcon}>
                        <div className={styles.moduleIconGradient} />
                        <div className={styles.moduleIconInner}>
                          <mod.Icon aria-label={mod.iconLabel} className={styles.moduleIconImg} />
                        </div>
                      </div>
                      <p className={styles.moduleName}>{mod.name}</p>
                    </div>
                    <p className={styles.moduleDesc}>{mod.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile-only stacked cards (orbit hidden on mobile) */}
        <div className={styles.mobileCards}>
          {MODULES.map(mod => (
            <div key={mod.id} className={styles.mobileCard}>
              <div className={styles.moduleLabelRow}>
                <div className={styles.moduleIcon}>
                  <div className={styles.moduleIconGradient} />
                  <div className={styles.moduleIconInner}>
                    <mod.Icon aria-label={mod.iconLabel} className={styles.moduleIconImg} />
                  </div>
                </div>
                <p className={styles.moduleName}>{mod.name}</p>
              </div>
              <p className={styles.moduleDesc}>{mod.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default EcosystemExpansion
