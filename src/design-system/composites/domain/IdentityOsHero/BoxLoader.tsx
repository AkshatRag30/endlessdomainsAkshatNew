'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './IdentityOsHero.module.scss'

interface BoxLoaderProps {
  /** Number of boxes to display */
  count?: number
  /** Delay in ms between each box filling */
  interval?: number
  /** Pause in ms after all boxes are filled before resetting */
  pauseDuration?: number
  /** Gap between boxes in px */
  gap?: number
  /** Position: "left" = boxes on left with diagonal rising right, "right" = boxes on right with diagonal rising left */
  position?: 'left' | 'right'
  /** Optional className for the wrapper */
  className?: string
}

export default function BoxLoader({
  count = 10,
  interval = 150,
  pauseDuration = 600,
  gap = 5,
  position = 'left',
  className,
}: BoxLoaderProps) {
  const [activeCount, setActiveCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fillingRef = useRef(true)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    const step = () => {
      if (fillingRef.current) {
        setActiveCount(prev => {
          const next = prev + 1
          if (next >= count) {
            fillingRef.current = false
            timerRef.current = setTimeout(step, pauseDuration)
            return next
          }
          timerRef.current = setTimeout(step, interval)
          return next
        })
      } else {
        setActiveCount(0)
        fillingRef.current = true
        timerRef.current = setTimeout(step, interval)
      }
    }

    timerRef.current = setTimeout(step, interval)

    return clearTimer
  }, [count, interval, pauseDuration, clearTimer])

  const isLeft = position === 'left'
  const gradientId = `stroke-gradient-${position}`

  return (
    <div className={`${styles.wrapper} ${isLeft ? styles.left : styles.right} ${className ?? ''}`}>
      {/* SVG border stroke */}
      {isLeft ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="542" height="44" viewBox="0 0 542 44" fill="none">
          <path
            d="M-52.543 0.996972H340.867C347.278 0.996972 353.202 4.41734 356.408 9.96965L370.222 33.8968C373.428 39.4491 379.352 42.8695 385.763 42.8695L541.648 42.8695"
            stroke="url(#paint0_linear_1146_22209)"
            stroke-width="1.99393"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1146_22209"
              x1="-52.543"
              y1="1.49545"
              x2="541.648"
              y2="21.9332"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#2639ED" stop-opacity="0.1" />
              <stop offset="0.275839" stop-color="#2639ED" />
              <stop offset="0.524609" stop-color="#9457F6" />
              <stop offset="1" stop-color="#9457F6" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="595" height="44" viewBox="0 0 595 44" fill="none">
          <path
            d="M0 42.8695H273.774C280.185 42.8695 286.11 39.4491 289.315 33.8968L303.13 9.96964C306.335 4.41733 312.259 0.996964 318.671 0.996964H594.191"
            stroke="url(#paint0_linear_2024_16090)"
            stroke-width="1.99393"
          />
          <defs>
            <linearGradient
              id="paint0_linear_2024_16090"
              x1="1.14782e-08"
              y1="42.371"
              x2="594.191"
              y2="21.9332"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#2639ED" stop-opacity="0.1" />
              <stop offset="0.275839" stop-color="#2639ED" />
              <stop offset="0.524609" stop-color="#9457F6" />
              <stop offset="1" stop-color="#9457F6" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Boxes container with clipped shape */}
      <div className={styles.boxesContainer}>
        <div className={styles.loader} style={{ gap: `${gap}px` }}>
          {Array.from({ length: count }, (_, i) => {
            const index = isLeft ? i : count - 1 - i
            return <div key={i} className={`${styles.box} ${index < activeCount ? styles.active : ''}`} />
          })}
        </div>
      </div>
    </div>
  )
}
