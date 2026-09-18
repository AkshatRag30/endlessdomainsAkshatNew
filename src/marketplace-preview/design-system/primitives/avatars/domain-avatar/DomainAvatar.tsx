import React from 'react'
import type { Chain } from '@/marketplace-preview/types/marketplace'
import { getProviderForChainId } from '@/marketplace-preview/helpers/chaincurrency/chaincurrency'
import styles from './DomainAvatar.module.scss'

export interface DomainAvatarProps {
  /** When given and its chain resolves to a known provider, shows that provider's real logo instead of the generic glyph below. */
  chain?: Chain
  className?: string
}

/**
 * Figma nodes 375:51245/375:51247 ("token"/"Avatar"/"ENS" group) show every
 * card and row using the same generic circular mark, not a per-domain
 * image — this now renders the domain's real chain/provider logo (via the
 * ported chaincurrency helper) when one resolves, since that's real,
 * available information, not a guess at bespoke per-domain art. Falls back
 * to the original generic glyph when no chain is passed or it doesn't
 * resolve to a known provider.
 */
export const DomainAvatar = ({ chain, className = '' }: DomainAvatarProps) => {
  const provider = chain ? getProviderForChainId(chain.id) : undefined
  const shellClass = [styles.avatar, provider ? styles.avatarLogo : '', className].filter(Boolean).join(' ')

  if (provider) {
    return (
      <span className={shellClass}>
        <img src={provider.image} alt="" aria-hidden="true" className={styles.logo} />
      </span>
    )
  }

  return (
    <span className={shellClass} aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
        <ellipse cx="8" cy="8" rx="2.8" ry="6.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M1.7 8H14.3" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    </span>
  )
}

export default DomainAvatar
