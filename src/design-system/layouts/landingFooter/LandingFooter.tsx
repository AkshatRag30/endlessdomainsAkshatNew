import React, { FormEvent, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaDiscord, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { BsTelegram, BsYoutube } from 'react-icons/bs'

import PrimaryButton from '@/design-system/primitives/buttons/primary-button'
import styles from './LandingFooter.module.scss'

// Static replica of the real site's Footer — same visual design, but with the
// newsletter form and marketplace redirect stripped of their real API calls, since
// this project exists purely for a design review of the landing page.

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

interface NavLink {
  label: string
  href: string
}

interface NavColumn {
  heading: string
  links: NavLink[]
}

const NAV_COLUMNS: NavColumn[] = [
  {
    heading: 'Company',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About us', href: '/about-us' },
      { label: 'Blogs', href: '/blog' },
      { label: 'Events', href: '/events' },
      { label: 'Community', href: '/community' },
      { label: 'Bug Bounty', href: '/bug-bounty' },
    ],
  },
  {
    heading: 'Identity OS',
    links: [
      { label: 'Marketplace', href: 'https://marketplace.endlessdomains.io/' },
      { label: 'Web3 Domains', href: '/web3-domains' },
      { label: 'Parked Domains', href: '/parked-domains' },
      { label: 'Reputation', href: '/profile/reputation' },
      { label: 'Perks & Rewards', href: '/perks' },
      { label: 'Say GM', href: '/saygm' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help & Support', href: 'https://support.endlessdomains.io/support/home' },
      { label: 'Contact us', href: 'mailto:support@endlessdomains.io' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-condition' },
    ],
  },
]

const SOCIALS: { href: string; icon: React.ReactNode; label: string }[] = [
  { href: 'https://twitter.com/endlessdomains', icon: <FaXTwitter />, label: 'Twitter/X' },
  { href: 'https://www.linkedin.com/company/endlessdomains', icon: <FaLinkedinIn />, label: 'LinkedIn' },
  { href: 'https://discord.gg/GweCjzJDjF', icon: <FaDiscord />, label: 'Discord' },
  { href: 'https://www.instagram.com/endlessdomains', icon: <FaInstagram />, label: 'Instagram' },
  { href: 'https://www.facebook.com/endlessdomains', icon: <FaFacebookF />, label: 'Facebook' },
  { href: 'https://www.youtube.com/@endlessdomainsofficials', icon: <BsYoutube />, label: 'Youtube' },
  { href: 'https://t.me/endlessdomainscommunity', icon: <BsTelegram />, label: 'Telegram' },
]

const PixelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden="true">
    <path
      d="M1.73135 7.48867e-05V1.73052H0L0 3.46186C0.578021 3.4618 1.15335 3.46273 1.73135 3.46273V5.1941H3.46271V6.92544H5.19406L5.19406 8.6568L6.92539 8.65766V10.3881H5.19404V12.1194H3.46271V13.8491H1.73135L1.73135 15.5813H0L0 17.3127C0.577956 17.3126 1.15338 17.3135 1.73135 17.3135L1.73135 19.0449H5.19406L5.19494 17.3135C5.77325 17.3136 6.3488 17.3127 6.92712 17.3127V15.5822H8.65677V13.8508H10.3881V12.1211H12.1195V10.3889H13.8508V8.65757C13.273 8.65844 12.6965 8.65671 12.1195 8.65671V6.92537H10.3881V5.19402H8.6568V3.46265L6.92709 3.46179V1.73046L5.19489 1.73046V0.00164751L5.19402 0L1.73135 7.48867e-05Z"
      fill="white"
    />
  </svg>
)

const NavColumnComponent = ({ heading, links }: NavColumn) => (
  <div className={styles.footer_nav_links}>
    <h3 className={styles.nav_heading}>{heading}</h3>
    <nav className={styles.nav_column}>
      {links.map(({ label, href }) => {
        const isExternal = href.startsWith('http') || href.startsWith('mailto')
        return (
          <Link key={`${label}-${href}`} href={href} className={styles.media_link} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}>
            {label}
          </Link>
        )
      })}
    </nav>
  </div>
)

export function LandingFooter() {
  const [email, setEmail] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // No real subscribe endpoint in this project — just a static success state so
  // the form still reads as "working" for a design review, without a network call.
  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')
    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage('Invalid Email!')
      return
    }
    setShowSuccess(true)
    setTimeout(() => {
      setEmail('')
      setShowSuccess(false)
    }, 5000)
  }

  return (
    <footer className={styles.custom_border}>
      <div className={styles.border} />

      <section className={styles.footer_section}>
        <div className={styles.footer_inner}>
          <div className={styles.footer_brand}>
            <Image src="/new-assets/header/footer-logo.svg" alt="Endless Domains" width={200} height={60} className={styles.footer_logo} loading="lazy" />
            <p className={styles.footer_tagline}>The OS for On-Chain Identity. Your reputation, rewards, and utility. Permanently yours.</p>
            <div className={styles.btn_help}>
              <PrimaryButton dark icon={<PixelIcon />} iconPosition="right">
                Get Your Identity
              </PrimaryButton>
            </div>
          </div>

          <div className={styles.footer_nav_wrapper}>
            <div className={styles.footer_nav_row}>
              {NAV_COLUMNS.map(col => (
                <NavColumnComponent key={col.heading} heading={col.heading} links={col.links} />
              ))}
            </div>

            <ul className={styles.footer_socials} aria-label="Social media links">
              {SOCIALS.map(({ href, icon, label }) => (
                <li key={label}>
                  <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    {icon}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <div className={styles.gradient_overlay} aria-hidden="true" />

      <div className={styles.footer_bottom}>
        <div className={styles.subscribe_wrapper}>
          <div className={styles.subscribe_banner}>
            <p className={styles.newsletter_heading}>Stay Ahead. Get Identity OS Updates.</p>
            <div className={styles.subscribe_form_wrap}>
              <form onSubmit={handleSubscribe} className={styles.subscribe_form} noValidate>
                {!showSuccess ? (
                  <>
                    <input
                      id="subscribeEmail"
                      name="subscribeEmail"
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value)
                        setErrorMessage('')
                      }}
                      className={errorMessage ? styles.input_error : ''}
                      aria-label="Email address for newsletter"
                    />
                    <button type="submit" aria-label="Subscribe to newsletter">
                      Subscribe
                    </button>
                  </>
                ) : (
                  <p className={styles.success_msg} role="status">
                    Thank you for subscribing!
                  </p>
                )}
                {errorMessage && (
                  <p className={styles.error_msg} role="alert">
                    {errorMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer_copyright}>
        <span>©2026 Magic Fly Labs Limited. All rights reserved.</span>
        <Link href="mailto:support@endlessdomains.io">Support: support@endlessdomains.io</Link>
      </div>
    </footer>
  )
}

export default LandingFooter
