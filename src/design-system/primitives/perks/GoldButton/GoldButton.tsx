import Image from 'next/image'
import { FiCheck } from 'react-icons/fi'
import { TbCircleDot } from 'react-icons/tb'
import fireGif from '../../../../../public/reputation/fire.gif'
import styles from './GoldButton.module.scss'

// ── Types ─────────────────────────────────────────────────────────────────────

export type GoldButtonVariant =
  | 'default'       // has not GM'd today
  | 'gmed'          // has already GM'd today
  | 'enable-rep'    // reputation not enabled
  | 'connect-wallet' // rep enabled but wallet not connected

export interface GoldButtonProps {
  variant?: GoldButtonVariant
  goldCount?: number
  onClick?: () => void
  className?: string
  'aria-label'?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GoldButton({
  variant = 'default',
  goldCount = 0,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}: GoldButtonProps) {
  const isGold = variant === 'default' || variant === 'gmed'
  const showFire = isGold

  const variantKey = variant.replace(/-/g, '_')
  const variantClass = styles[`goldBtn_${variantKey}` as keyof typeof styles]

  const defaultAriaLabel =
    variant === 'default' ? `${goldCount} Gold — GM to earn more` :
    variant === 'gmed' ? `${goldCount} Gold — GM completed today` :
    variant === 'enable-rep' ? 'Enable Reputation to earn Gold' :
    'Connect Wallet to enable Reputation'

  return (
    <button
      type="button"
      className={[styles.goldBtn, variantClass, className].filter(Boolean).join(' ')}
      onClick={onClick}
      aria-label={ariaLabel ?? defaultAriaLabel}
    >

      {/* Fire GIF — default, gmed, connect-wallet */}
      {showFire && (
        <Image
          src={fireGif}
          alt=""
          width={22}
          height={22}
          aria-hidden="true"
          unoptimized
          className={styles.fireImg}
        />
      )}

      {/* Concentric ring icon — enable-rep only */}
      {variant === 'enable-rep' && (
        <span className={styles.enableIcon}>
          <TbCircleDot size={20} aria-hidden="true" />
        </span>
      )}

      {/* Gold count + label */}
      {isGold && (
        <>
          <span className={styles.goldNum}>{goldCount}</span>
          <span className={styles.goldText}>Gold</span>
        </>
      )}

      {/* Action text — non-gold states */}
      {variant === 'enable-rep' && <span className={styles.actionText}>Enable Rep.</span>}
      {variant === 'connect-wallet' && <span className={styles.actionText}>Connect Wallet</span>}

      {/* Checkmark — gmed only */}
      {variant === 'gmed' && <FiCheck className={styles.checkIcon} aria-hidden="true" />}

    </button>
  )
}

export default GoldButton
