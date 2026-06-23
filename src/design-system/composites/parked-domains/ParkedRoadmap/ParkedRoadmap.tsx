import React, { useEffect, useRef } from 'react'
import styles from './ParkedRoadmap.module.scss'

const STEPS = [
  { num: '01', title: 'Log in to Endless Domains', desc: 'Visit endlessdomains.io and sign in to your account.', note: null, above: true },
  { num: '02', title: 'Get your domain', desc: 'Purchase any Web3 domain from $2. Owned permanently with no renewals. If you already have one, go straight to My Domains.', note: '( Skip if you own one )', above: false },
  { num: '03', title: 'Go to My Domains and click Manage', desc: 'Select your domain from the list and open the Manage view.', note: null, above: true },
  { num: '04', title: 'Click Parked Domains then Create', desc: 'Open the Parked Domains tab and click Create to begin setup.', note: null, above: false },
  { num: '05', title: 'Select your template', desc: 'Choose Individual, Influencer, or Business. Each has a purpose-built layout.', note: null, above: true },
  { num: '06', title: 'IPFS link is created', desc: 'The platform handles the IPFS connection automatically. Your domain resolves to your branded page on-chain.', note: '(Automated)', above: false },
  { num: '07', title: 'Your domain is parked and earning', desc: 'Visitors see your branded page with ads. Revenue flows to your wallet. Nothing more to manage.', note: null, above: true },
]

const STEP_SLOT = 640
const TRACK_PAD = 120

// design-specific: vertical axis tick dimensions — mirrors the desktop horizontal ruler rotated 90°
const V_TICK_H = 5   // tick height (was tickW on desktop)
const V_TICK_W = 16  // tick width  (was tickH on desktop)
const V_GAP    = 3   // gap between ticks
const V_RX     = 2

export function ParkedRoadmap() {
  const sectionRef    = useRef<HTMLElement>(null)
  const stickyRef     = useRef<HTMLDivElement>(null)
  const trackWrapRef  = useRef<HTMLDivElement>(null)
  const trackRef      = useRef<HTMLDivElement>(null)
  const headerRef     = useRef<HTMLElement>(null)
  const dividerRef    = useRef<HTMLDivElement>(null)
  const stepsRef      = useRef<HTMLDivElement[]>([])
  const rulerRef      = useRef<SVGSVGElement | null>(null)
  const rulerTicksRef = useRef<SVGRectElement[]>([])

  const headerLeftRef  = useRef<HTMLDivElement>(null)
  const headerRightRef = useRef<HTMLDivElement>(null)

  // mobile vertical axis SVG
  const mobileAxisRef      = useRef<SVGSVGElement | null>(null)
  const mobileAxisWrapRef  = useRef<HTMLDivElement>(null)
  const mobileAxisClipRect = useRef<SVGRectElement | null>(null)
  const mobileAxisTotalH   = useRef(0)
  // cache section bounds so scroll handler never calls getBoundingClientRect
  const mobileSectionTop   = useRef(0)
  const mobileSectionH     = useRef(0)

  // ── Mobile vertical axis builder ────────────────────────────────────────────
  function buildMobileAxis(wrapH: number) {
    if (!mobileAxisWrapRef.current || wrapH <= 0) return
    if (mobileAxisRef.current) mobileAxisRef.current.remove()
    mobileAxisClipRect.current = null

    const wrap   = mobileAxisWrapRef.current
    const count  = Math.ceil(wrapH / (V_TICK_H + V_GAP)) + 4
    mobileAxisTotalH.current = wrapH
    const svgNS  = 'http://www.w3.org/2000/svg'
    const svg    = document.createElementNS(svgNS, 'svg') as SVGSVGElement

    svg.setAttribute('width',  String(V_TICK_W))
    svg.setAttribute('height', String(wrapH))
    svg.style.cssText = 'position:absolute;top:0;left:50%;transform:translateX(-50%);pointer-events:none;overflow:hidden;z-index:1;'

    const defs = document.createElementNS(svgNS, 'defs')

    // Dim gradient
    const gDim = document.createElementNS(svgNS, 'linearGradient')
    gDim.setAttribute('id', 'vGradDim'); gDim.setAttribute('x1', '0%'); gDim.setAttribute('y1', '0%')
    gDim.setAttribute('x2', '0%'); gDim.setAttribute('y2', '100%')
    ;[['0%', 'rgba(38,57,237,0.35)'], ['100%', 'rgba(38,57,237,0.15)']].forEach(([off, col]) => {
      const s = document.createElementNS(svgNS, 'stop')
      s.setAttribute('offset', off); s.setAttribute('stop-color', col); gDim.appendChild(s)
    })

    // Lit gradient
    const gLit = document.createElementNS(svgNS, 'linearGradient')
    gLit.setAttribute('id', 'vGradLit'); gLit.setAttribute('x1', '0%'); gLit.setAttribute('y1', '0%')
    gLit.setAttribute('x2', '0%'); gLit.setAttribute('y2', '100%')
    ;[['0%', 'rgba(38,57,237,0.8)'], ['100%', 'rgba(38,57,237,0.55)']].forEach(([off, col]) => {
      const s = document.createElementNS(svgNS, 'stop')
      s.setAttribute('offset', off); s.setAttribute('stop-color', col); gLit.appendChild(s)
    })

    // Clip path — single rect, height updated O(1) per scroll event
    const clip = document.createElementNS(svgNS, 'clipPath')
    clip.setAttribute('id', 'vClip')
    const cr = document.createElementNS(svgNS, 'rect') as SVGRectElement
    cr.setAttribute('x', '0'); cr.setAttribute('y', '0')
    cr.setAttribute('width', String(V_TICK_W)); cr.setAttribute('height', '0')
    clip.appendChild(cr)
    mobileAxisClipRect.current = cr

    defs.appendChild(gDim); defs.appendChild(gLit); defs.appendChild(clip)
    svg.appendChild(defs)

    // Dim tick layer
    const dimGroup = document.createElementNS(svgNS, 'g')
    for (let i = 0; i < count; i++) {
      const r = document.createElementNS(svgNS, 'rect') as SVGRectElement
      r.setAttribute('x', '0'); r.setAttribute('y', String(i * (V_TICK_H + V_GAP)))
      r.setAttribute('width', String(V_TICK_W)); r.setAttribute('height', String(V_TICK_H))
      r.setAttribute('rx', String(V_RX)); r.setAttribute('fill', 'url(#vGradDim)')
      dimGroup.appendChild(r)
    }

    // Lit tick layer clipped to progress height
    const litGroup = document.createElementNS(svgNS, 'g')
    litGroup.setAttribute('clip-path', 'url(#vClip)')
    for (let i = 0; i < count; i++) {
      const r = document.createElementNS(svgNS, 'rect') as SVGRectElement
      r.setAttribute('x', '0'); r.setAttribute('y', String(i * (V_TICK_H + V_GAP)))
      r.setAttribute('width', String(V_TICK_W)); r.setAttribute('height', String(V_TICK_H))
      r.setAttribute('rx', String(V_RX)); r.setAttribute('fill', 'url(#vGradLit)')
      litGroup.appendChild(r)
    }

    svg.appendChild(dimGroup)
    svg.appendChild(litGroup)
    wrap.appendChild(svg)
    mobileAxisRef.current = svg

    // Cache section bounds now (avoid getBoundingClientRect in the scroll handler)
    const section = sectionRef.current
    if (section) {
      const rect = section.getBoundingClientRect()
      mobileSectionTop.current = window.scrollY + rect.top
      mobileSectionH.current   = section.offsetHeight
    }
  }

  // O(1): only one setAttribute call per scroll event
  function updateMobileAxisProgress() {
    const cr = mobileAxisClipRect.current
    if (!cr) return
    const sectionTop = mobileSectionTop.current
    const sectionH   = mobileSectionH.current
    const p = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / Math.max(1, sectionH - window.innerHeight)))
    cr.setAttribute('height', String(p * mobileAxisTotalH.current))
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const mobile = window.matchMedia('(max-width: 767px)').matches

    // ── Mobile branch — vertical axis + scroll-driven tick animation ──────────
    if (mobile) {
      // Use ResizeObserver on the axis wrap — fires once the element has painted height
      const axisWrap = mobileAxisWrapRef.current
      if (!axisWrap) return

      let lastH = 0
      const ro = new ResizeObserver(entries => {
        const h = entries[0]?.contentRect.height ?? axisWrap.offsetHeight
        if (h > 0 && h !== lastH) {
          lastH = h
          buildMobileAxis(h)
          updateMobileAxisProgress()
        }
      })
      ro.observe(axisWrap)

      // Also build immediately if height is already available
      const h = axisWrap.offsetHeight
      if (h > 0) { lastH = h; buildMobileAxis(h); updateMobileAxisProgress() }

      const onScroll = () => updateMobileAxisProgress()
      window.addEventListener('scroll', onScroll, { passive: true })

      return () => {
        ro.disconnect()
        window.removeEventListener('scroll', onScroll)
        if (mobileAxisRef.current) { mobileAxisRef.current.remove(); mobileAxisRef.current = null }
      }
    }

    // ── Desktop branch — Lenis scroll listener, no ScrollTrigger ─────────────────
    // ScrollTrigger scrub + scrollerProxy caused progress inconsistencies on reverse.
    // Reading directly from Lenis scroll position gives exact 1:1 tracking both ways.
    import('gsap').then(({ gsap }) => {
      const section     = sectionRef.current!
      const trackWrap   = trackWrapRef.current!
      const track       = trackRef.current!
      const headerLeft  = headerLeftRef.current!
      const headerRight = headerRightRef.current!

      const INTRO_DISTANCE = window.innerHeight * 0.6

      function scrollDist() {
        return Math.max(0, TRACK_PAD + 7 * STEP_SLOT - window.innerWidth)
      }

      // ── Horizontal ruler ───────────────────────────────────────────────────
      let rulerClipRect: SVGRectElement | null = null
      let rulerTotalW = 0

      function buildRuler() {
        if (rulerRef.current) rulerRef.current.remove()
        rulerClipRect = null
        const wrapW = window.innerWidth
        rulerTotalW  = wrapW + 20
        const tickW = 5, tickH = 16, gap = 3, rx = 2
        const count = Math.ceil(wrapW / (tickW + gap)) + 4
        const ns    = 'http://www.w3.org/2000/svg'
        const svg   = document.createElementNS(ns, 'svg') as SVGSVGElement
        svg.setAttribute('width', String(rulerTotalW))
        svg.setAttribute('height', String(tickH))
        svg.style.cssText = 'position:absolute;left:0;top:50%;transform:translateY(-50%);pointer-events:none;overflow:visible;z-index:20;'
        const defs = document.createElementNS(ns, 'defs')
        const mkGrad = (id: string, c1: string, c2: string) => {
          const g = document.createElementNS(ns, 'linearGradient')
          g.setAttribute('id', id); g.setAttribute('x1','0%'); g.setAttribute('y1','0%')
          g.setAttribute('x2','100%'); g.setAttribute('y2','0%')
          ;[[0,c1],[100,c2]].forEach(([o,c]) => {
            const s = document.createElementNS(ns,'stop')
            s.setAttribute('offset',`${o}%`); s.setAttribute('stop-color',c as string); g.appendChild(s)
          })
          defs.appendChild(g)
        }
        mkGrad('rDim','rgba(38,57,237,0.35)','rgba(38,57,237,0.15)')
        mkGrad('rLit','rgba(38,57,237,0.75)','rgba(38,57,237,0.5)')
        const clip = document.createElementNS(ns,'clipPath'); clip.setAttribute('id','rClip')
        rulerClipRect = document.createElementNS(ns,'rect') as SVGRectElement
        rulerClipRect.setAttribute('x','0'); rulerClipRect.setAttribute('y','0')
        rulerClipRect.setAttribute('width','0'); rulerClipRect.setAttribute('height',String(tickH))
        clip.appendChild(rulerClipRect); defs.appendChild(clip); svg.appendChild(defs)
        const mkGroup = (fill: string) => {
          const g = document.createElementNS(ns,'g')
          for (let i=0;i<count;i++){
            const r = document.createElementNS(ns,'rect') as SVGRectElement
            r.setAttribute('x',String(i*(tickW+gap))); r.setAttribute('y','0')
            r.setAttribute('width',String(tickW)); r.setAttribute('height',String(tickH))
            r.setAttribute('rx',String(rx)); r.setAttribute('fill',fill); g.appendChild(r)
          }
          return g
        }
        svg.appendChild(mkGroup('url(#rDim)'))
        const litG = mkGroup('url(#rLit)'); litG.setAttribute('clip-path','url(#rClip)'); svg.appendChild(litG)
        trackWrap.appendChild(svg); rulerRef.current = svg
      }

      function updateRuler(p: number) {
        if (rulerClipRect) rulerClipRect.setAttribute('width', String(p * rulerTotalW))
      }

      // Cached layout values — recomputed on resize only
      let cVW    = window.innerWidth
      let cSD    = scrollDist()
      let cTotal = INTRO_DISTANCE + cSD
      let cTop   = 0  // section top in document coordinates

      function cacheSectionTop() {
        cTop = window.scrollY + section.getBoundingClientRect().top
      }

      function setup() {
        cVW    = window.innerWidth
        cSD    = scrollDist()
        cTotal = INTRO_DISTANCE + cSD
        track.style.width        = `${STEP_SLOT * 7 + TRACK_PAD * 2}px`
        track.style.paddingLeft  = `${TRACK_PAD}px`
        track.style.paddingRight = `${TRACK_PAD}px`
        section.style.height     = `${window.innerHeight + cTotal}px`
        gsap.set(track,       { x: cVW })
        gsap.set(trackWrap,   { opacity: 0 })
        gsap.set(headerLeft,  { opacity: 0, y: 60 })
        gsap.set(headerRight, { opacity: 0, y: 60 })
        buildRuler()
        cacheSectionTop()
      }

      function onScroll() {
        // p: raw 0→1 progress through section, computed directly from scroll position
        // No lerp, no proxy — exact same number every call for the same scrollY
        const raw = window.scrollY - cTop
        const p   = Math.max(0, Math.min(1, raw / cTotal))
        const vw  = cVW
        const sd  = cSD

        // Header left — rises in over first 40% of scroll
        const hlt    = Math.max(0, Math.min(1, p / 0.4))
        const hlE    = 1 - Math.pow(1 - hlt, 3)
        gsap.set(headerLeft,  { opacity: hlE, y: 60 * (1 - hlE) })

        // Header right — same, offset by 5%
        const hrt    = Math.max(0, Math.min(1, (p - 0.05) / 0.4))
        const hrE    = 1 - Math.pow(1 - hrt, 3)
        gsap.set(headerRight, { opacity: hrE, y: 60 * (1 - hrE) })

        // Track slides in from right: p 0.1→0.5 (slideT 0→1)
        const slideT = Math.max(0, Math.min(1, (p - 0.1) / 0.4))
        const slideE = 1 - Math.pow(1 - slideT, 3)

        // Track scrolls left: p 0.5→1.0 (scrollT 0→1)
        const scrollT = Math.max(0, Math.min(1, (p - 0.5) / 0.5))

        // Single x value — both motions summed, no phase boundary
        gsap.set(track,     { x: vw * (1 - slideE) - scrollT * sd })
        gsap.set(trackWrap, { opacity: slideE })
        updateRuler(scrollT)
      }

      setup()
      // Re-cache section top after setup since height changed
      cacheSectionTop()

      const onResize = () => { setup(); cacheSectionTop() }
      window.addEventListener('resize', onResize)

      // Listen on Lenis scroll event — fires with the smoothed virtual position
      // that Lenis already computed, so window.scrollY matches what's rendered
      const lenis = (window as any).__lenis
      if (lenis) {
        lenis.on('scroll', onScroll)
      } else {
        window.addEventListener('scroll', onScroll, { passive: true })
      }

      onScroll()

      return () => {
        window.removeEventListener('resize', onResize)
        if (lenis) lenis.off('scroll', onScroll)
        else window.removeEventListener('scroll', onScroll)
        if (rulerRef.current) rulerRef.current.remove()
      }
    })
  }, [])

  return (
    <section className={styles.section} ref={sectionRef} aria-labelledby="roadmap-heading">
      <div className={styles.sticky} ref={stickyRef}>

        <header className={styles.header} ref={headerRef}>
          <div className={styles.headerLeft} ref={headerLeftRef}>
            <div className={styles.eyebrowWrap}>
              <span className={styles.bracketTl} aria-hidden="true" />
              <span className={styles.bracketTr} aria-hidden="true" />
              <span className={styles.bracketBl} aria-hidden="true" />
              <span className={styles.bracketBr} aria-hidden="true" />
              <span className={styles.eyebrowText}>Setup Guide</span>
            </div>
            <h2 id="roadmap-heading" className={styles.mainTitle}>
              <span className={styles.titleLine1}>How To</span>
              <span className={styles.titleLine2}>Park Your Domain.</span>
            </h2>
          </div>
          <div className={styles.headerRight} ref={headerRightRef}>
            <div className={styles.descWrap}>
              <span className={styles.bracketDescTL} aria-hidden="true" />
              <p className={styles.headerSubtitle}>
                Every identity you have ever built online sits on a layer someone else controls and they have always reserved the right to take it back.
              </p>
              <span className={styles.bracketDescBR} aria-hidden="true" />
            </div>
          </div>
        </header>

        <div className={styles.sectionDivider} ref={dividerRef} aria-hidden="true" />

        {/* ── Mobile layout: axis column left + steps right ── */}
        <div className={styles.mobileLayout}>
          {/* Vertical axis column with animated ticks SVG */}
          <div className={styles.mobileAxisCol} ref={mobileAxisWrapRef} aria-hidden="true" />

          {/* Steps list */}
          <div className={styles.mobileStepsList}>
            {STEPS.map((step, i) => (
              <div key={step.num} className={styles.mobileStep}>
                {/* Badge on the axis */}
                <div className={styles.mobileStepBadgeWrap} aria-hidden="true">
                  <div className={styles.mobileStepBadge}>
                    <span className={styles.stepNum}>{step.num}</span>
                  </div>
                </div>
                {/* Content */}
                <div className={styles.mobileStepContent}>
                  <h3 className={styles.stepTitle}>
                    {step.title}
                    {step.note && <span className={styles.stepNote}> {step.note}</span>}
                  </h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop layout: horizontal scrolling track ── */}
        <div className={styles.trackWrap} ref={trackWrapRef}>
          <div className={styles.track} ref={trackRef}>
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`${styles.step} ${step.above ? styles.stepAbove : styles.stepBelow}`}
                data-index={i}
                ref={el => { if (el) stepsRef.current[i] = el }}
              >
                {!step.above && <div className={styles.connectorDot} aria-hidden="true" />}
                {!step.above && <div className={styles.connectorLine} aria-hidden="true" />}

                <div className={styles.stepInner}>
                  <div className={styles.stepContent}>
                    <div className={styles.badgeWrap}>
                      <div className={styles.badgeGlow} aria-hidden="true" />
                      <div className={styles.stepBadge} aria-hidden="true">
                        <span className={styles.stepNum}>{step.num}</span>
                      </div>
                    </div>
                    <div className={styles.stepSepLine} aria-hidden="true" />
                    <div className={styles.stepText}>
                      <h3 className={styles.stepTitle}>
                        {step.title}
                        {step.note && <span className={styles.stepNote}>{step.note}</span>}
                      </h3>
                      <p className={styles.stepDesc}>{step.desc}</p>
                    </div>
                  </div>
                </div>

                {step.above && <div className={styles.connectorLine} aria-hidden="true" />}
                {step.above && <div className={styles.connectorDot} aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default ParkedRoadmap
