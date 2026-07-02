import { useState, useCallback } from 'react'
import { FiStar } from 'react-icons/fi'
import { HiOutlineClock } from 'react-icons/hi'
import { IoSunnyOutline } from 'react-icons/io5'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { GmChain } from '../gm.data'
import styles from './GmChainCard.module.scss'

function GasFeeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g clipPath="url(#gf-clip)">
        <path d="M6.33343 11.2836H1.78343C1.44949 11.2836 1.17812 11.0122 1.17812 10.6783V2.27217L1.99874 1.77776L2.99649 2.37901C3.11228 2.44889 3.25812 2.44889 3.3739 2.37901L4.37124 1.77817L5.36452 2.37901C5.48112 2.4497 5.62696 2.4497 5.74234 2.37942L6.73968 1.77857L7.73296 2.37942C7.84915 2.45011 7.99499 2.45011 8.11077 2.37982L9.10812 1.77898L9.92509 2.27298V4.85389C9.92509 5.05579 10.0888 5.21951 10.2907 5.21951C10.4926 5.21951 10.6563 5.05579 10.6563 4.85389V2.06701C10.6563 1.93904 10.5893 1.82042 10.48 1.7542L9.29784 1.0392C9.18206 0.968919 9.03621 0.968918 8.92002 1.03879L7.92268 1.63964L6.9294 1.03879C6.81362 0.968512 6.66778 0.968512 6.55159 1.03839L5.55424 1.63923L4.56096 1.03839C4.44478 0.968106 4.29893 0.968106 4.18315 1.03798L3.18499 1.63882L2.18724 1.03757C2.07146 0.9677 1.92562 0.9677 1.80984 1.03757L0.623588 1.75257C0.5139 1.81879 0.446869 1.93782 0.446869 2.06579V10.6783C0.446869 11.4152 1.04649 12.0149 1.78343 12.0149H6.33343C6.53534 12.0149 6.69906 11.8511 6.69906 11.6492C6.69906 11.4473 6.53534 11.2836 6.33343 11.2836Z" fill="currentColor"/>
        <path d="M8.68359 4.86324C8.68359 4.66134 8.51987 4.49762 8.31796 4.49762H2.78646C2.58456 4.49762 2.42084 4.66134 2.42084 4.86324C2.42084 5.06515 2.58456 5.22887 2.78646 5.22887H8.31796C8.51987 5.22887 8.68359 5.06515 8.68359 4.86324Z" fill="currentColor"/>
        <path d="M6.21967 6.85952C6.21967 6.65762 6.05595 6.4939 5.85405 6.4939H2.78686C2.58495 6.4939 2.42123 6.65762 2.42123 6.85952C2.42123 7.06143 2.58495 7.22515 2.78686 7.22515H5.85405C6.05595 7.22515 6.21967 7.06143 6.21967 6.85952Z" fill="currentColor"/>
        <path d="M2.78646 8.487C2.58456 8.487 2.42084 8.65072 2.42084 8.85262C2.42084 9.05453 2.58456 9.21825 2.78646 9.21825H5.27596C5.47787 9.21825 5.64159 9.05453 5.64159 8.85262C5.64159 8.65072 5.47787 8.487 5.27596 8.487H2.78646Z" fill="currentColor"/>
        <path d="M9.5355 8.56215C9.20969 8.4878 9.15566 8.41834 9.15687 8.4224C9.16297 8.33059 9.36081 8.2599 9.65615 8.2404C9.69312 8.4029 9.83897 8.52477 10.0128 8.52477C10.2147 8.52477 10.3785 8.36105 10.3785 8.15915C10.3785 7.98243 10.3057 7.81099 10.1786 7.6879C10.0787 7.59121 9.95231 7.53434 9.81825 7.51443C9.81094 7.31902 9.6525 7.1618 9.45547 7.1618C9.25356 7.1618 9.08984 7.32552 9.08984 7.52743V7.60584C8.56334 7.77971 8.4435 8.13762 8.42725 8.37243C8.39637 8.82174 8.71487 9.12562 9.37341 9.27512C9.68744 9.34662 9.75772 9.42299 9.75609 9.41852C9.75162 9.50302 9.53631 9.57818 9.25275 9.59768C9.21578 9.43477 9.07034 9.3129 8.89606 9.3129C8.69416 9.3129 8.53044 9.47662 8.53044 9.67852C8.53044 9.85727 8.60112 10.0242 8.72991 10.1481C8.82903 10.244 8.957 10.3033 9.09228 10.3228C9.1 10.5182 9.25803 10.6751 9.45506 10.6751C9.65697 10.6751 9.82069 10.5113 9.82069 10.3094V10.2318C10.3947 10.0425 10.4821 9.63505 10.4873 9.43559C10.4951 9.1378 10.3366 8.74455 9.5355 8.56215Z" fill="currentColor"/>
        <path d="M9.45667 5.82196C7.7492 5.82196 6.36023 7.21093 6.36023 8.9184C6.36023 10.6259 7.7492 12.0148 9.45667 12.0148C11.1641 12.0148 12.5531 10.6259 12.5531 8.9184C12.5531 7.21093 11.1637 5.82196 9.45667 5.82196ZM9.45667 11.2836C8.1526 11.2836 7.09148 10.2225 7.09148 8.9184C7.09148 7.61433 8.1526 6.55321 9.45667 6.55321C10.7607 6.55321 11.8219 7.61433 11.8219 8.9184C11.8219 10.2225 10.7607 11.2836 9.45667 11.2836Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="gf-clip">
          <rect width="13" height="13" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

interface GmChainCardProps {
  chain: GmChain
  onSayGm: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function GmChainCard({ chain, onSayGm, onToggleFavorite }: GmChainCardProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSayGm = useCallback(async () => {
    if (loading || done) return
    setLoading(true)
    // Simulate tx — replace with real on-chain call
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setDone(true)
    onSayGm(chain.id)
  }, [loading, done, chain.id, onSayGm])

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(chain.id)
  }, [chain.id, onToggleFavorite])

  return (
    <article className={`${styles.card} ${done ? styles.cardDone : ''}`} aria-label={`Say GM on ${chain.name}`}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.chainInfo}>
          {/* Chain logo placeholder — replaced by real SVG once assets in /public/gm/ */}
          <div className={styles.logoWrap} aria-hidden="true">
            <div className={styles.logoFallback}>{chain.name.charAt(0)}</div>
          </div>
          <span className={styles.chainName}>{chain.name}</span>
        </div>
        <button
          className={`${styles.favoriteBtn} ${chain.favorite ? styles.favoriteBtnActive : ''}`}
          onClick={handleFavorite}
          aria-label={chain.favorite ? `Remove ${chain.name} from favorites` : `Add ${chain.name} to favorites`}
          aria-pressed={chain.favorite}
        >
          <FiStar size={15} />
        </button>
      </div>

      {/* ── Meta row ── */}
      <div className={styles.metaRow}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Gas Fee</span>
          <span className={styles.metaValue}>
            <GasFeeIcon />
            {chain.gasFee}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Last GM</span>
          <span className={styles.metaValue}>
            <HiOutlineClock size={13} aria-hidden="true" className={styles.metaIcon} />
            {chain.lastGm}
          </span>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className={styles.btnWrap}>
        <PrimaryButton
          onClick={handleSayGm}
          disabled={loading || done}
          loading={loading}
          fullWidth
          icon={!loading && !done ? <IoSunnyOutline size={16} /> : undefined}
          iconPosition="left"
        >
          {loading ? 'Sending…' : done ? 'GM Sent ✓' : 'Say Gm'}
        </PrimaryButton>
      </div>

    </article>
  )
}

export default GmChainCard
