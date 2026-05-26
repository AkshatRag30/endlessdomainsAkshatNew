import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { FiCopy } from 'react-icons/fi'
import { FaDiscord, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import styles from './WaitlistSuccessHero.module.scss'

export function WaitlistSuccessHero() {
  const [copied, setCopied] = useState<'link' | 'code' | null>(null)

  const referralLink = 'endlessdomains.io/waitlist?ref=ED-A7K2-X9PQ'
  const referralCode = 'ED-A7K2-X9PQ'

  const handleCopy = useCallback((text: string, field: 'link' | 'code') => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  return (
    <section className={styles.section} aria-labelledby="success-hero-heading">
      <div className={styles.inner}>

        {/* ── Left column ── */}
        <div className={styles.left}>
          <div className={styles.phaseTag}>
            <p className={styles.phaseText}>WAITLISTED #001</p>
          </div>

          <h1 id="success-hero-heading" className={styles.heading}>
            Your Score Is
            <br />
            <mark className={styles.accent}>Already Waiting.</mark>
          </h1>

          <p className={styles.description}>
            50 points credited. A rewarding journey starts here. The first 500 unlock exclusive
            benefits at the OS Reveal that cannot be earned, bought, or claimed after. Your rank
            is everything
          </p>

          {/* ── Stats ── */}
          <div className={styles.statsRow} role="list" aria-label="Your waitlist statistics">
            <div className={styles.stat} role="listitem">
              <div className={styles.bracketBox}>
                <p className={styles.statValue}>5K+</p>
                <p className={styles.statLabel}>Points Earned</p>
              </div>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat} role="listitem">
              <div className={styles.bracketBox}>
                <p className={styles.statValue}>#247</p>
                <p className={styles.statLabel}>Current Rank</p>
              </div>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat} role="listitem">
              <div className={styles.bracketBox}>
                <p className={styles.statValue}>0</p>
                <p className={styles.statLabel}>Referrals</p>
              </div>
            </div>
          </div>

          {/* ── How to Climb ── */}
          <div className={styles.climbSection}>
            <p className={styles.climbHeading}>How to Climb</p>
            <ul className={styles.climbList}>
              <li className={styles.climbItem}>
                Copy your referral link and share it on X, Discord, or Telegram. The OS pre-fills the message for you.
              </li>
              <li className={styles.climbItem}>
                Every person who registers through your link earns you 100 points instantly. No cap, no limit.
              </li>
              <li className={styles.climbItem}>
                Top 500 at the OS Reveal unlock early access and tier-based rewards. Your rank is permanent.
              </li>
            </ul>
          </div>
        </div>

        {/* ── Connector — static base + animated glow layer ── */}
        <div className={styles.connectorWrap} aria-hidden="true">
          {/* Base: original SVG at low opacity, never moves */}
          <Image
            src="/waitlist/Group 2085666369.svg"
            alt=""
            width={380}
            height={130}
            className={styles.connectorBase}
          />
          {/* Glow: inline SVG using same paths reversed (left→right) for energy-flow animation */}
          <svg
            className={styles.connectorGlow}
            viewBox="0 0 317 109"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bottom band centre-line — reversed to travel left→right */}
            <path
              className={styles.glowPath1}
              d="M13.5 26.5H105.601C107.457 26.5 109.237 27.2375 110.55 28.5503L170.45 88.4497C171.763 89.7625 173.543 90.5 175.399 90.5H315.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Top band centre-line — reversed, delayed for depth */}
            <path
              className={styles.glowPath2}
              d="M15 82H107.101C108.957 82 110.737 81.2625 112.05 79.9497L171.95 20.0503C173.263 18.7375 175.043 18 176.899 18H317"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* ── Right column ── */}
        <div className={styles.right}>
          <div className={styles.formFrame}>
            <span className={`${styles.dot} ${styles.topLeft}`}     aria-hidden="true" />
            <span className={`${styles.dot} ${styles.bottomLeft}`}  aria-hidden="true" />
            <span className={`${styles.dot} ${styles.topRight}`}    aria-hidden="true" />
            <span className={`${styles.dot} ${styles.bottomRight}`} aria-hidden="true" />

            <div className={styles.referralWrap}>
              <div className={styles.referralCard}>

                {/* Panel 1: referral fields + quote */}
                <div className={styles.panel}>
                  <div className={styles.panelBody}>

                    {/* Referral link */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Your referral link</label>
                      <div className={styles.inputRow}>
                        <span className={styles.inputValue}>{referralLink}</span>
                        <button
                          type="button"
                          className={styles.copyBtn}
                          onClick={() => handleCopy(referralLink, 'link')}
                          aria-label={copied === 'link' ? 'Copied!' : 'Copy referral link'}
                        >
                          <FiCopy aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Referral code */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Referral code</label>
                      <div className={styles.inputRow}>
                        <span className={styles.inputValue}>{referralCode}</span>
                        <button
                          type="button"
                          className={styles.copyBtn}
                          onClick={() => handleCopy(referralCode, 'code')}
                          aria-label={copied === 'code' ? 'Copied!' : 'Copy referral code'}
                        >
                          <FiCopy aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Quote */}
                    <p className={styles.quote}>
                      &ldquo;The OS is almost live. I registered my node. Claim yours before the top
                      500 fills up. endlessdomains.io/waitlist?ref=ED-A7K2-X9PQ&rdquo;
                    </p>

                  </div>
                </div>

                {/* Connector ticks */}
                <div className={styles.connTicks} aria-hidden="true">
                  <div className={styles.connTick} />
                  <div className={styles.connTick} />
                  <div className={styles.connTick} />
                </div>

                {/* Panel 2: social */}
                <div className={styles.panel}>
                  <div className={styles.panelBody}>
                    <div className={styles.socialSection}>
                      <p className={styles.socialLabel}>Social Platforms</p>
                      <div className={styles.socialIcons}>
                        <a
                          href="#"
                          className={styles.socialBtn}
                          aria-label="Share on Discord"
                          rel="noopener noreferrer"
                        >
                          <FaDiscord aria-hidden="true" />
                        </a>
                        <a
                          href="#"
                          className={styles.socialBtn}
                          aria-label="Share on Instagram"
                          rel="noopener noreferrer"
                        >
                          <FaInstagram aria-hidden="true" />
                        </a>
                        <a
                          href="#"
                          className={styles.socialBtn}
                          aria-label="Share on LinkedIn"
                          rel="noopener noreferrer"
                        >
                          <FaLinkedinIn aria-hidden="true" />
                        </a>
                        <a
                          href="#"
                          className={styles.socialBtn}
                          aria-label="Share on X"
                          rel="noopener noreferrer"
                        >
                          <FaTwitter aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default WaitlistSuccessHero
