import Image from 'next/image'
import Link from 'next/link'
import styles from './SearchBar.module.scss'
import Input from '@/design-system/primitives/LandingInput'

const DOMAIN_EXTENSIONS = [
  '.og', '.eth', '.sol', '.bnb', '.crypto', '.x', '.arb', '.polygon', '.ton', '.tez',
  '.bitcoin', '.nft', '.wallet', '.dao', '.blockchain', '.zil', '.stark', '.box', '.hodl', '.onchain',
] as const

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

        <div className={styles.domainList}>
          {/* Same footprint the static pills used; the list renders twice so the
              translateX(-50%) loop is seamless — the copy is hidden from screen readers. */}
          <div className={styles.marquee} role="list" aria-label="Popular domain extensions">
            <div className={styles.marqueeTrack}>
              {[...DOMAIN_EXTENSIONS, ...DOMAIN_EXTENSIONS].map((domain, index) => {
                const isCopy = index >= DOMAIN_EXTENSIONS.length
                return (
                  <span key={`${domain}-${index}`} role={isCopy ? undefined : 'listitem'} aria-hidden={isCopy || undefined}>
                    {domain}
                  </span>
                )
              })}
            </div>
          </div>
          <span className={styles.domainMoreItem}>
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
