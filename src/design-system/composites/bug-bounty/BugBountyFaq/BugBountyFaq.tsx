import React, { useState, useCallback, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './BugBountyFaq.module.scss'

const FAQS = [
  {
    q: 'How do I get access to the program?',
    a: 'The program is invite only. Selected testers are personally invited into a private community and granted credentials to the staging environment, kept fully separate from production.',
  },
  {
    q: 'How are rewards calculated?',
    a: 'Rewards are based on severity, not the number of reports you file. Issues are classified as Low, Medium, High, or Critical based on real world impact and how easy they are to exploit, with the security team confirming final severity and reward amount during the bi-weekly review.',
  },
  {
    q: 'What happens if two testers report the same bug?',
    a: 'Rewards are processed first come, first served. Whoever submits a validated report first for a given issue gets the reward, which is why checking the open bug and feedback sheet before submitting matters.',
  },
  {
    q: 'Do I need to be active every day during the testing window?',
    a: 'You need to stay active for the full duration of the testing window and complete assigned tasks within the timelines shared by the program team. Testers who do not meet these expectations may be rotated out to make room for others on the waitlist.',
  },
  {
    q: 'What happens after the program ends?',
    a: 'Top performers get first consideration for opportunities beyond the program, including early access to future releases, paid research invitations, ambassador roles, and public recognition as founding testers once Endless Domains goes to public launch.',
  },
]

export function BugBountyFaq() {
  const [openIndex, setOpenIndex] = useState(0)

  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEntranceAnimation([leftRef, rightRef])

  const toggle = useCallback((i: number) => {
    setOpenIndex(prev => (prev === i ? -1 : i))
  }, [])

  return (
    <section className={styles.section} aria-labelledby="bug-bounty-faq-heading">

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

            <h2 id="bug-bounty-faq-heading" className={styles.heading}>
              <span className={styles.headingBlack}>Frequently</span>
              <span className={styles.headingBlue}>asked questions</span>
            </h2>

            <p className={styles.description}>Answers to your most common bug bounty program questions</p>

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
                aria-controls={`bug-bounty-faq-panel-${i}`}
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
                <div id={`bug-bounty-faq-panel-${i}`} className={styles.itemPanel} role="region">
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

export default BugBountyFaq
