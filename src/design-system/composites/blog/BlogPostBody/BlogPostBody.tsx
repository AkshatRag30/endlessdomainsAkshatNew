import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiEye, FiClock } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import styles from './BlogPostBody.module.scss'
import type { BlogSummary } from '@/data/blogs'
import type { TocItem } from '@/pages/blog/[slug]'

export interface BlogPostBodyProps {
  content: string
  toc: TocItem[]
  popularPosts: BlogSummary[]
  formatDate: (date: string) => string
}

export function BlogPostBody({ content, toc, popularPosts, formatDate }: BlogPostBodyProps) {
  const router = useRouter()
  const views = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? '')

  useEffect(() => {
    if (!toc.length) return
    // Small delay so the injected heading IDs are in the DOM before we query them
    const init = setTimeout(() => {
      const headings = toc.map(item => document.getElementById(item.id)).filter(Boolean) as HTMLElement[]
      if (!headings.length) return

      const observer = new IntersectionObserver(
        entries => {
          // Find the topmost heading that is intersecting
          const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          if (visible.length > 0) setActiveId(visible[0].target.id)
        },
        {
          // Trigger when heading enters the top 20% of the viewport
          rootMargin: '0px 0px -75% 0px',
          threshold: 0,
        }
      )

      headings.forEach(h => observer.observe(h))
      return () => observer.disconnect()
    }, 150)

    return () => clearTimeout(init)
  }, [toc])

  const handleTocClick = useCallback((id: string) => {
    setActiveId(id)
  }, [])

  return (
    <div className={styles.layout}>
      {/* Article content */}
      <article className={styles.article}>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
      </article>

      {/* Sidebar */}
      <aside className={styles.sidebar} aria-label="Sidebar">
        <div className={styles.sidebarInner}>

        {/* Blue CTA card */}
        <div className={styles.ctaCard}>
          <p className={styles.ctaEyebrow}>Your Web3 Identity</p>
          <h3 className={styles.ctaTitle}>Claim your .wallet domain today</h3>
          <p className={styles.ctaDesc}>One name for your wallet, dApps, and onchain presence. Lifetime ownership — no renewals, ever.</p>
          <div className={styles.ctaBtnWrap}>
            <PrimaryButton fullWidth onClick={() => router.push('/')} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>} iconPosition="right">
              Search For Your Domain
            </PrimaryButton>
          </div>
          <p className={styles.ctaMeta}>Starts at $5 · Lifetime ownership</p>
        </div>

        {/* Table of contents */}
        {toc.length > 0 && (
          <div className={styles.tocCard}>
            <p className={styles.cardLabel}>In this article</p>
            <ol className={styles.tocList}>
              {toc.map((item, i) => (
                <li key={item.id} className={`${styles.tocItem}${activeId === item.id ? ` ${styles.tocItemActive}` : ''}`}>
                  <a href={`#${item.id}`} className={styles.tocLink} onClick={() => handleTocClick(item.id)}>
                    <span className={styles.tocNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.tocText}>{item.text}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Popular this week */}
        {popularPosts.length > 0 && (
          <div className={styles.popularCard}>
            <p className={styles.cardLabel}>Popular this week</p>
            <ol className={styles.popularList}>
              {popularPosts.map((post, i) => (
                <li key={post.slug} className={styles.popularItem}>
                  <span className={styles.popularNum}>{i + 1}</span>
                  <div className={styles.popularContent}>
                    <Link href={`/blog/${post.slug}`} className={styles.popularTitle}>
                      {post.title}
                    </Link>
                    <div className={styles.popularMeta}>
                      <span className={styles.popularMetaItem}>
                        <FiEye size={11} aria-hidden="true" />
                        {views(post.views)}
                      </span>
                      <span className={styles.popularMetaDivider} aria-hidden="true" />
                      <span className={styles.popularMetaItem}>
                        <FiClock size={11} aria-hidden="true" />
                        {formatDate(post.publishedAt)} · {post.readingTime} Min
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        </div>
      </aside>
    </div>
  )
}

export default BlogPostBody
