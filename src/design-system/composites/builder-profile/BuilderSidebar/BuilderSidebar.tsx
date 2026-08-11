import Link from 'next/link'
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa6'
import { FiArrowUpRight, FiEdit2 } from 'react-icons/fi'
import type { IconType } from 'react-icons'

import type { BuilderSocialLink, BuilderSocialPlatform } from '../types'
import styles from './BuilderSidebar.module.scss'

const PLATFORM_ICON: Record<BuilderSocialPlatform, IconType> = {
  facebook: FaFacebookF,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
}

interface BuilderSidebarProps {
  skills: string[]
  skillsNote: string
  socialLinks: BuilderSocialLink[]
  /** Owner view — shows an "Edit" control next to the Links heading */
  editable?: boolean
  onEditLinks?: () => void
}

export default function BuilderSidebar({
  skills,
  skillsNote,
  socialLinks,
  editable = false,
  onEditLinks,
}: BuilderSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Skills and links">
      <div className={styles.skillsBlock}>
        <div className={styles.headingRow}>
          <h2 className={styles.heading}>Skills</h2>
        </div>
        <ul className={styles.skillList}>
          {skills.map(skill => (
            <li key={skill} className={styles.skillPill}>
              {skill}
            </li>
          ))}
        </ul>
        <p className={styles.skillsNote}>{skillsNote}</p>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.linksBlock}>
        <div className={styles.headingRow}>
          <h2 className={styles.linksHeading}>Links</h2>
          {editable && (
            <button type="button" className={styles.editBtn} onClick={onEditLinks}>
              <FiEdit2 aria-hidden="true" />
              <span>Edit</span>
            </button>
          )}
        </div>
        <ul className={styles.linkList}>
          {socialLinks.map(link => {
            const PlatformIcon = PLATFORM_ICON[link.platform]
            return (
              <li key={link.id}>
                <Link href={link.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <span className={`${styles.platformIconBadge} ${styles[link.platform]}`} aria-hidden="true">
                    <PlatformIcon />
                  </span>
                  <span className={styles.linkText}>
                    <span className={styles.linkName}>{link.displayName}</span>
                    <span className={styles.linkHandle}>@{link.handle}</span>
                  </span>
                  <FiArrowUpRight className={styles.externalIcon} aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
