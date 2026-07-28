import Image from 'next/image'
import styles from './DomainSearchPolygon.module.scss'

// Wide hexagonal frame behind the search bar, using the exact polygon asset from
// public/domain-search/. A soft white glow is overlaid on top, clipped to the same
// polygon shape and animated traveling from the center notch out to both edges.
export function DomainSearchPolygon() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <Image
        src="/domain-search/domainsearchpolygon.svg"
        alt=""
        width={1544}
        height={116}
        className={styles.polygon}
        unoptimized
      />
      <svg className={styles.glowOverlay} viewBox="0 0 1544 116" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#domain-search-polygon-glow-clip)">
          <circle className={styles.glowLeft} r="110" fill="white" />
          <circle className={styles.glowRight} r="110" fill="white" />
        </g>
        <defs>
          <clipPath id="domain-search-polygon-glow-clip">
            <path d="M604.263 86.6004L15.5001 86.6004L15.5001 21.6004L1523.5 21.6005L1523.5 86.6005L934.746 86.6005L917.791 115.6L621.306 115.6L604.263 86.6004Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

export default DomainSearchPolygon
