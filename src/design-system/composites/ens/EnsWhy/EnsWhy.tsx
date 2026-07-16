import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { TldPageData } from '@/data/tldPages'

import styles from './EnsWhy.module.scss'

export interface EnsWhyProps {
  data: TldPageData
}

export function EnsWhy({ data }: EnsWhyProps) {
  const { why } = data
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
    <section ref={sectionRef} className={styles.section} aria-labelledby="ens-why-heading">

      <div className={styles.stage}>

        <div className={`${styles.pillField} ${isVisible ? styles.pillFieldVisible : ''}`} aria-hidden="true">
          {why.rows.map((row, i) => (
            <div key={row.id} className={styles.pillRow} data-row={i + 1}>
              <Image src="/ens/connector-line.svg" alt="" width={220} height={32} className={`${styles.connector} ${styles.connectorLeft}`} unoptimized />
              <span className={`${styles.pill} ${styles.pillLeft}`}>{row.left}</span>
              <span className={`${styles.pill} ${styles.pillRight}`}>{row.right}</span>
              <Image src="/ens/connector-line.svg" alt="" width={220} height={32} className={`${styles.connector} ${styles.connectorRight}`} unoptimized />
            </div>
          ))}
        </div>

        <div className={styles.titleBlock}>
          <div className={styles.labelWrap}>
            <span className={styles.labelBracketTL} aria-hidden="true" />
            <span className={styles.labelBracketTR} aria-hidden="true" />
            <span className={styles.labelBracketBL} aria-hidden="true" />
            <span className={styles.labelBracketBR} aria-hidden="true" />
            <p className={styles.labelText}>{why.label}</p>
          </div>

          <h2 id="ens-why-heading" className={styles.heading}>
            <span className={styles.headingLine1}>{why.headingLine1}</span>
            <span className={styles.headingLine2}>{why.headingLine2}</span>
          </h2>
        </div>

      </div>

      {/* ── Mobile-only pill stack — heading above, 3 centered pill-pair rows below ── */}
      <div className={`${styles.pillStackMobile} ${isVisible ? styles.pillStackMobileVisible : ''}`} aria-hidden="true">
        <span className={styles.stubConnector} />
        {why.rows.map((row, i) => (
          <div key={row.id} className={styles.pillRowMobile} data-row={i + 1}>
            <span className={styles.pill}>{row.left}</span>
            <span className={styles.pill}>{row.right}</span>
          </div>
        ))}
      </div>

    </section>
  )
}

export default EnsWhy
