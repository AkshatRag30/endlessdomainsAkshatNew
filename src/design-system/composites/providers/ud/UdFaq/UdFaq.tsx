import React, { useState, useCallback, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './UdFaq.module.scss'

const FAQS = [
  {
    q: 'What is Unstoppable Domains?',
    a: 'Unstoppable Domains is the largest on-chain identity provider, offering blockchain-based domain names that replace complex wallet addresses with human-readable identities. Domains are owned directly by users, minted on-chain, and require no annual renewal fees.',
  },
  {
    q: 'How many TLDs does Unstoppable Domains offer?',
    a: 'Unstoppable Domains offers 55 TLDs, including popular extensions such as .crypto, .nft, .wallet, .dao, .x, .bitcoin, .blockchain, .og, and many community-focused namespaces. It is one of the largest collections of on-chain identities available from a single provider.',
  },
  {
    q: 'Do Unstoppable Domains names expire?',
    a: 'No. Unstoppable Domains are purchased once and owned permanently. There are no renewal fees or expiration dates.',
  },
  {
    q: 'What chains do Unstoppable Domains support?',
    a: 'Domains are minted on Polygon and resolve across Ethereum, Base, Arbitrum, and other supported EVM networks.',
  },
  {
    q: 'Why register Unstoppable Domains through Endless Domains?',
    a: 'Endless lets you search, compare, and manage identities from multiple providers in one place without switching platforms.',
  },
  {
    q: 'Can I transfer an Unstoppable Domains name?',
    a: 'Yes. Domains are wallet-owned assets and can be transferred, traded, or sold like any other on-chain asset.',
  },
]

export function UdFaq() {
  const [openIndex, setOpenIndex] = useState(0)

  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEntranceAnimation([leftRef, rightRef])

  const toggle = useCallback((i: number) => {
    setOpenIndex(prev => (prev === i ? -1 : i))
  }, [])

  return (
    <section className={styles.section} aria-labelledby="ud-faq-heading">

      <div className={styles.inner}>

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

            <h2 id="ud-faq-heading" className={styles.heading}>
              <span className={styles.headingBlack}>Frequently</span>
              <span className={styles.headingBlue}>asked questions</span>
            </h2>

            <p className={styles.description}>Answers to our most frequently asked questions</p>

            <PrimaryButton onClick={() => window.location.href = '/support'}>
              Support Ticket
            </PrimaryButton>
          </div>
        </div>

        <div className={styles.right} ref={rightRef}>
          {FAQS.map((faq, i) => (
            <div key={faq.q} className={`${styles.item} ${openIndex === i ? styles.itemOpen : ''}`}>
              <button
                className={styles.itemBtn}
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                aria-controls={`ud-faq-panel-${i}`}
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
                <div id={`ud-faq-panel-${i}`} className={styles.itemPanel} role="region">
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

export default UdFaq
