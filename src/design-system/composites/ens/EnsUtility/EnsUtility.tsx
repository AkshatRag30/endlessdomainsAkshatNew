import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { TldPageData } from '@/data/tldPages'

import styles from './EnsUtility.module.scss'

export interface EnsUtilityProps {
  data: TldPageData
}

export function EnsUtility({ data }: EnsUtilityProps) {
  const { utility } = data
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="ens-utility-heading">

      {/* ── Desktop / tablet layout — full-bleed dome + arced icon row ── */}
      <div className={styles.stage}>

        <div className={styles.domeArea} aria-hidden="true">
          <div className={styles.domeBgWrap}>
            <Image src="/ens/Vector (3).png" alt="" fill className={styles.domeBg} unoptimized />
          </div>
          <div className={styles.domeRingsWrap}>
            <Image src="/ens/Vector (4).png" alt="" fill className={styles.domeRings} unoptimized />
          </div>
        </div>

        <div className={styles.titleBlock}>
          <div className={styles.labelWrap}>
            <span className={styles.labelBracketTL} aria-hidden="true" />
            <span className={styles.labelBracketTR} aria-hidden="true" />
            <span className={styles.labelBracketBL} aria-hidden="true" />
            <span className={styles.labelBracketBR} aria-hidden="true" />
            <p className={styles.labelText}>{utility.label}</p>
          </div>

          <h2 id="ens-utility-heading" className={styles.heading}>
            <span className={styles.headingLine1}>{utility.headingLine1}</span>
            <span className={styles.headingLine2}>{utility.headingLine2}</span>
          </h2>
        </div>

        <ul className={`${styles.utilityArc} ${isVisible ? styles.utilityArcVisible : ''}`} role="list">
          {utility.items.map(({ id, Icon, title }) => (
            <li key={id} className={styles.utilityItem} data-item={id}>
              <span className={styles.iconBadge} aria-hidden="true">
                <Icon size={20} />
              </span>
              <span className={styles.utilityPill}>{title}</span>
            </li>
          ))}
        </ul>

      </div>

      {/* ── Mobile layout — thin blue notch sliver at the top, faint ring lines continuing
          down over plain white behind the title + icon grid ── */}
      <div className={styles.mobileStage}>

        {/* blue notch + ring overlay — sized to the whole stage so the title + icon grid below
            sit on top of the dome image itself, same composition as desktop's .domeArea */}
        <div className={styles.mobileDomeArea} aria-hidden="true">
          <div className={styles.mobileDomeBgWrap}>
            <Image src="/ens/Vector (3).png" alt="" fill className={styles.mobileDomeBg} unoptimized />
          </div>
          <div className={styles.mobileDomeRingsWrap}>
            <Image src="/ens/Vector (4).png" alt="" fill className={styles.mobileDomeRings} unoptimized />
          </div>
        </div>

        <div className={styles.mobileTitleBlock}>
          <div className={styles.labelWrap}>
            <span className={styles.labelBracketTL} aria-hidden="true" />
            <span className={styles.labelBracketTR} aria-hidden="true" />
            <span className={styles.labelBracketBL} aria-hidden="true" />
            <span className={styles.labelBracketBR} aria-hidden="true" />
            <p className={styles.labelText}>{utility.label}</p>
          </div>

          <div className={styles.heading} aria-hidden="true">
            <span className={styles.headingLine1}>{utility.headingLine1}</span>
            <span className={styles.headingLine2}>{utility.headingLine2}</span>
          </div>
        </div>

        <ul className={`${styles.mobileUtilityGrid} ${isVisible ? styles.mobileUtilityGridVisible : ''}`} role="list">
          {utility.items.map(({ id, Icon, title }) => (
            <li key={id} className={styles.mobileUtilityItem} data-item={id}>
              <span className={styles.iconBadge} aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className={styles.utilityPill}>{title}</span>
            </li>
          ))}
        </ul>

      </div>

    </section>
  )
}

export default EnsUtility
