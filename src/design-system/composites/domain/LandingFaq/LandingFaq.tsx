import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { IoIosArrowDown } from 'react-icons/io'

import styles from './LandingFaq.module.scss'

interface FaqsType {
  id: string
  isDeleted: boolean
  question: string
  answer: string
  position: number
}

// Static content — this section no longer loads from the FAQ API; these are the
// exact seven questions the landing page should show, in this order.
const FAQS: FaqsType[] = [
  {
    id: 'what-am-i-buying',
    isDeleted: false,
    position: 0,
    question: 'What exactly am I buying?',
    answer:
      "A domain that is your identity: a permanent, on-chain name minted to your wallet. Unlike Web2 handles you only rent, no platform can revoke, suspend, or reassign it. You hold the keys, so you own the identity. Forever.",
  },
  {
    id: 'lifetime-ownership',
    isDeleted: false,
    position: 1,
    question: 'Is it really lifetime ownership? No renewals?',
    answer:
      "Correct. One mint, zero renewals, zero rent. There are no annual fees and no protocol fees. Your domain, and the identity it carries, lives on-chain as long as the chain does. That's the whole point.",
  },
  {
    id: 'chains-supported',
    isDeleted: false,
    position: 2,
    question: 'Which chains are supported?',
    answer:
      "You can mint and own domains on 21+ chains including Ethereum, Solana, Polygon, Base, Arbitrum, Avalanche and BNB Chain. Each chain's name is a separate, independently-owned domain. Claim your name on whichever chains matter to you, each resolving natively on its own chain.",
  },
  {
    id: 'pay-without-crypto',
    isDeleted: false,
    position: 3,
    question: 'Can I pay without crypto?',
    answer:
      "Yes. We support credit card, Google Pay, Apple Pay, and all major onchain assets (ETH, SOL, BTC, USDT, USDC, MATIC and more). Zero friction. Claim your identity in minutes even if you're new to Web3.",
  },
  {
    id: 'reputation-score',
    isDeleted: false,
    position: 4,
    question: 'What is the reputation score?',
    answer:
      "A sybil-resistant, on-chain score computed from your wallet history, ownership tenure, credentials, and peer attestations. It's portable across the ecosystem (gated communities, better rates, allowlists) and it compounds automatically as you use Web3.",
  },
  {
    id: 'sell-or-transfer',
    isDeleted: false,
    position: 5,
    question: 'Can I sell or transfer my identity?',
    answer:
      "Yes. It's a liquid on-chain asset. Trade peer-to-peer on the built-in Marketplace through trustless smart contracts: no broker, fair fees, atomic settlement. Or hold it forever. Your call. Your property.",
  },
  {
    id: 'vs-ens-opensea',
    isDeleted: false,
    position: 6,
    question: 'How is this different from just buying on ENS or OpenSea directly?',
    answer:
      "ENS sells one namespace. OpenSea lists one marketplace. Endless Domains aggregates 10+ providers across 21 chains, adds secondary trading, parking revenue, onchain reputation, and perks, all from one dashboard. It is the difference between buying one stock and having a full portfolio.",
  },
]

interface FaqItemProps {
  faq: FaqsType
  isOpen: boolean
  onToggle: () => void
  isFirst: boolean
}

const FaqItem = ({ faq, isOpen, onToggle, isFirst }: FaqItemProps) => {
  const answerRef = useRef<HTMLDivElement>(null)
  const prevOpen = useRef<boolean>(isOpen)

  useEffect(() => {
    const el = answerRef.current
    if (!el) return

    // Skip animation on first mount — just set the initial state
    if (prevOpen.current === isOpen && el.dataset.initialized !== '1') {
      gsap.set(el, { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 })
      el.dataset.initialized = '1'
      return
    }

    prevOpen.current = isOpen

    if (isOpen) {
      gsap.set(el, { height: 0, opacity: 0 })
      gsap.to(el, {
        height: 'auto',
        duration: 0.4,
        ease: 'power2.out',
      })
      gsap.to(el, {
        opacity: 1,
        duration: 0.3,
        delay: 0.1,
        ease: 'power1.out',
      })
    } else {
      gsap.to(el, {
        opacity: 0,
        duration: 0.2,
        ease: 'power1.in',
      })
      gsap.to(el, {
        height: 0,
        duration: 0.35,
        delay: 0.05,
        ease: 'power2.inOut',
      })
    }
  }, [isOpen])

  return (
    <div className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''} ${isFirst ? styles.faqItemFirst : ''}`}>
      <button className={styles.faqRow} onClick={onToggle} aria-expanded={isOpen} aria-controls={`faq-answer-${faq.id}`}>
        <span className={styles.faqQuestion}>{faq.question}</span>
        <IoIosArrowDown size={24} className={styles.caretIcon} aria-hidden="true" />
      </button>

      <div
        ref={answerRef}
        className={styles.answerInner}
        id={`faq-answer-${faq.id}`}
        role="region"
        aria-label={faq.question}
      >
        <p className={styles.expandedAnswer}>{faq.answer}</p>
      </div>
    </div>
  )
}

const FAQ_INITIAL_COUNT = 4

const LandingFaq = () => {
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null)
  const [showAll, setShowAll] = useState(false)

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id))

  return (
    <section className={styles.section} id="banner_faq">
      <div className={styles.container}>
        {/* Left: label + heading + description */}
        <div className={styles.left}>
          <div className={styles.eyebrow} aria-hidden="true">
            <div className={styles.bracketWrap}>
              <span className={styles.bracketTL} />
              <span className={styles.bracketBL} />
            </div>
            <span className={styles.eyebrowText}>FAQ</span>
            <div className={styles.bracketWrap}>
              <span className={styles.bracketTR} />
              <span className={styles.bracketBR} />
            </div>
          </div>

          <h2 className={styles.heading}>
            <span className={styles.headingDark}>Frequently{'\n'}asked </span>
            <span className={styles.headingLight}>questions</span>
          </h2>

          <p className={styles.description}>Build your brand stronger with premium web3 digital identities just for you.</p>
        </div>

        {/* Right: accordion */}
        <div className={styles.right}>
          {(showAll ? FAQS : FAQS.slice(0, FAQ_INITIAL_COUNT)).map((faq, index) =>
            React.createElement(
              React.Fragment,
              { key: String(faq.id) },
              index > 0 ? <div className={styles.divider} aria-hidden="true" /> : null,
              <FaqItem faq={faq} isOpen={openId === faq.id} onToggle={() => toggle(faq.id)} isFirst={index === 0} />,
            )
          )}
          {FAQS.length > FAQ_INITIAL_COUNT && (
            <div>
              <button
                className={styles.viewMoreBtn}
                onClick={() => setShowAll(prev => !prev)}
              >
                {showAll ? 'View Less' : 'View More'}
                <IoIosArrowDown className={showAll ? styles.viewMoreArrowOpen : styles.viewMoreArrow} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default LandingFaq
