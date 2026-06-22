import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useCallback } from 'react'
import { FiEye, FiClock } from 'react-icons/fi'
import styles from './BlogCard.module.scss'
import type { BlogSummary } from '@/data/blogs'
import { getAuthorById } from '@/data/authors'
import { formatDate } from '@/lib/blog-utils'

interface BlogCardProps {
  post: BlogSummary
}

export function BlogCard({ post }: BlogCardProps) {
  const author = getAuthorById(post.authorId)
  const views = post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : String(post.views)

  const [hovered, setHovered] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => setHovered(false), [])

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={styles.card}
      aria-label={post.title}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip — follows cursor */}
      <span
        className={`${styles.tooltip} ${hovered ? styles.tooltipVisible : ''}`}
        style={{ '--tx': `${pos.x}px`, '--ty': `${pos.y}px` } as React.CSSProperties}
        aria-hidden="true"
      >Read whole blog</span>

      {/* Outer card polygon border */}
      <div className={styles.cardInner}>

        {/* Image polygon */}
        <div className={styles.imagePolygon}>
          <Image
            src={post.image}
            alt=""
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className={styles.categoryBadge} data-category={post.category}>
            {post.category}
          </span>
          <div className={styles.metaBadge} aria-hidden="true">
            <span className={styles.metaItem}>
              <FiClock size={9} />
              {post.readingTime} Min
            </span>
          </div>
        </div>

        {/* Content polygon */}
        <div className={styles.contentPolygon}>
          <div className={styles.contentInner}>
            <div className={styles.textGroup}>
              <h3 className={styles.title}>{post.title}</h3>
              <p className={styles.excerpt}>{post.excerpt}</p>
            </div>
            <div className={styles.divider} aria-hidden="true" />
            <div className={styles.footer}>
              <div className={styles.footerLeft}>
                <span className={styles.footerItem}>
                  {formatDate(post.publishedAt)}
                </span>
                <span className={styles.footerSep} aria-hidden="true" />
                <span className={styles.footerItem}>
                  <FiEye size={11} />
                  {views}
                </span>
              </div>
              <div className={styles.authorGroup}>
                {author?.avatar && (
                  <div className={styles.avatarWrap}>
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      width={18}
                      height={18}
                      className={styles.avatar}
                    />
                  </div>
                )}
                <span className={styles.authorName}>{author?.name ?? 'Endless Domains'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tooltip — last child so it paints above cardInner siblings */}
      <span
        className={`${styles.tooltip} ${hovered ? styles.tooltipVisible : ''}`}
        style={{ '--tx': `${pos.x}px`, '--ty': `${pos.y}px` } as React.CSSProperties}
        aria-hidden="true"
      >Read whole blog</span>
    </Link>
  )
}

export default BlogCard
