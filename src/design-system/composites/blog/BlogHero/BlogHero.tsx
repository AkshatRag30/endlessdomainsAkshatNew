import React from 'react'
import styles from './BlogHero.module.scss'

export interface BlogHeroProps {
  postCount?: number
}

export function BlogHero({ postCount }: BlogHeroProps) {
  return (
    <section className={styles.section} aria-labelledby="blog-hero-heading">
      <div className={styles.inner}>
        <p className={styles.label}>ENDLESS DOMAINS · BLOG</p>

        <h1 id="blog-hero-heading" className={styles.heading}>
          Insights on Domains,{' '}
          <mark className={styles.accent}>Web3 &amp; Identity</mark>
        </h1>

        <p className={styles.description}>
          Deep dives, tutorials, and news from the frontlines of on-chain identity and
          multi-chain domain infrastructure.
        </p>

        {postCount !== undefined && (
          <p className={styles.count} aria-label={`${postCount} articles available`}>
            {postCount} articles
          </p>
        )}
      </div>
    </section>
  )
}

export default BlogHero
