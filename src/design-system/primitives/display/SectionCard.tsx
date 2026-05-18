import React, { ReactNode } from 'react'
import styles from './SectionCard.module.scss'

export interface SectionCardProps {
  title: string
  children: ReactNode
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => (
  <section className={styles.card}>
    <div className={styles.titleRow}>
      <h2 className={styles.title}>{title}</h2>
    </div>
    <div className={styles.body}>{children}</div>
  </section>
)

export default SectionCard
