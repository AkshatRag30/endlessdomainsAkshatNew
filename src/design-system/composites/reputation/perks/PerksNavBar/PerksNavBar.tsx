import Image from 'next/image'
import Link from 'next/link'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { HiArrowUpRight } from 'react-icons/hi2'
import { RiMenuLine } from 'react-icons/ri'
import { TbCircleDot } from 'react-icons/tb'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { GoldStatsDropdown } from '@/design-system/primitives/perks/GoldStatsDropdown'
import { NAV_LINKS } from '../perks.data'
import endlessLogo from '../../../../../../public/user-profile/endlessnewlogo.svg'
import fireGif from '../../../../../../public/reputation/fire.gif'
import styles from './PerksNavBar.module.scss'

// ── Types ─────────────────────────────────────────────────────────────────────

export type GoldButtonVariant = 'gold' | 'enable-rep' | 'connect-wallet'

// ── Component ─────────────────────────────────────────────────────────────────

interface PerksNavBarProps {
  onGoldClick: () => void
  goldButtonVariant?: GoldButtonVariant
}

export function PerksNavBar({ onGoldClick, goldButtonVariant = 'gold' }: PerksNavBarProps) {
  return (
    <nav className={styles.perksNav} aria-label="Perks page navigation">
      <div className={styles.perksNavInner}>

        {/* Logo — responsive wrapper lets CSS control width at each breakpoint */}
        <Link href="/" className={styles.perksNavLogo} aria-label="Endless Domains home">
          <div className={styles.perksNavLogoWrap}>
            <Image src={endlessLogo} alt="Endless Domains" fill sizes="112px" />
          </div>
        </Link>

        {/* Nav links — hidden on tablet and below */}
        <ul className={styles.perksNavLinks} role="list">
          {NAV_LINKS.map(link => (
            <li key={link.label}>
              <Link href={link.href} className={styles.perksNavLink}>
                <span className={styles.perksNavBracket} aria-hidden="true">[</span>
                <span className={styles.perksNavLinkText}>{link.label}</span>
                <HiArrowUpRight size={8} aria-hidden="true" />
                <span className={styles.perksNavBracket} aria-hidden="true">]</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className={styles.perksNavActions}>

          {/* Gold area — three variants: gold (default), enable-rep, connect-wallet */}
          {goldButtonVariant === 'gold' && (
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
          )}

          {goldButtonVariant === 'enable-rep' && (
            <button
              type="button"
              className={styles.perksNavEnableRep}
              onClick={onGoldClick}
              aria-label="Enable Reputation"
            >
              <TbCircleDot size={22} aria-hidden="true" />
              <span className={styles.perksNavBtnLabel}>Enable Rep.</span>
            </button>
          )}

          {goldButtonVariant === 'connect-wallet' && (
            <PrimaryButton
              variant="transparent"
              onClick={onGoldClick}
              icon={<Image src={fireGif} alt="" width={20} height={20} aria-hidden="true" unoptimized className={styles.connectWalletFire} />}
              iconPosition="left"
              aria-label="Connect Wallet"
              className={styles.connectWalletBtn}
            >
              Connect Wallet
            </PrimaryButton>
          )}

          {/* Menu button — desktop: dark PrimaryButton with text; tablet/mobile: blue icon-only */}
          <div className={styles.menuDesktop}>
            <PrimaryButton variant="dark" icon={<RiMenuLine size={18} aria-hidden="true" />} iconPosition="right" aria-label="Open menu">
              Menu
            </PrimaryButton>
          </div>
          <button type="button" className={styles.menuMobile} aria-label="Open menu">
            <RiMenuLine size={20} aria-hidden="true" />
          </button>

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
