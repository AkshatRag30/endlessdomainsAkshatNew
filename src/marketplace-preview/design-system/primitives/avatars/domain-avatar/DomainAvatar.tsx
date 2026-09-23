import React from 'react'
import Image from 'next/image'
import { FiGlobe } from 'react-icons/fi'
import { getProviderForExtension, getDomainProviderByName } from '@/marketplace-preview/helpers/chaincurrency/chaincurrency'
import styles from './DomainAvatar.module.scss'

export interface DomainAvatarProps {
  /** The domain's extension (e.g. '.ud', '.eth') — when it resolves to a known naming provider, shows that provider's real logo instead of the generic glyph below. Deliberately not the domain's chain — ChainBadge already shows that, and a domain's registrar isn't the same thing as the network it lives on. */
  extension?: string
  /**
   * Raw `domainProvider`/`blockchain` value from an API (e.g. "Arbitrum",
   * "UD"), tried when `extension` alone doesn't resolve — this platform's
   * own TLDs (.arb, .brave, .chain, ...) aren't external naming services
   * the way .eth/.sol are, so EXTENSION_TO_PROVIDER has no entry for them,
   * but the API already tells us the issuing provider directly.
   */
  domainProvider?: string
  className?: string
}

/**
 * Figma nodes 375:51245/375:51247 ("token"/"Avatar"/"ENS" group) show every
 * card and row using the same generic circular mark, not a per-domain
 * image — this now renders the domain's real naming-provider logo (via the
 * ported chaincurrency helper) when one resolves, since that's real,
 * available information, not a guess at bespoke per-domain art. Tries
 * `extension` first, falls back to `domainProvider` when that doesn't
 * resolve (see its own prop comment), and falls back to the original
 * generic glyph when neither resolves to a known provider.
 */
export const DomainAvatar = ({ extension, domainProvider, className = '' }: DomainAvatarProps) => {
  const provider = (extension ? getProviderForExtension(extension) : undefined) ?? getDomainProviderByName(domainProvider)
  const shellClass = [styles.avatar, provider ? styles.avatarLogo : '', className].filter(Boolean).join(' ')

  if (provider) {
    return (
      <span className={shellClass}>
        <Image src={provider.image} alt="" aria-hidden="true" width={22} height={22} className={styles.logo} />
      </span>
    )
  }

  return (
    <span className={shellClass} aria-hidden="true">
      <FiGlobe size={16} />
    </span>
  )
}

export default DomainAvatar
