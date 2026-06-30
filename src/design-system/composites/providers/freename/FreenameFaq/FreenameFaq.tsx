import React, { useState, useCallback, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './FreenameFaq.module.scss'

const FAQS = [
  {
    q: 'How many TLDs does Freename offer?',
    a: 'Freename offers 8 TLDs through Endless Domains, including .metaverse, .hodl, .satoshi, .genesis, .token, .sat, .airdrop, and .rwa.',
  },
  {
    q: 'Do Freename identities expire?',
    a: 'No. Freename identities are purchased once and owned permanently. There are no annual renewal fees.',
  },
  {
    q: 'What makes Freename different?',
    a: 'Unlike traditional naming providers, Freename enables the creation and ownership of entire TLD namespaces, opening new opportunities for communities and brands.',
  },
  {
    q: 'Why register Freename through Endless Domains?',
    a: 'Endless lets you search, compare, and manage identities from multiple providers through a single unified platform.',
  },
  {
    q: 'Can I transfer a Freename identity?',
    a: 'Yes. Freename identities are blockchain-based assets that can be transferred, traded, or sold directly from your wallet.',
  },
]

export function FreenameFaq() {
  const [openIndex, setOpenIndex] = useState(0)

  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEntranceAnimation([leftRef, rightRef])

  const toggle = useCallback((i: number) => {
    setOpenIndex(prev => (prev === i ? -1 : i))
  }, [])

  return (
    <section className={styles.section} aria-labelledby="freename-faq-heading">

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

            <h2 id="freename-faq-heading" className={styles.heading}>
              <span className={styles.headingBlack}>Frequently</span>
              <span className={styles.headingBlue}>asked questions</span>
            </h2>

            <p className={styles.description}>Answers to our most frequently asked questions</p>

            <PrimaryButton onClick={() => window.location.href = '/support'}>
              Support Ticket
            </PrimaryButton>
          </div>
        </div>

        {/* ── Right column — accordion ── */}
        <div className={styles.right} ref={rightRef}>
          {FAQS.map((faq, i) => (
            <div key={faq.q} className={`${styles.item} ${openIndex === i ? styles.itemOpen : ''}`}>
              <button
                className={styles.itemBtn}
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                aria-controls={`freename-faq-panel-${i}`}
              >
                <span className={styles.itemQ}>{faq.q}</span>
                <span className={`${styles.itemIcon} ${openIndex === i ? styles.itemIconOpen : ''}`} aria-hidden="true">
                  {openIndex === i
                    ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><line x1="4" y1="10" x2="16" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                    : <FiChevronDown size={20} />
                  }
                </span>
              </button>

              {openIndex === i && (
                <div id={`freename-faq-panel-${i}`} className={styles.itemPanel} role="region">
                  <p className={styles.itemA}>{faq.a}</p>
                </div>
              )}

              <div className={styles.itemDivider} aria-hidden="true" />
            </div>
          ))}
        </div>

      </div>

      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

    </section>
  )
}

export default FreenameFaq
