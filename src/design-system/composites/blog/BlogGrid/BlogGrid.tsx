import React from 'react'
import styles from './BlogGrid.module.scss'
import { BlogCard } from '../BlogCard'
import type { BlogSummary } from '@/data/blogs'

export interface BlogGridProps {
  posts: BlogSummary[]
  emptyMessage?: string
  gridRef?: React.RefObject<HTMLUListElement>
  onScroll?: () => void
  scrollable?: boolean
}

export function BlogGrid({ posts, emptyMessage = 'No articles found.', gridRef, onScroll, scrollable }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <p className={styles.emptyText}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ul className={styles.grid} aria-label="Blog articles" ref={gridRef} onScroll={onScroll} data-scrollable={scrollable ? 'true' : undefined}>
      {posts.map(post => (
        <li key={post.id} className={`${styles.item}${scrollable ? ` ${styles.itemSnap}` : ''}`}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  )
}

export default BlogGrid
