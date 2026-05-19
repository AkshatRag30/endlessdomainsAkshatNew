import React, { useCallback } from 'react'

import styles from './DomainPagination.module.scss'

interface DomainPaginationProps {
  current: number
  total: number
  onPageChange: (page: number) => void
}

const MAX_VISIBLE = 3

function buildPages(current: number, total: number): (number | '...')[] {
  if (total <= MAX_VISIBLE + 2) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')

  pages.push(total)
  return pages
}

export function DomainPagination({ current, total, onPageChange }: DomainPaginationProps) {
  const pages = buildPages(current, total)

  const prev = useCallback(() => {
    if (current > 1) onPageChange(current - 1)
  }, [current, onPageChange])

  const next = useCallback(() => {
    if (current < total) onPageChange(current + 1)
  }, [current, total, onPageChange])

  if (total <= 1) return null

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <button
        className={styles.navBtn}
        type="button"
        onClick={prev}
        disabled={current === 1}
        aria-label="Previous page"
      >
        <span aria-hidden="true">&laquo;</span> Previous
      </button>

      <div className={styles.pages}>
        {pages.map((page, idx) =>
          page === '...' ? (
            React.createElement(React.Fragment, { key: `ellipsis-${idx}` },
              <span className={styles.ellipsis} aria-hidden="true">&hellip;</span>
            )
          ) : (
            React.createElement(React.Fragment, { key: page },
              <button
                className={[styles.pageBtn, page === current ? styles.pageBtnActive : ''].filter(Boolean).join(' ')}
                type="button"
                onClick={() => onPageChange(page as number)}
                aria-label={`Page ${page}`}
                aria-current={page === current ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ),
        )}
      </div>

      <button
        className={styles.navBtn}
        type="button"
        onClick={next}
        disabled={current === total}
        aria-label="Next page"
      >
        Next <span aria-hidden="true">&raquo;</span>
      </button>
    </nav>
  )
}
