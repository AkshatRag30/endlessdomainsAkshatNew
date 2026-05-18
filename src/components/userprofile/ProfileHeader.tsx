import React from 'react'
import { RiArrowRightDoubleFill } from 'react-icons/ri'
import { Avatar } from '@/design-system/primitives/display/Avatar'
import styles from './ProfileHeader.module.scss'

export interface ProfileHeaderProps {
  avatarSrc?: string
  avatarAlt?: string
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarSrc = '/avatars/default.png',
  avatarAlt = 'User avatar',
}) => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <Avatar src={avatarSrc} alt={avatarAlt} size="lg" />
      <div className={styles.textRow}>
        <span className={styles.title}>Claim Your Identity</span>
        <RiArrowRightDoubleFill className={styles.chevrons} aria-hidden="true" />
      </div>
    </div>
    <div className={styles.underline} aria-hidden="true" />
  </header>
)

export default ProfileHeader
