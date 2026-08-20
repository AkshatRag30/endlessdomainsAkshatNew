import React from 'react'

import { BlogCard } from '@/design-system/composites/blog'
import { BLOGS } from '@/data/blogs'
import styles from './DomainBlogTeaser.module.scss'

const FEATURED_COUNT = 6

export function DomainBlogTeaser() {
  const posts = BLOGS.slice(0, FEATURED_COUNT)

  return (
    <section className={styles.section} aria-labelledby="domain-blog-teaser-heading">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.eyebrowWrap}>
            <span className={styles.eyebrowBracketTL} aria-hidden="true" />
            <span className={styles.eyebrowBracketTR} aria-hidden="true" />
            <span className={styles.eyebrowBracketBL} aria-hidden="true" />
            <span className={styles.eyebrowBracketBR} aria-hidden="true" />
            <p className={styles.eyebrowText}>Latest From Identity OS</p>
          </div>

          <h2 id="domain-blog-teaser-heading" className={styles.heading}>
            <span className={styles.headingPlain}>What&apos;s New About </span>
            <span className={styles.headingAccent}>Endless Domains.</span>
          </h2>
        </div>

        <p className={styles.headerDescription}>
          Stay close to every milestone, every integration, and every community moment that is pushing on-chain identity forward. This is where the OS
          tells its own story.
        </p>
      </div>

      <div className={styles.row} role="list" aria-label="Latest blog posts">
        {posts.map(post => (
          <div className={styles.cardWrap} key={post.id} role="listitem">
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default DomainBlogTeaser
