import { useCallback, useState } from 'react'
import { FaTag } from 'react-icons/fa'
import { BsFileText } from 'react-icons/bs'
import { MdContentCopy, MdCheck } from 'react-icons/md'
import styles from './MyPerks.module.scss'

// ── Types ──────────────────────────────────────────────────────────────────────

type PerkType = 'promo-code' | 'link'
type IconVariant = 'green-tag' | 'blue-protocol' | 'black-document'

interface Perk {
  id: string
  type: PerkType
  icon: IconVariant
  title: string
  partner: string
  date: string
  badge: string
  value: string
  cta: string
}

// ── Demo data (will be replaced on integration) ────────────────────────────────

const DEMO_PERKS: Perk[] = [
  {
    id: '1', type: 'promo-code', icon: 'green-tag',
    title: '20% Off Store',     partner: 'PartnerCo', date: 'Apr 20, 2025',
    badge: 'Promo Code',        value: 'SAVE20NOW',   cta: 'Redeem',
  },
  {
    id: '2', type: 'link',      icon: 'blue-protocol',
    title: 'Early Access Beta', partner: 'PartnerCo', date: 'Apr 20, 2025',
    badge: 'Link',              value: 'https://beta.protocolxyz.io/early-ac...', cta: 'Open',
  },
  {
    id: '3', type: 'promo-code', icon: 'black-document',
    title: 'Whitelist Spot',    partner: 'PartnerCo', date: 'Apr 20, 2025',
    badge: 'Promo Code',        value: 'SAVE20NOW',   cta: 'Redeem',
  },
  {
    id: '4', type: 'promo-code', icon: 'black-document',
    title: 'Whitelist Spot',    partner: 'PartnerCo', date: 'Apr 20, 2025',
    badge: 'Promo Code',        value: 'SAVE20NOW',   cta: 'Redeem',
  },
  {
    id: '5', type: 'promo-code', icon: 'green-tag',
    title: '20% Off Store',     partner: 'PartnerCo', date: 'Apr 20, 2025',
    badge: 'Promo Code',        value: 'SAVE20NOW',   cta: 'Redeem',
  },
  {
    id: '6', type: 'link',      icon: 'blue-protocol',
    title: 'Early Access Beta', partner: 'PartnerCo', date: 'Apr 20, 2025',
    badge: 'Link',              value: 'https://beta.protocolxyz.io/early-ac...', cta: 'Open',
  },
]

// ── Perk icon ─────────────────────────────────────────────────────────────────

const ProtocolIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="3"  r="2.2" fill="white" />
    <circle cx="3"  cy="14" r="2.2" fill="white" />
    <circle cx="17" cy="14" r="2.2" fill="white" />
    <line x1="10" y1="5"  x2="3"  y2="12" stroke="white" strokeWidth="1.2" />
    <line x1="10" y1="5"  x2="17" y2="12" stroke="white" strokeWidth="1.2" />
    <line x1="3"  y1="14" x2="17" y2="14" stroke="white" strokeWidth="1.2" />
  </svg>
)

const PerkIcon = ({ variant }: { variant: IconVariant }) => {
  if (variant === 'green-tag') {
    return (
      <div className={`${styles.iconWrap} ${styles.iconGreen}`}>
        <FaTag className={styles.iconSvg} aria-hidden="true" />
      </div>
    )
  }
  if (variant === 'blue-protocol') {
    return (
      <div className={`${styles.iconWrap} ${styles.iconBlue}`}>
        <ProtocolIcon />
      </div>
    )
  }
  return (
    <div className={`${styles.iconWrap} ${styles.iconBlack}`}>
      <BsFileText className={styles.iconSvg} aria-hidden="true" />
    </div>
  )
}

// ── Arrow right ───────────────────────────────────────────────────────────────

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10H16M16 10L11 5M16 10L11 15"
      stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ── Individual perk card ──────────────────────────────────────────────────────

const PerkCard = ({ perk }: { perk: Perk }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(perk.value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [perk.value])

  return (
    <article className={styles.card} aria-label={perk.title}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <PerkIcon variant={perk.icon} />
          <div className={styles.headerText}>
            <p className={styles.perkTitle}>{perk.title}</p>
            <p className={styles.perkMeta}>by {perk.partner} · {perk.date}</p>
          </div>
        </div>
        <span className={styles.badge} aria-label={`Type: ${perk.badge}`}>
          {perk.badge}
        </span>
      </div>

      {/* ── Separator ──────────────────────────────────────────────────── */}
      <div className={styles.sep} aria-hidden="true" />

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className={styles.cardContent}>
        {/* Value field (code or link) */}
        <div className={styles.valueField}>
          <span className={styles.valueText}>{perk.value}</span>
          <button
            type="button"
            className={styles.copyBtn}
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : `Copy ${perk.type === 'promo-code' ? 'code' : 'link'}`}
          >
            {copied
              ? <MdCheck className={styles.copyIcon} aria-hidden="true" />
              : <MdContentCopy className={styles.copyIcon} aria-hidden="true" />
            }
          </button>
        </div>

        {/* CTA button */}
        <button type="button" className={styles.ctaBtn} aria-label={perk.cta}>
          <span>{perk.cta}</span>
          <ArrowRight />
        </button>
      </div>

    </article>
  )
}

// ── MyPerks main component ─────────────────────────────────────────────────────

export default function MyPerks() {
  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        {DEMO_PERKS.map(perk => (
          <PerkCard key={perk.id} perk={perk} />
        ))}
      </div>
    </div>
  )
}
