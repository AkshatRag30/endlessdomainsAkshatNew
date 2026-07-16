import React, { useState, useCallback, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import type { TldPageData } from '@/data/tldPages'
import styles from './EnsFaq.module.scss'

function goToSupport() {
  window.location.href = '/support'
}

export interface EnsFaqProps {
  data: TldPageData
}

export function EnsFaq({ data }: EnsFaqProps) {
  const { tld, faq } = data
  const [openIndex, setOpenIndex] = useState(0)

  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEntranceAnimation([leftRef, rightRef])

  const toggle = useCallback((i: number) => {
    setOpenIndex(prev => (prev === i ? -1 : i))
  }, [])

  const handleItemClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    toggle(Number(e.currentTarget.dataset.index))
  }, [toggle])

  return (
    <section className={styles.section} aria-labelledby="ens-faq-heading">

      <div className={styles.inner}>

        {/* ── Left column ── */}
        <div className={styles.left} ref={leftRef}>
          <div className={styles.diagonalBgTop} aria-hidden="true" />
          <div className={styles.diagonalBgBottom} aria-hidden="true" />

          <div className={styles.leftContent}>
            <div className={styles.eyebrowWrap}>
              <span className={styles.bracketTL} aria-hidden="true" />
              <span className={styles.bracketTR} aria-hidden="true" />
              <span className={styles.bracketBL} aria-hidden="true" />
              <span className={styles.bracketBR} aria-hidden="true" />
              <span className={styles.eyebrowText}>FAQ</span>
            </div>

            <h2 id="ens-faq-heading" className={styles.heading}>
              <span className={styles.headingBlack}>Questions About</span>
              <span className={styles.headingBlue}>{tld}</span>
            </h2>

            <p className={styles.description}>{faq.description}</p>

            <PrimaryButton onClick={goToSupport}>
              Support Ticket
            </PrimaryButton>
          </div>
        </div>

        {/* ── Right column — accordion ── */}
        <div className={styles.right} ref={rightRef}>
          {faq.items.map((item, i) => (
            <div key={item.q} className={`${styles.item} ${openIndex === i ? styles.itemOpen : ''}`}>
              <button
                className={styles.itemBtn}
                data-index={i}
                onClick={handleItemClick}
                aria-expanded={openIndex === i}
                aria-controls={`ens-faq-panel-${i}`}
              >
                <span className={styles.itemQ}>{item.q}</span>
                <span className={`${styles.itemIcon} ${openIndex === i ? styles.itemIconOpen : ''}`} aria-hidden="true">
                  {openIndex === i
                    ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><line x1="4" y1="10" x2="16" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                    : <FiChevronDown size={20} />
                  }
                </span>
              </button>

              {openIndex === i && (
                <div id={`ens-faq-panel-${i}`} className={styles.itemPanel} role="region">
                  <p className={styles.itemA}>{item.a}</p>
                </div>
              )}

              <div className={styles.itemDivider} aria-hidden="true" />
            </div>
          ))}
        </div>

      </div>

      {/* top + bottom dashed border lines */}
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

    </section>
  )
}

export default EnsFaq
