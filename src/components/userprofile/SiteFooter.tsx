import React, { useState } from 'react'
import styles from './SiteFooter.module.scss'

// ── Social icon SVGs ─────────────────────────────────────────────────────────

const FacebookIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const XIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const InstagramIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const LinkedInIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

// ── Footer link column ───────────────────────────────────────────────────────

interface FooterLinkColumnProps {
  heading: string
  links: { label: string; href: string }[]
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({ heading, links }) => (
  <div className={styles.linkCol}>
    <h3 className={styles.colHeading}>{heading}</h3>
    <ul className={styles.colLinks}>
      {links.map(link => (
        <li key={link.href}>
          <a href={link.href} className={styles.colLink}>{link.label}</a>
        </li>
      ))}
    </ul>
  </div>
)

// ── Data ──────────────────────────────────────────────────────────────────────

const HOME_LINKS = [
  { label: 'Our Journey', href: '/journey' },
  { label: 'Vision', href: '/vision' },
  { label: 'Community', href: '/community' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Careers', href: '/careers' },
]

const WEB3_LINKS = [
  { label: 'Register Domain', href: '/register' },
  { label: 'List Domain', href: '/list' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Parked Domains', href: '/parked' },
  { label: 'Blogs', href: '/blog' },
]

const MORE_LINKS = [
  { label: 'Events', href: '/events' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Perks & Rewards', href: '/perks' },
  { label: 'Reputation Identity (Coming Soon)', href: '/reputation' },
  { label: 'API Docs (Coming Soon)', href: '/api-docs' },
]

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com', icon: <FacebookIcon /> },
  { label: 'X', href: 'https://x.com', icon: <XIcon /> },
  { label: 'Instagram', href: 'https://instagram.com', icon: <InstagramIcon /> },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: <LinkedInIcon /> },
  { label: 'Facebook', href: 'https://facebook.com', icon: <FacebookIcon /> },
  { label: 'Instagram', href: 'https://instagram.com', icon: <InstagramIcon /> },
]

// ── Component ─────────────────────────────────────────────────────────────────

export const SiteFooter: React.FC = () => {
  const [email, setEmail] = useState('')

  return (
    <footer className={styles.footer} aria-label="Site footer">
      {/* Watermark */}
      <span className={styles.watermark} aria-hidden="true">ENDLESSDOMAINS</span>

      <div className={styles.topRow}>
        {/* Left: logo + tagline + help button */}
        <div className={styles.brand}>
          <a href="/" aria-label="Endless Domains home" className={styles.brandLogoLink}>
            <img
              src="/user-profile/endlesslogowhite.svg"
              alt="Endless Domains"
              className={styles.brandLogo}
            />
          </a>
          <p className={styles.tagline}>
            Web3 digital identity management platform &amp; Marketplace: all in one place
          </p>
          <a href="/support" className={styles.helpBtn}>
            Help &amp; Support
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Center: 3 link columns */}
        <nav className={styles.linkCols} aria-label="Footer navigation">
          <FooterLinkColumn heading="Home" links={HOME_LINKS} />
          <div className={styles.web3Group}>
            <h3 className={styles.colHeading}>Web3 Domains</h3>
            <div className={styles.web3Cols}>
              <FooterLinkColumn heading="" links={WEB3_LINKS} />
              <FooterLinkColumn heading="" links={MORE_LINKS} />
            </div>
          </div>
        </nav>

        {/* Right: social icons */}
        <div className={styles.socials}>
          {SOCIAL_LINKS.map((s, i) => (
            <a
              key={i}
              href={s.href}
              className={styles.socialLink}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Newsletter strip */}
      <div className={styles.newsletter} aria-label="Newsletter signup">
        <p className={styles.newsletterText}>
          Join Newsletter Inform. Inspire. Stay Connected.
        </p>
        <div className={styles.newsletterForm}>
          <input
            type="email"
            className={styles.emailInput}
            placeholder="Enter Your Email Id"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-label="Email address for newsletter"
          />
          <button type="button" className={styles.subscribeBtn} aria-label="Subscribe to newsletter">
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom strip */}
      <div className={styles.bottomStrip}>
        <p className={styles.copyright}>
          ©2026 Magic Fly Labs Limited. All rights reserved.
        </p>
        <div className={styles.legalLinks}>
          <span className={styles.support}>Support: support@endlessdomains.io</span>
          <a href="/privacy" className={styles.legalLink}>Privacy Policy</a>
          <a href="/terms" className={styles.legalLink}>Terms and Condition</a>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
