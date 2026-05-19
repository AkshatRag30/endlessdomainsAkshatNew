import Image from 'next/image'
import React from 'react'
import styles from './Avatar.module.scss'

export interface AvatarProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => (
  <div className={`${styles.wrapper} ${styles[size]}`}>
    <Image src={src} alt={alt} fill className={styles.img} />
  </div>
)

export default Avatar
