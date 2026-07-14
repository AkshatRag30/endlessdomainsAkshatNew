import React, { useState, useCallback, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './OgTldFaq.module.scss'

const FAQS = [
  {
    q: 'What is a .og identity?',
    a: 'A .og identity is the native on-chain identity of Endless Domains. It acts as your payment address, login credential, and reputation layer across the ecosystem.',
  },
  {
    q: 'How much does a .og identity cost?',
    a: 'Registrations start from $2, with pricing varying based on name length and demand.',
  },
  {
    q: 'Do .og identities expire?',
    a: 'No. Every .og identity is purchased once and owned permanently.',
  },
  {
    q: 'What blockchains does .og support?',
    a: '.og identities resolve across Ethereum, Polygon, Arbitrum, Base, BNB Chain, Solana, and hundreds of supported integrations.',
  },
  {
    q: 'Can I receive payments with my .og identity?',
    a: 'Yes. Your .og can function as a human-readable payment address across supported wallets and applications.',
  },
  {
    q: 'Can I transfer or sell my .og identity?',
    a: 'Yes. .og identities are wallet-owned assets that can be transferred, traded, or sold at any time.',
  },
]

function goToSupport() {
  window.location.href = '/support'
}

export function OgTldFaq() {
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
    <section className={styles.section} aria-labelledby="og-tld-faq-heading">

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

            <h2 id="og-tld-faq-heading" className={styles.heading}>
              <span className={styles.headingBlack}>Frequently</span>
              <span className={styles.headingBlue}>asked questions</span>
            </h2>

            <p className={styles.description}>Answers to your most common .og identity questions</p>

            <PrimaryButton onClick={goToSupport}>
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
                data-index={i}
                onClick={handleItemClick}
                aria-expanded={openIndex === i}
                aria-controls={`og-tld-faq-panel-${i}`}
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
                <div id={`og-tld-faq-panel-${i}`} className={styles.itemPanel} role="region">
                  <p className={styles.itemA}>{faq.a}</p>
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

export default OgTldFaq
