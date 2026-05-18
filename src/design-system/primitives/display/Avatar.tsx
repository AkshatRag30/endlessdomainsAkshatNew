import React from 'react'
import styles from './Avatar.module.scss'

export interface AvatarProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => (
  <div className={`${styles.wrapper} ${styles[size]}`}>
    <img src={src} alt={alt} className={styles.img} />
  </div>
)

export default Avatar
