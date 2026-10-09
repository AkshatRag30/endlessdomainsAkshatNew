import React from 'react'
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
        {/* Figma's ArrowBendUpLeft (public/assets/img/breadcrumb/back-arrow.svg), inline so it draws in currentColor. */}
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M21.7506 18.7504C21.7506 18.9493 21.6716 19.1401 21.5309 19.2807C21.3903 19.4214 21.1995 19.5004 21.0006 19.5004C20.8017 19.5004 20.6109 19.4214 20.4703 19.2807C20.3296 19.1401 20.2506 18.9493 20.2506 18.7504C20.2481 16.5631 19.3781 14.4662 17.8315 12.9195C16.2848 11.3729 14.1879 10.5029 12.0006 10.5004H4.8109L8.03122 13.7198C8.17195 13.8605 8.25101 14.0514 8.25101 14.2504C8.25101 14.4494 8.17195 14.6403 8.03122 14.781C7.89048 14.9218 7.69961 15.0008 7.50059 15.0008C7.30157 15.0008 7.1107 14.9218 6.96996 14.781L2.46996 10.281C2.40023 10.2114 2.34491 10.1287 2.30717 10.0376C2.26943 9.94657 2.25 9.84898 2.25 9.75042C2.25 9.65186 2.26943 9.55426 2.30717 9.46321C2.34491 9.37216 2.40023 9.28945 2.46996 9.21979L6.96996 4.71979C7.1107 4.57906 7.30157 4.5 7.50059 4.5C7.69961 4.5 7.89048 4.57906 8.03122 4.71979C8.17195 4.86052 8.25101 5.05139 8.25101 5.25042C8.25101 5.44944 8.17195 5.64031 8.03122 5.78104L4.8109 9.00042H12.0006C14.5856 9.00315 17.064 10.0313 18.8919 11.8591C20.7198 13.687 21.7479 16.1654 21.7506 18.7504Z" fill="currentColor" />
        </svg>
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
