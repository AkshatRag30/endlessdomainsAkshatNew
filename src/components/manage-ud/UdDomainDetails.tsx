import { useState, useCallback } from 'react'
import Image from 'next/image'
import { MdContentCopy, MdCheck } from 'react-icons/md'
import { SiPolygon } from 'react-icons/si'

import styles from './UdDomainDetails.module.scss'

interface UdDomainDetailsProps {
  domain: string
  owner: string
  expiry: string
}

function parseDomain(fullName: string): { name: string; tld: string } {
  const lastDot = fullName.lastIndexOf('.')
  if (lastDot === -1) return { name: fullName, tld: '' }
  return { name: fullName.slice(0, lastDot), tld: fullName.slice(lastDot) }
}

function formatExpiry(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export function UdDomainDetails({ domain, owner, expiry }: UdDomainDetailsProps) {
  const [copied, setCopied] = useState(false)
  const { name, tld } = parseDomain(domain)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(owner)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [owner])

  return (
    <div className={styles.wrapper}>

      {/* ── Top banner: avatar + domain name ────────────────────────────── */}
      <div className={styles.banner}>
        <div className={styles.avatarWrap}>
          <Image
            src="/domain/ud.svg"
            alt="Unstoppable Domains"
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
          <p className={styles.providerLabel}>unstoppable domains</p>
        </div>
      </div>

      {/* ── Blue accent strip ────────────────────────────────────────────── */}
      <div className={styles.strip} aria-hidden="true" />

      {/* ── Info row: chain / owner / expiry ────────────────────────────── */}
      <dl className={styles.infoRow}>

        <div className={styles.field}>
          <dt className={styles.fieldLabel}>Chain Provider</dt>
          <dd className={styles.fieldBox}>
            <SiPolygon size={22} className={styles.polygonIcon} aria-hidden="true" />
            <span className={styles.fieldText}>Polygon</span>
          </dd>
        </div>

        <div className={`${styles.field} ${styles.fieldOwner}`}>
          <dt className={styles.fieldLabel}>Owner</dt>
          <dd className={styles.fieldBox}>
            <span className={styles.ownerAddress}>{owner}</span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy owner address'}
            >
              {copied
                ? <MdCheck size={18} aria-hidden="true" />
                : <MdContentCopy size={18} aria-hidden="true" />}
            </button>
          </dd>
        </div>

        <div className={styles.field}>
          <dt className={styles.fieldLabel}>Expiry</dt>
          <dd className={styles.fieldBox}>
            <span className={styles.expiryDot} aria-hidden="true" />
            <span className={styles.fieldText}>{formatExpiry(expiry)}</span>
          </dd>
        </div>

      </dl>
    </div>
  )
}

export default UdDomainDetails
