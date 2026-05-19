import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface FilterToggleSwitchProps {
  isOpen: boolean
}

export function FilterToggleSwitch({ isOpen }: FilterToggleSwitchProps) {
  const knobRef = useRef<SVGRectElement>(null)
  const prevIsOpenRef = useRef<boolean | null>(null)

  useEffect(() => {
    const isFirst = prevIsOpenRef.current === null
    prevIsOpenRef.current = isOpen
    const targetX = isOpen ? 31 : 10

    if (isFirst) {
      gsap.set(knobRef.current, { attr: { x: targetX } })
      return
    }

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(knobRef.current, { attr: { x: targetX }, duration: 0.35, ease: 'power2.inOut' })
    })
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(knobRef.current, { attr: { x: targetX } })
    })
    return () => mm.revert()
  }, [isOpen])

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="54" height="38" viewBox="0 0 54 38" fill="none" aria-hidden="true">
      <g filter="url(#ftb_f0)">
        <rect width="48" height="32" fill="url(#ftb_g0)" />
        <g filter="url(#ftb_f1)">
          <rect x="4" y="8" width="41" height="17" rx="5" fill="var(--color-white-primary)" />
        </g>
        <rect x="4.5" y="8.5" width="40" height="16" rx="4.5" stroke="url(#ftb_g1)" strokeOpacity="0.2" />
        <rect x="10" y="12" width="30" height="10" rx="3" fill="var(--color-black-primary)" />
        <g filter="url(#ftb_f2)">
          <rect ref={knobRef} x="10" y="12" width="9" height="10" rx="3" fill="var(--color-toggle-knob)" />
        </g>
      </g>
      <defs>
        <filter id="ftb_f0" x="0" y="0" width="54" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="3" dy="3" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
        </filter>
        <filter id="ftb_f1" x="4" y="8" width="41" height="17" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.38 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
        <filter id="ftb_f2" x="5" y="8" width="46" height="24" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="0.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.98 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="1" dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.85 0" />
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="2" dy="3" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0" />
          <feBlend mode="normal" in2="shape" result="effect6_innerShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="-1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0" />
          <feBlend mode="normal" in2="shape" result="effect7_innerShadow" />
        </filter>
        <linearGradient id="ftb_g0" x1="24" y1="0" x2="24" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-surface-mid)" />
          <stop offset="1" stopColor="var(--color-surface-hover)" />
        </linearGradient>
        <linearGradient id="ftb_g1" x1="24.5" y1="25" x2="24.5" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-white-primary)" />
          <stop offset="1" />
        </linearGradient>
      </defs>
    </svg>
  )
}
