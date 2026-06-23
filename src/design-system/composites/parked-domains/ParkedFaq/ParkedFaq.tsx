import React, { useState, useCallback, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './ParkedFaq.module.scss'

const FAQS = [
  {
    q: 'Do I need a developer or technical knowledge to park my domain?',
    a: 'No. The entire process runs through the Endless Domains dashboard. You select a template, fill in your details, and click submit. The IPFS connection is automated. You never touch code or configuration files.',
  },
  {
    q: 'How does IPFS linking work and why does it matter?',
    a: 'IPFS (InterPlanetary File System) is a decentralised storage network. Your parked page lives on-chain, cannot be taken down by any centralised party, and resolves correctly in Web3-compatible browsers. This is genuinely decentralised parking, not just a redirect.',
  },
  {
    q: 'How much can I realistically earn per month?',
    a: 'Earnings vary by domain traffic, extension type, and ad market conditions. Early beta users are reporting between $20 and $200 per month per domain. Premium .crypto, .x, and .wallet domains in high-traffic categories tend to earn the most. Use the earnings calculator in your dashboard for a personalised estimate.',
  },
  {
    q: 'Can I park multiple domains at once?',
    a: 'Yes. You can park as many domains as you own, each with its own template and configuration. Every domain earns independently and revenue is tracked separately in your dashboard.',
  },
  {
    q: 'What happens to my domain if I decide to build a site on it later?',
    a: 'You can unpark your domain at any time with a single click. There are no lock-in periods, no penalties, and no lost ownership. The domain is yours permanently. Parking is simply a revenue mode you can switch on or off.',
  },
  {
    q: 'Is beta access permanent or will there be a waitlist later?',
    a: 'The first 500 users receive permanent Founding Parker status including higher revenue share rates and priority ad placement. Once the limit is reached, new users join a waitlist and access opens in phases. 364 of 500 spots are already taken as of today.',
  },
]

export function ParkedFaq() {
  const [openIndex, setOpenIndex] = useState(0)

  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEntranceAnimation([leftRef, rightRef])

  const toggle = useCallback((i: number) => {
    setOpenIndex(prev => (prev === i ? -1 : i))
  }, [])

  return (
    <section className={styles.section} aria-labelledby="faq-heading">

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

            <h2 id="faq-heading" className={styles.heading}>
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
                aria-controls={`faq-panel-${i}`}
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
                <div id={`faq-panel-${i}`} className={styles.itemPanel} role="region">
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

export default ParkedFaq
