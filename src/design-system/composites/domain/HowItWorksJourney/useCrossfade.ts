import { useEffect, useRef, useState } from 'react'

export type CrossfadePhase = 'idle' | 'exit' | 'enter-start'

// Drives a two-step exit-then-enter transform/opacity swap without a DOM
// remount: the OLD content plays its exit transition, then — once it's fully
// hidden — the NEW value takes over the same node, jumps (no transition) to
// an offset starting position, and on the very next frame the phase flips
// back to 'idle', which re-enables the transition and animates it into place.
// The nested rAF forces the browser to paint the offset "enter-start" frame
// before the transition is re-enabled — otherwise the style change gets
// batched away and the entrance never animates.
export function useCrossfade<T>(value: T, exitMs = 220) {
  const [display, setDisplay] = useState(value)
  const [phase, setPhase] = useState<CrossfadePhase>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const rafRef = useRef<number>()
  const rafRef2 = useRef<number>()

  useEffect(() => {
    if (value === display) return

    setPhase('exit')
    timeoutRef.current = setTimeout(() => {
      setDisplay(value)
      setPhase('enter-start')
      rafRef.current = requestAnimationFrame(() => {
        rafRef2.current = requestAnimationFrame(() => setPhase('idle'))
      })
    }, exitMs)

    return () => {
      clearTimeout(timeoutRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (rafRef2.current) cancelAnimationFrame(rafRef2.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return { display, phase }
}
