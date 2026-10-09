import Image from 'next/image'
import Link from 'next/link'
import styles from './SearchBar.module.scss'
import Input from '@/design-system/primitives/LandingInput'

const DOMAIN_EXTENSIONS = ['.og', '.eth', '.sol', '.bnb', '.crypto', '.x'] as const

const SearchBar = () => {
  return (
    <section className={styles.banner_search_section}>
      <div className={styles.bottom_bg_wrapper} aria-hidden="true">
        <Image
          src="/new-assets/hero-section/bottom-bg.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={80}
          className={styles.bottom_bg_img}
        />
      </div>
      <div className={styles.search_bg}>
        <Image
          src="/new-assets/hero-section/search-bg-mobile.avif"
          alt=""
          fill
          priority
          fetchPriority="high"
          aria-hidden="true"
          className={styles.search_bg_img_mobile}
        />
        <Image
          src="/new-assets/hero-section/search-bg.svg"
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={80}
          aria-hidden="true"
          className={styles.search_bg_img}
        />
        <Input className={styles.wideSearch} />

        <div
          className={styles.domainList}
          role="list"
          aria-label="Popular domain extensions"
        >
          {DOMAIN_EXTENSIONS.map((domain) => (
            <span key={domain} role="listitem">
              {domain}
            </span>
          ))}
          <span role="listitem" className={styles.domainMoreItem}>
            <Link href="/web3-domains" className={styles.domainMore} aria-label="See all 60+ TLDs and providers">
              60+ TLDs
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </span>
        </div>
      </div>
    </section>
  )
}

export default SearchBar
