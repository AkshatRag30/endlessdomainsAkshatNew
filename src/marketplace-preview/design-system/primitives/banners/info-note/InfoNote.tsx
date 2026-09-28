import React from 'react'
import Image from 'next/image'
import styles from './InfoNote.module.scss'

export interface InfoNoteProps {
  children: React.ReactNode
  className?: string
}

/**
 * The domain overview's small "ⓘ" footnote (Figma 5:5149, 5:7586, 5:7686):
 * a 13.5px info icon and 12px muted text. Unlike NoticeBanner it has no box
 * or tone, it's just a caption. Wraps onto more lines with the icon pinned
 * to the first.
 */
export const InfoNote = ({ children, className = '' }: InfoNoteProps) => (
  <p className={[styles.note, className].filter(Boolean).join(' ')}>
    <Image src="/assets/img/domain-overview/info.svg" alt="" aria-hidden="true" width={13.5} height={13.5} className={styles.icon} />
    <span>{children}</span>
  </p>
)

export default InfoNote
