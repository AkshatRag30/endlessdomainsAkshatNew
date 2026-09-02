import React, { useCallback, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import { BlogCard } from './BlogCard'
import type { BlogSummary } from '@/data/landingBlogSummary'
import styles from './DomainBlogTeaser.module.scss'

const FEATURED_COUNT = 6

interface DomainBlogTeaserProps {
  posts?: BlogSummary[]
}

export function DomainBlogTeaser({ posts: postsProp = [] }: DomainBlogTeaserProps) {
  const posts = postsProp.slice(0, FEATURED_COUNT)

  // Same prev/next-arrow-over-a-scrollable-row pattern as the blog post page's
  // "More Articles" slider (pages/blog/[slug].tsx) — ported here since .row is a
  // plain div rather than that page's <ul>, and .cardWrap stands in for its <li>.
  const rowRef = useRef<HTMLDivElement | null>(null)
  const roRef = useRef<ResizeObserver | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const updateArrows = useCallback((el: HTMLDivElement) => {
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    const max = el.scrollWidth - el.clientWidth
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0)
  }, [])

  const setRowRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (roRef.current) {
        roRef.current.disconnect()
        roRef.current = null
      }
      rowRef.current = el
      if (!el) return
      requestAnimationFrame(() => updateArrows(el))
      const ro = new ResizeObserver(() => requestAnimationFrame(() => updateArrows(el)))
      ro.observe(el)
      roRef.current = ro
    },
    [updateArrows]
  )

  const handleScroll = useCallback(() => {
    if (rowRef.current) updateArrows(rowRef.current)
  }, [updateArrows])

  const slide = useCallback(
    (dir: 'prev' | 'next') => {
      const el = rowRef.current
      if (!el) return
      const card = el.querySelector('[role="listitem"]') as HTMLElement | null
      const cardWidth = card ? card.getBoundingClientRect().width : el.clientWidth / 3
      const target = el.scrollLeft + (dir === 'next' ? cardWidth : -cardWidth)
      el.scrollTo({ left: target, behavior: 'smooth' })
      setTimeout(() => updateArrows(el), 400)
    },
    [updateArrows]
  )

  if (!posts.length) return null

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

      <div className={styles.controlsRow}>
        <div className={styles.sliderBtns}>
          <button
            type="button"
            className={styles.sliderBtn}
            onClick={() => slide('prev')}
            disabled={!canPrev}
            aria-label="Previous posts"
          >
            <FiChevronLeft size={18} aria-hidden="true" />
          </button>
          <div className={styles.sliderProgress} aria-hidden="true">
            <div className={styles.sliderProgressFill} style={{ width: `${scrollProgress * 100}%` }} />
          </div>
          <button
            type="button"
            className={styles.sliderBtn}
            onClick={() => slide('next')}
            disabled={!canNext}
            aria-label="Next posts"
          >
            <FiChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.row} role="list" aria-label="Latest blog posts" ref={setRowRef} onScroll={handleScroll}>
        {posts.map(post => (
          <div className={styles.cardWrap} key={post.slug} role="listitem">
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default DomainBlogTeaser
