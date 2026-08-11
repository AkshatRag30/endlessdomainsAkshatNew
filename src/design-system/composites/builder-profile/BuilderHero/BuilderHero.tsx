import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FiCopy, FiEdit2 } from 'react-icons/fi'

import type { BuilderProfileHero } from '../types'
import styles from './BuilderHero.module.scss'

interface BuilderHeroProps {
  data: BuilderProfileHero
  /** Owner view — swaps the "Copy link" action for an "Edit url" action */
  editable?: boolean
  onEditUrl?: () => void
  onEditName?: () => void
}

export default function BuilderHero({ data, editable = false, onEditUrl, onEditName }: BuilderHeroProps) {
  const { avatarSrc, avatarAlt, eyebrow, name, primaryDomain, tierLabel, tierIconSrc, bio, stats, disclaimer, profileUrl } = data
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1800)
    })
  }, [profileUrl])

  useEffect(
    () => () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    },
    [],
  )

  return (
    <section className={styles.hero} aria-label="Builder profile">
      <div className={styles.heroInner}>
        <div className={styles.top}>
          <div className={styles.photoFrame}>
            <div className={styles.photoInner}>
              <Image src={avatarSrc} alt={avatarAlt} fill sizes="327px" className={styles.photo} />
            </div>
          </div>

          <div className={styles.info}>
            <p className={styles.eyebrow}>{eyebrow}</p>

            <div className={styles.nameGroup}>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{name}</h1>
                {editable && (
                  <button type="button" className={styles.editNameBtn} onClick={onEditName}>
                    <FiEdit2 aria-hidden="true" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
              <p className={styles.primaryDomain}>{primaryDomain}</p>
              <div className={styles.tierPill}>
                <Image src={tierIconSrc} alt="" width={20} height={20} className={styles.tierIcon} aria-hidden="true" />
                <span>{tierLabel}</span>
              </div>
            </div>

            <p className={styles.bio}>{bio}</p>

            <div className={styles.statsRow}>
              {stats.map(stat => (
                <div key={stat.id} className={styles.statCard}>
                  <div className={styles.statBody}>
                    <p className={`${styles.statValue} ${stat.variant === 'gold' ? styles.statValueGold : styles.statValueBlue}`}>
                      {stat.value}
                      {stat.unit && <span className={styles.statUnit}>{stat.unit}</span>}
                    </p>
                    <p className={styles.statLabel}>{stat.label}</p>
                    {typeof stat.progress === 'number' && (
                      <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${stat.progress}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.disclaimerRow}>
          <span className={styles.disclaimerDot} aria-hidden="true" />
          <p>{disclaimer}</p>
        </div>

        <div className={styles.linkBar}>
          <p className={styles.linkText}>{profileUrl}</p>
          {editable ? (
            <button type="button" className={styles.copyBtn} onClick={onEditUrl}>
              <FiEdit2 aria-hidden="true" />
              <span>Edit url</span>
            </button>
          ) : (
            <button type="button" className={styles.copyBtn} onClick={handleCopyLink}>
              <FiCopy aria-hidden="true" />
              <span>{copied ? 'Copied!' : 'Copy link'}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
