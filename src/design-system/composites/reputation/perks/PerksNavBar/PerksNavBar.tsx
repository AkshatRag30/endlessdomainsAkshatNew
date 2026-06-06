import Image from 'next/image'
import Link from 'next/link'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { GoldStatsDropdown } from '@/design-system/primitives/perks/GoldStatsDropdown'
import { NAV_LINKS } from '../perks.data'
import endlessLogo from '../../../../../../public/user-profile/endlessnewlogo.svg'
import fireGif from '../../../../../../public/reputation/fire.gif'
import styles from './PerksNavBar.module.scss'

// ── Icon primitives ───────────────────────────────────────────────────────────

const ArrowUpRight = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
    <path d="M1.5 6.5L6.5 1.5M6.5 1.5H2.5M6.5 1.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const HamburgerIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
    <rect y="0" width="20" height="2" rx="1" fill="white" />
    <rect y="7" width="20" height="2" rx="1" fill="white" />
    <rect y="14" width="20" height="2" rx="1" fill="white" />
  </svg>
)

// ── Component ─────────────────────────────────────────────────────────────────

interface PerksNavBarProps {
  onGoldClick: () => void
}

export function PerksNavBar({ onGoldClick }: PerksNavBarProps) {
  return (
    <nav className={styles.perksNav} aria-label="Perks page navigation">
      <div className={styles.perksNavInner}>

        {/* Logo */}
        <Link href="/" className={styles.perksNavLogo} aria-label="Endless Domains home">
          <Image src={endlessLogo} alt="Endless Domains" width={112} height={40} />
        </Link>

        {/* Nav links */}
        <ul className={styles.perksNavLinks} role="list">
          {NAV_LINKS.map(link => (
            <li key={link.label}>
              <Link href={link.href} className={styles.perksNavLink}>
                <span className={styles.perksNavBracket} aria-hidden="true">[</span>
                <span className={styles.perksNavLinkText}>{link.label}</span>
                <ArrowUpRight />
                <span className={styles.perksNavBracket} aria-hidden="true">]</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className={styles.perksNavActions}>

          {/* Gold counter — hover shows GoldStatsDropdown, click opens GM modal */}
          <div className={styles.goldHoverWrap}>
            <div
              className={styles.perksNavGold}
              role="button"
              tabIndex={0}
              onClick={onGoldClick}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onGoldClick()}
              aria-label="12 Gold — click to GM"
              aria-haspopup="dialog"
            >
              <Image src={fireGif} alt="" width={24} height={24} aria-hidden="true" unoptimized />
              <span className={styles.perksNavGoldNum}>12</span>
              <span className={styles.perksNavGoldLabel}>Gold</span>
            </div>
            <GoldStatsDropdown className={styles.goldDropdown} />
          </div>

          {/* Menu button */}
          <PrimaryButton variant="dark" icon={<HamburgerIcon />} iconPosition="right" aria-label="Open menu">
            Menu
          </PrimaryButton>

          {/* Cart */}
          <button type="button" className={styles.perksNavCart} aria-label="Open cart">
            <HiOutlineShoppingCart className={styles.perksNavCartIcon} />
          </button>

        </div>
      </div>
    </nav>
  )
}

export default PerksNavBar
