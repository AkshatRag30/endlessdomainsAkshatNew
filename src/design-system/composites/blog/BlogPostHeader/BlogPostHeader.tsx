import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { PiArrowBendUpLeft } from 'react-icons/pi'
import styles from './BlogPostHeader.module.scss'
import type { BlogSummary } from '@/data/blogs'
import type { Author } from '@/data/authors'
import { formatDate } from '@/lib/blog-utils'

export interface BlogPostHeaderProps {
  post: BlogSummary
  author: Author
}

export function BlogPostHeader({ post, author }: BlogPostHeaderProps) {

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* Left column */}
        <div className={styles.left}>

          {/* Back link */}
          <Link href="/blog" className={styles.backLink} aria-label="Back to blog">
            <PiArrowBendUpLeft size={15} aria-hidden="true" />
            <span>Back to blog</span>
          </Link>

          {/* Category + meta row */}
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge} data-category={post.category}>
              {post.category}
            </span>
            <div className={styles.metaGroup}>
              <div className={styles.metaPill}>
                <FiCalendar size={16} aria-hidden="true" />
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </div>
              <span className={styles.metaDivider} aria-hidden="true" />
              <div className={styles.metaPill}>
                <div className={styles.avatarWrap}>
                  <Image src={author.avatar} alt={author.name} width={16} height={16} className={styles.avatar} />
                </div>
                <span className={styles.authorName}>{author.name}</span>
              </div>
              <span className={styles.metaDivider} aria-hidden="true" />
              <div className={styles.metaPill}>
                <FiMapPin size={16} aria-hidden="true" />
                <span>{post.location ?? 'Global'}</span>
              </div>
            </div>
          </div>

          {/* Title — first line black, rest gradient per Figma */}
          <h1 className={styles.title}>
            {post.title.includes(':')
              ? <>
                  {post.title.split(':')[0]}:<br />
                  <span className={styles.titleGradient}>{post.title.split(':').slice(1).join(':').trim()}</span>
                </>
              : <span className={styles.titleGradient}>{post.title}</span>
            }
          </h1>


        </div>

        {/* Right column — polygon-clipped image */}
        <div className={styles.right}>
          <div className={styles.imagePolygon}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className={styles.heroImage}
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>

      </div>
    </header>
  )
}

export default BlogPostHeader
