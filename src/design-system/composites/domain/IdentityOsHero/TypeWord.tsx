import { useEffect, useRef, useState } from 'react'
import styles from './TypeWord.module.scss'

interface TypeWordProps {
  words: readonly string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  className?: string
}

export default function TypeWord({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseDuration = 1400,
  className,
}: TypeWordProps) {
  const [text, setText] = useState(words[0])
  const indexRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cancelled = false

    const wait = (ms: number) =>
      new Promise<void>(resolve => {
        timeoutRef.current = setTimeout(resolve, ms)
      })

    const run = async () => {
      if (reducedMotion) {
        // Whole-word swap, no per-letter animation, honoring the OS-level preference.
        while (!cancelled) {
          await wait(pauseDuration + typingSpeed * 6)
          if (cancelled) return
          indexRef.current = (indexRef.current + 1) % words.length
          setText(words[indexRef.current])
        }
        return
      }

      while (!cancelled) {
        const current = words[indexRef.current]

        await wait(pauseDuration)
        if (cancelled) return

        for (let i = current.length; i >= 0; i--) {
          if (cancelled) return
          setText(current.slice(0, i))
          await wait(deletingSpeed)
        }

        indexRef.current = (indexRef.current + 1) % words.length
        const next = words[indexRef.current]

        for (let i = 0; i <= next.length; i++) {
          if (cancelled) return
          setText(next.slice(0, i))
          await wait(typingSpeed)
        }
      }
    }

    run()

    return () => {
      cancelled = true
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [words, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className={`${styles.slot} ${className ?? ''}`}>
      <span aria-hidden="true">{text}</span>
    </span>
  )
}
