import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiCalendar, FiMapPin, FiClock, FiEye } from 'react-icons/fi'
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
  const views = post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : String(post.views)

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
            <div className={styles.metaPill}>
              <FiCalendar size={11} aria-hidden="true" />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>
            {post.location && (
              <div className={styles.metaPill}>
                <FiMapPin size={11} aria-hidden="true" />
                <span>{post.location}</span>
              </div>
            )}
            <div className={styles.metaPill}>
              <FiEye size={11} aria-hidden="true" />
              <span>{views} views</span>
            </div>
          </div>

          {/* Title */}
          <h1 className={styles.title}>{post.title}</h1>

          {/* Author row */}
          <div className={styles.authorRow}>
            <div className={styles.avatarWrap}>
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className={styles.avatar}
              />
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{author.name}</span>
              <span className={styles.authorRole}>{author.role}</span>
            </div>
            <div className={styles.readTime}>
              <FiClock size={11} aria-hidden="true" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
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
