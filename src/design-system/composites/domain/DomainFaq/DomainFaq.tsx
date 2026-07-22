import React, { useState, useCallback, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './DomainFaq.module.scss'

function goToSupport() {
  window.location.href = '/support'
}

const FAQ_ITEMS = [
  {
    q: 'What is an on-chain identity?',
    a: 'An on-chain identity is a blockchain-based username that replaces complex wallet addresses with a human-readable name. It acts as your permanent identity across wallets, applications, and networks.',
  },
  {
    q: 'Do I really own my identity?',
    a: 'Yes. Your identity is minted directly to your wallet and remains under your control. No centralized platform can revoke, suspend, or take ownership of it.',
  },
  {
    q: 'Which identity providers and TLDs are supported?',
    a: 'Endless aggregates identities from leading providers including ENS, Unstoppable Domains, Freename, Bonfida, Space ID, and more, giving you access to 70+ TLDs from a single platform.',
  },
  {
    q: 'What can I do with my identity after registration?',
    a: 'Your identity can be used for payments, on-chain login, wallet resolution, reputation building, marketplace trading, and future Identity OS features such as rewards, credentials, and earning opportunities.',
  },
  {
    q: 'What is the Identity OS?',
    a: 'Identity OS is the layer that connects your identities, reputation, activity, and opportunities across Web3. Instead of being just a name, your identity becomes the foundation for how you interact, earn, and build trust on-chain.',
  },
]

export function DomainFaq() {
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
    <section className={styles.section} aria-labelledby="domain-faq-heading">

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

            <h2 id="domain-faq-heading" className={styles.heading}>
              <span className={styles.headingBlack}>Questions About</span>
              <span className={styles.headingBlue}>Your Identity</span>
            </h2>

            <p className={styles.description}>
              Everything you need to know about registering, owning, and using your on-chain identity across the Endless ecosystem.
            </p>

            <PrimaryButton onClick={goToSupport}>
              Support Ticket
            </PrimaryButton>
          </div>
        </div>

        {/* ── Right column — accordion ── */}
        <div className={styles.right} ref={rightRef}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q} className={`${styles.item} ${openIndex === i ? styles.itemOpen : ''}`}>
              <button
                className={styles.itemBtn}
                data-index={i}
                onClick={handleItemClick}
                aria-expanded={openIndex === i}
                aria-controls={`domain-faq-panel-${i}`}
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
                <div id={`domain-faq-panel-${i}`} className={styles.itemPanel} role="region">
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

export default DomainFaq
