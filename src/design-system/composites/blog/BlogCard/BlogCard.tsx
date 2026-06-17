import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useCallback } from 'react'
import { FiEye, FiClock, FiCalendar, FiMapPin } from 'react-icons/fi'
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
  const [overImage, setOverImage] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY })
    setHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    setOverImage(false)
  }, [])

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={styles.card}
      aria-label={post.title}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Custom cursor */}
      <div
        className={`${styles.cursor} ${hovered ? styles.cursorVisible : ''} ${overImage ? styles.cursorOnImage : ''}`}
        style={{ '--cx': `${pos.x}px`, '--cy': `${pos.y}px` } as React.CSSProperties}
        aria-hidden="true"
      >
        <span className={styles.cursorText}>CLICK</span>
      </div>

      {/* Outer card polygon border */}
      <div className={styles.cardInner}>

        {/* Image polygon */}
        <div className={styles.imagePolygon} onMouseEnter={() => setOverImage(true)} onMouseLeave={() => setOverImage(false)}>
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
              <FiEye size={9} />
              {views}
            </span>
            <span className={styles.metaDivider} />
            <span className={styles.metaItem}>
              <FiClock size={9} />
              {formatDate(post.publishedAt)} · {post.readingTime} Min
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
                  <FiCalendar size={14} />
                  {formatDate(post.publishedAt)}
                </span>
                <span className={styles.footerSep} aria-hidden="true" />
                {post.location && (
                  <span className={styles.footerItem}>
                    <FiMapPin size={15} />
                    {post.location}
                  </span>
                )}
              </div>
              <div className={styles.authorGroup}>
                {author?.avatar && (
                  <div className={styles.avatarWrap}>
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      fill
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
    </Link>
  )
}

export default BlogCard
