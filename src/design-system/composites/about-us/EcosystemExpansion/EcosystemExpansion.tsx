import { useEffect, useRef } from 'react'
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

// orbit radius = half of the 860px canvas
const ORBIT_RADIUS = 430

// Compute left/top pixel offset for a module node centred on the orbit boundary
function getModulePosition(angleDeg: number): { left: string; top: string } {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  const x = ORBIT_RADIUS + ORBIT_RADIUS * Math.cos(rad)
  const y = ORBIT_RADIUS + ORBIT_RADIUS * Math.sin(rad)
  return { left: `${x}px`, top: `${y}px` }
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
        <div className={styles.canvas} ref={canvasRef}>

          {/* Soft blue radial glow — parallax layer */}
          <div className={styles.glow} ref={glowRef} aria-hidden="true" />

          {/* Concentric ring outlines — parallax layer */}
          <div className={styles.rings} ref={ringsRef} aria-hidden="true">
            <div className={styles.ring} />
            <div className={styles.ring} />
            <div className={styles.ring} />
            <div className={styles.ring} />
          </div>

          {/* Dot grid centred behind the text — parallax counter-layer */}
          <div className={styles.dotGrid} ref={dotGridRef} aria-hidden="true" />

          {/* Orbit ring — this entire div rotates via GSAP; each child counter-rotates */}
          <div className={styles.orbit} ref={orbitRef} aria-hidden="true">
            {MODULES.map((mod, i) => {
              const pos = getModulePosition(mod.angleDeg)
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

          {/* Center text block — never rotates, sits above everything */}
          <div className={styles.center}>
            <div className={styles.centerContent}>
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
            </div>

            <p className={styles.description} ref={descriptionRef}>
              We are building the complete on-chain ecosystem where your identity is the foundation of everything
              you do online. Every tool you use today on the internet, rebuilt natively on-chain, owned by you,
              powered by your Identity.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: stacked module list shown below the circle on small screens */}
      <nav className={styles.mobileModules} aria-label="Ecosystem apps">
        {MODULES.map(mod => (
          <div key={mod.id} className={styles.mobileModule}>
            <div className={styles.mobileModuleLabelRow}>
              <div className={styles.moduleIcon}>
                <div className={styles.moduleIconGradient} />
                <div className={styles.moduleIconInner}>
                  <mod.Icon aria-label={mod.iconLabel} className={styles.moduleIconImg} />
                </div>
              </div>
              <p className={styles.mobileModuleName}>{mod.name}</p>
            </div>
            <p className={styles.mobileModuleDesc}>{mod.description}</p>
          </div>
        ))}
      </nav>
    </section>
  )
}

export default EcosystemExpansion
