import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Breadcrumb.module.scss'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** The leading back arrow. Omitted = no arrow. */
  onBack?: () => void
  backLabel?: string
  className?: string
}

/**
 * Figma node 5:3572 (domain overview). The last item is the current page:
 * blue, `aria-current="page"`. The slash between crumbs is drawn by each
 * non-last item's own ::after (see the stylesheet), so there's no separator
 * element to key inside the .map() (design-system CLAUDE.md §4.4).
 */
export const Breadcrumb = ({ items, onBack, backLabel = 'Go back', className = '' }: BreadcrumbProps) => (
  <nav className={[styles.breadcrumb, className].filter(Boolean).join(' ')} aria-label="Breadcrumb">
    {onBack && (
      <button type="button" className={styles.back} onClick={onBack} aria-label={backLabel}>
        <Image src="/assets/img/breadcrumb/back-arrow.svg" alt="" aria-hidden="true" width={24} height={24} />
      </button>
    )}
    <ol className={styles.list}>
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1
        const itemClass = [styles.item, isCurrent ? styles.current : ''].filter(Boolean).join(' ')
        return (
          <li key={`${item.label}-${index}`} className={itemClass}>
            {item.href ? (
              <Link href={item.href} className={styles.link} aria-current={isCurrent ? 'page' : undefined}>
                {item.label}
              </Link>
            ) : (
              <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>
            )}
          </li>
        )
      })}
    </ol>
  </nav>
)

export default Breadcrumb
