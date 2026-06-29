import React, { useState, useCallback, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './UdFaq.module.scss'

const FAQS = [
  {
    q: 'What is Unstoppable Domains and how does it work?',
    a: 'Unstoppable Domains is the world\'s largest Web3 domain provider, enabling users to register human-readable identities on the blockchain. Unlike traditional DNS, Unstoppable domains are minted as NFTs — once purchased, you own them permanently with no renewal fees and no central authority that can revoke them.',
  },
  {
    q: 'What blockchains does Unstoppable Domains support?',
    a: 'Unstoppable Domains operates across multiple chains including Ethereum and Polygon. Your domain is minted as an NFT on your chosen chain and lives directly in your wallet, fully transferable and tradeable like any other digital asset.',
  },
  {
    q: 'How many TLDs are available through Unstoppable Domains on Endless?',
    a: 'Through Endless Domains you can register across 55 Unstoppable TLDs including .crypto, .wallet, .blockchain, .bitcoin, .nft, .dao, .x, .888, and many more. Each TLD targets a specific community or use case within the Web3 ecosystem.',
  },
  {
    q: 'Is there an annual renewal fee for Unstoppable Domains?',
    a: 'No. Unstoppable Domains are a one-time purchase. Once you mint the domain it belongs to you forever with no recurring fees. This is one of the core advantages over traditional DNS registrars where annual renewal is required to maintain ownership.',
  },
  {
    q: 'Can I use an Unstoppable Domain as a wallet address?',
    a: 'Yes. You can map any Unstoppable domain to your wallet addresses across all supported chains, making it a universal payment handle. Share yourname.crypto instead of a long hex address for easier crypto transfers across the entire Web3 ecosystem.',
  },
  {
    q: 'What is Login With Unstoppable?',
    a: 'Login With Unstoppable is a Web3 single-sign-on feature that lets you use your Unstoppable domain as a universal login across hundreds of dApps and Web3 platforms. Instead of creating new accounts everywhere, you authenticate once with your domain and wallet.',
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
