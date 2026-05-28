import { useState, useCallback } from 'react'
import Image from 'next/image'
import { MdContentCopy, MdCheck } from 'react-icons/md'

import { getDomainProvider } from '@/helpers/chaincurrency/chaincurrency'
import styles from './FreenameDomainDetails.module.scss'

interface FreenameDomainDetailsProps {
  domain: string
  orderId: string
  status: string
}

function parseDomain(fullName: string): { name: string; tld: string } {
  const lastDot = fullName.lastIndexOf('.')
  if (lastDot === -1) return { name: fullName, tld: '' }
  return { name: fullName.slice(0, lastDot), tld: fullName.slice(lastDot) }
}

export function FreenameDomainDetails({ domain, orderId, status }: FreenameDomainDetailsProps) {
  const [copied, setCopied] = useState(false)
  const { name, tld } = parseDomain(domain)
  const provider = getDomainProvider('Freename')!

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [orderId])

  const isActive = status.toLowerCase() === 'active'

  return (
    <div className={styles.wrapper}>

      {/* ── Top banner: avatar + domain name ────────────────────────────── */}
      <div className={styles.banner}>
        <div className={styles.avatarWrap}>
          <Image
            src={provider.image}
            alt={provider.label}
            width={41}
            height={41}
            className={styles.avatarImg}
          />
        </div>

        <div className={styles.nameCol}>
          <div className={styles.nameRow}>
            <h1 className={styles.domainName}>{name}</h1>
            <span className={styles.tldBadge}>{tld}</span>
          </div>
          <p className={styles.providerLabel}>freename</p>
        </div>
      </div>

      {/* ── Accent strip ─────────────────────────────────────────────────── */}
      <div className={styles.strip} aria-hidden="true" />

      {/* ── Info row: provider / order id / status ───────────────────────── */}
      <dl className={styles.infoRow}>

        <div className={styles.field}>
          <dt className={styles.fieldLabel}>Chain Provider</dt>
          <dd className={styles.fieldBox}>
            <div className={styles.chainIconWrap} aria-hidden="true">
              <Image src={provider.image} alt="" width={18} height={18} />
            </div>
            <span className={styles.fieldText}>{provider.label}</span>
          </dd>
        </div>

        <div className={`${styles.field} ${styles.fieldOrderId}`}>
          <dt className={styles.fieldLabel}>Order ID</dt>
          <dd className={styles.fieldBox}>
            <span className={styles.orderIdText}>{orderId}</span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy order ID'}
            >
              {copied
                ? <MdCheck size={18} aria-hidden="true" />
                : <MdContentCopy size={18} aria-hidden="true" />}
            </button>
          </dd>
        </div>

        <div className={styles.field}>
          <dt className={styles.fieldLabel}>Status</dt>
          <dd className={styles.fieldBox}>
            <span
              className={isActive ? styles.statusDotActive : styles.statusDotInactive}
              aria-hidden="true"
            />
            <span className={styles.fieldText}>{status}</span>
          </dd>
        </div>

      </dl>
    </div>
  )
}

export default FreenameDomainDetails
