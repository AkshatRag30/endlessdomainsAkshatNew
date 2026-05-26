import { useState, useCallback } from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { FiArrowRight, FiX } from 'react-icons/fi'
import { BsCheck2 } from 'react-icons/bs'
import {
  MdEmail,
  MdPhone,
} from 'react-icons/md'
import {
  FaTwitter,
  FaDiscord,
  FaTelegram,
  FaGithub,
  FaReddit,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
} from 'react-icons/fa'
import { TbWorld, TbFileDescription } from 'react-icons/tb'

import { PrimaryButton } from '@/design-system/primitives/button'
import styles from './ENSProfile.module.scss'

interface ENSProfileProps {
  domain: string
}

interface ProfileField {
  key: string
  label: string
  icon: React.ReactNode
  placeholder: string
  type?: string
}

const PROFILE_FIELDS: ProfileField[] = [
  { key: 'email',       label: 'Email',       icon: <MdEmail     size={18} aria-hidden="true" />, placeholder: 'user@example.com',   type: 'email' },
  { key: 'mobile',      label: 'Mobile',      icon: <MdPhone     size={18} aria-hidden="true" />, placeholder: '+1 234 567 8900' },
  { key: 'website',     label: 'Website',     icon: <TbWorld     size={18} aria-hidden="true" />, placeholder: 'https://yoursite.com', type: 'url' },
  { key: 'description', label: 'Description', icon: <TbFileDescription size={18} aria-hidden="true" />, placeholder: 'A short bio...' },
  { key: 'twitter',     label: 'Twitter',     icon: <FaTwitter   size={18} aria-hidden="true" />, placeholder: '@handle' },
  { key: 'discord',     label: 'Discord',     icon: <FaDiscord   size={18} aria-hidden="true" />, placeholder: 'username#0000' },
  { key: 'telegram',    label: 'Telegram',    icon: <FaTelegram  size={18} aria-hidden="true" />, placeholder: '@handle' },
  { key: 'github',      label: 'GitHub',      icon: <FaGithub    size={18} aria-hidden="true" />, placeholder: 'username' },
  { key: 'reddit',      label: 'Reddit',      icon: <FaReddit    size={18} aria-hidden="true" />, placeholder: 'u/username' },
  { key: 'instagram',   label: 'Instagram',   icon: <FaInstagram size={18} aria-hidden="true" />, placeholder: '@handle' },
  { key: 'linkedin',    label: 'LinkedIn',    icon: <FaLinkedin  size={18} aria-hidden="true" />, placeholder: 'linkedin.com/in/username' },
  { key: 'facebook',    label: 'Facebook',    icon: <FaFacebook  size={18} aria-hidden="true" />, placeholder: 'facebook.com/username' },
]

export function ENSProfile({ domain }: ENSProfileProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(PROFILE_FIELDS.map(f => [f.key, '']))
  )
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = useCallback((key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleSave = useCallback(() => {
    setShowSuccess(true)
  }, [])

  return (
    <>
      <section className={styles.section}>
        <div className={styles.titleRow}>
          <AiOutlineUser className={styles.titleIcon} aria-hidden="true" />
          <h2 className={styles.title}>Profile Records</h2>
        </div>

        <p className={styles.subtitle}>
          Set public profile information linked to {domain}. These records are stored on-chain and visible to anyone.
        </p>

        <div className={styles.body}>
          {PROFILE_FIELDS.map(field => (
            <div key={field.key} className={styles.fieldGroup}>
              <label htmlFor={`ens-profile-${field.key}`} className={styles.fieldLabel}>
                <span className={styles.fieldIcon}>{field.icon}</span>
                {field.label}
              </label>
              <input
                id={`ens-profile-${field.key}`}
                type={field.type ?? 'text'}
                className={styles.input}
                placeholder={field.placeholder}
                value={values[field.key]}
                onChange={e => handleChange(field.key, e.target.value)}
              />
            </div>
          ))}

          <PrimaryButton
            className={styles.actionBtn}
            onClick={handleSave}
            icon={<FiArrowRight aria-hidden="true" />}
            iconPosition="right"
          >
            Save Changes
          </PrimaryButton>
        </div>
      </section>

      {/* ── Success modal ──────────────────────────────────────────────────── */}
      {showSuccess && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Save successful"
          onClick={e => { if (e.target === e.currentTarget) setShowSuccess(false) }}
        >
          <div className={styles.modal}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setShowSuccess(false)}
              aria-label="Close"
            >
              <FiX size={18} aria-hidden="true" />
            </button>

            <div className={styles.iconWrap}>
              <div className={styles.iconOuter}>
                <div className={styles.iconInner}>
                  <BsCheck2 className={styles.checkIcon} aria-hidden="true" />
                </div>
              </div>
              <div className={styles.iconShadow} aria-hidden="true" />
            </div>

            <div className={styles.modalText}>
              <p className={styles.modalTitle}>Profile Updated</p>
              <p className={styles.modalSubtitle}>
                Your profile records have been saved successfully.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ENSProfile
