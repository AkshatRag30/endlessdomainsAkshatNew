import React, { useState, useCallback, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './FreenameFaq.module.scss'

const FAQS = [
  {
    q: 'What is Freename and how does it differ from traditional domain registrars?',
    a: 'Freename is a Web3 domain provider that lets you register and own TLDs (top-level domains) on the blockchain. Unlike traditional registrars where ICANN controls the namespace, Freename domains are permanently owned on-chain — no renewal fees, no central authority, and no possibility of having your domain taken away.',
  },
  {
    q: 'Which blockchains does Freename support?',
    a: 'Freename operates across multiple chains including Ethereum, Polygon, BNB Chain, and others. Your domain is minted as an NFT on your chosen chain, meaning it lives in your wallet and can be transferred, sold, or used as collateral like any other NFT asset.',
  },
  {
    q: 'What TLDs are available through Freename on Endless Domains?',
    a: 'Through Endless Domains you can register across 8 Freename TLDs: .metaverse, .hodl, .satoshi, .genesis, .token, .sat, .airdrop, and .rwa. Each TLD targets a specific Web3 community and use case, from DeFi to NFT culture to real-world asset tokenisation.',
  },
  {
    q: 'Do I pay annual renewal fees for a Freename domain?',
    a: 'No. Freename domains are a one-time purchase with permanent on-chain ownership. Once you mint the domain it belongs to you indefinitely with no recurring fees. This is one of the key advantages over legacy DNS registrars where annual renewal is mandatory.',
  },
  {
    q: 'Can I use a Freename domain as a Web3 wallet address?',
    a: 'Yes. Freename domains can be mapped to any wallet address across supported chains, turning a human-readable name like yourname.metaverse into a payment destination. You can share your domain instead of a long hexadecimal address for easier crypto transfers.',
  },
  {
    q: 'How do I register a Freename domain through Endless Domains?',
    a: 'Connect your wallet, search for the domain name you want under any of the 8 Freename TLDs, add it to your cart, and complete the purchase. The domain is minted directly to your wallet. Endless Domains handles the Freename integration end-to-end — no need to visit the Freename site separately.',
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
