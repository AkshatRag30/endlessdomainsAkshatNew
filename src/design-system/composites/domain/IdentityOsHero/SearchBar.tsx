import Image from 'next/image'
import styles from './SearchBar.module.scss'
import Input from '@/design-system/primitives/LandingInput'

const DOMAIN_EXTENSIONS = ['.og', '.eth', '.sol', '.chain'] as const

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
          <span role="listitem" className={styles.domainMore}>60+ TLDs</span>
        </div>
      </div>
    </section>
  )
}

export default SearchBar
