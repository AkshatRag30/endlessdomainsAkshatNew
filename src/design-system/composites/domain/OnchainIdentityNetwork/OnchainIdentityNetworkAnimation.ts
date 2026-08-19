import type { gsap as GsapType } from 'gsap'

// Phase windows along the single 0→1 progress value — asymmetric on purpose (matches
// the Figma/brief timing: the core gets a slower solo entrance, then three node pairs
// build up in equal-ish spans).
export const CORE_WINDOW = { start: 0, end: 0.15 }
export const PHASES = [
  { key: 'pair1', label: 'Wallet & Social', start: 0.15, end: 0.4, nodeIds: ['wallet', 'social'] },
  { key: 'pair2', label: 'DApp & Mail', start: 0.4, end: 0.7, nodeIds: ['dapp', 'mail'] },
  { key: 'pair3', label: 'Login & Brand', start: 0.7, end: 1.0, nodeIds: ['login', 'brand'] },
]

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function localProgress(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start), 0, 1)
}

export interface NodeVisualState {
  pathDashOffset: number
  pathOpacity: number
  nodeOpacity: number
  nodeScale: number
  nodeY: number
  textOpacity: number
  textY: number
}

// One node's whole reveal (path draw → node pop → text settle) lives inside its own
// [start, end] window so scroll progress maps directly to visual state with no
// timers or intermediate flags — reversing scroll just walks this back exactly.
export function getNodeState(progress: number, start: number, end: number, pathLength: number): NodeVisualState {
  const t = localProgress(progress, start, end)

  const drawT = clamp(t / 0.55, 0, 1)
  const popT = clamp((t - 0.35) / 0.4, 0, 1)
  const textT = clamp((t - 0.55) / 0.45, 0, 1)

  return {
    pathDashOffset: lerp(pathLength, 0, drawT),
    pathOpacity: drawT > 0 ? 1 : 0,
    nodeOpacity: popT,
    nodeScale: lerp(0.6, 1, popT),
    nodeY: lerp(10, 0, popT),
    textOpacity: textT,
    textY: lerp(8, 0, textT),
  }
}

export function getCoreState(progress: number) {
  const t = localProgress(progress, CORE_WINDOW.start, CORE_WINDOW.end)
  const revealT = clamp((t - 0.2) / 0.5, 0, 1)
  return {
    markOpacity: lerp(0, 1, revealT),
    markScale: lerp(0.6, 1, revealT),
    // Continues the previous section's exit spin and downward travel — the mark drops
    // in from above and settles out of its spin, rather than fading up flat, so the
    // handoff between the two reads as one continuous descent, not two independent
    // entrances.
    markRotation: lerp(-140, 0, revealT),
    markY: lerp(-220, 0, revealT),
  }
}

interface ProgressRefs {
  coreMark: HTMLElement | null
  paths: (SVGPathElement | null)[]
  glowPaths: (SVGPathElement | null)[]
  dashPaths: (SVGPathElement | null)[]
  pathLengths: number[]
  nodes: (HTMLElement | null)[]
  nodeTexts: (HTMLElement | null)[]
}

interface ProgressControllerOptions {
  sectionEl: HTMLElement
  refs: ProgressRefs
  nodeWindows: { start: number; end: number }[]
  reducedMotion: boolean
  onPhaseChange: (phaseIndex: number) => void
}

export function createProgressController(gsap: typeof GsapType, { sectionEl, refs, nodeWindows, reducedMotion, onProgress, onPhaseChange }: ProgressControllerOptions & { onProgress?: (p: number) => void }) {
  let sectionTop = 0
  let scrollLength = 1
  let dragging = false
  let lastPhase = -1

  function measure() {
    const rect = sectionEl.getBoundingClientRect()
    sectionTop = window.scrollY + rect.top
    scrollLength = Math.max(1, sectionEl.offsetHeight - window.innerHeight)
  }

  function applyProgress(progress: number) {
    const p = clamp(progress, 0, 1)

    if (reducedMotion) {
      gsap.set(refs.coreMark, { opacity: 1, scale: 1, rotation: 0, y: 0 })
      refs.nodes.forEach((el, i) => {
        gsap.set(el, { opacity: 1, scale: 1, xPercent: -50, yPercent: -50, y: 0 })
        gsap.set(refs.nodeTexts[i], { opacity: 1, y: 0 })
        gsap.set(refs.paths[i], { opacity: 1, strokeDashoffset: 0 })
        gsap.set(refs.glowPaths[i], { opacity: 1, strokeDashoffset: 0 })
        gsap.set(refs.dashPaths[i], { opacity: 1 })
      })
    } else {
      const core = getCoreState(p)
      gsap.set(refs.coreMark, { opacity: core.markOpacity, scale: core.markScale, rotation: core.markRotation, y: core.markY })

      nodeWindows.forEach((win, i) => {
        const length = refs.pathLengths[i] || 0
        const state = getNodeState(p, win.start, win.end, length)
        gsap.set(refs.paths[i], { opacity: state.pathOpacity, strokeDashoffset: state.pathDashOffset })
        // Same computed reveal drives the glow core (identical geometry, same dash length)
        // and the dotted centerline (fixed "2 2" pattern, so only opacity follows here).
        gsap.set(refs.glowPaths[i], { opacity: state.pathOpacity, strokeDashoffset: state.pathDashOffset })
        gsap.set(refs.dashPaths[i], { opacity: state.pathOpacity })
        // xPercent/yPercent (not plain CSS translate) is how the -50%/-50% centering
        // anchor from .node's own CSS transform has to be expressed to GSAP — once GSAP
        // owns the transform, a plain `y` in px REPLACES the CSS translateY instead of
        // adding to it, since GSAP never learns about the missing -50% otherwise. That
        // silently turned every node's anchor from its center into its top edge once
        // nodeY settled at 0, dropping each node by half of its OWN rendered height —
        // which differs left vs right whenever their description text wraps to a
        // different line count, producing a visible vertical mismatch within a row.
        gsap.set(refs.nodes[i], { opacity: state.nodeOpacity, scale: state.nodeScale, xPercent: -50, yPercent: -50, y: state.nodeY })
        gsap.set(refs.nodeTexts[i], { opacity: state.textOpacity, y: state.textY })
      })
    }

    const phaseIndex = PHASES.findIndex(ph => p >= ph.start && p < ph.end)
    const resolvedPhase = p >= 1 ? PHASES.length - 1 : phaseIndex === -1 ? (p < CORE_WINDOW.end ? -1 : lastPhase) : phaseIndex
    if (resolvedPhase !== lastPhase) {
      lastPhase = resolvedPhase
      onPhaseChange(resolvedPhase)
    }

    onProgress?.(p)
  }

  function progressFromScroll() {
    return (window.scrollY - sectionTop) / scrollLength
  }

  function onScroll() {
    if (dragging) return
    applyProgress(progressFromScroll())
  }

  function onResize() {
    measure()
    applyProgress(progressFromScroll())
  }

  measure()
  applyProgress(progressFromScroll())

  const lenis = (window as any).__lenis
  if (lenis) lenis.on('scroll', onScroll)
  else window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  // measure() above can run before web fonts and images finish loading on a cold hard
  // refresh, capturing the wrong sectionTop/scrollLength — re-running it once the page
  // and fonts have actually settled catches that instead of relying on some unrelated
  // resize (e.g. toggling DevTools) to correct it later.
  let cancelled = false
  window.addEventListener('load', onResize)
  if (document.fonts?.ready) document.fonts.ready.then(() => !cancelled && onResize())

  return {
    refresh: onResize,
    destroy() {
      cancelled = true
      if (lenis) lenis.off('scroll', onScroll)
      else window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
    },
  }
}
